import React, { useEffect, useRef, useState } from 'react'
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
import { connect } from 'react-redux'

import { fetchCheckIn } from 'actions/checkIn'
import Logger from 'helpers/Logger'
import { showNetworkRequiredAlert } from 'helpers/network'
import { getErrorDisplayMessage, getErrorTitle } from 'helpers/texts'
import I18n from 'i18n'
import WaveActivityIndicatorFullscreen from 'components/WaveActivityIndicatorFullscreen'
import { isNetworkConnected } from 'selectors/network'
import * as Screens from 'navigation/Screens'

type Props = {
    navigation: any
    route?: any
    fetchCheckIn: (qr: string) => Promise<any>
    isNetworkConnected: boolean
}

const QRScanner = ({ navigation, route, fetchCheckIn, isNetworkConnected }: Props) => {
    const device = useCameraDevice('back')
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const [busy, setBusy] = useState(false)
    const lastValueRef = useRef<string | null>(null)

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission()
            setHasPermission(status === 'granted')
        })()
    }, [])

    const handleValue = async (value?: string) => {
        if (!value || busy) return
        if (lastValueRef.current === value) return
        lastValueRef.current = value

        console.log('[VisionCamera] QR value:', value)

        // If a callback was provided by the previous screen, use it and go back, optional
        const cb = route?.params?.onRead
        if (typeof cb === 'function') {
            try { cb({ data: value }) } catch {}
            navigation.goBack()
            return
        }

        // Original behavior: fetch check-in (with network guard)
        if (!isNetworkConnected) {
            showNetworkRequiredAlert()
            // navigation.goBack()
            return
        }

        try {
            setBusy(true)
            const checkIn = await fetchCheckIn(value)

            navigation.goBack()
            navigation.navigate(Screens.JoinRegatta, { data: checkIn })
        } catch (err: any) {
            Alert.alert(
                getErrorTitle(),
                getErrorDisplayMessage(err),
                [{ text: I18n.t('caption_ok'), onPress: () => { lastValueRef.current = null } }],
                { cancelable: false }
            )
        } finally {
            setBusy(false)
        }
    }

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'], // add more types if you need them
        onCodeScanned: (codes) => {
            const first = codes?.[0]
            if (first?.value) handleValue(first.value)
        },
    })

    if (hasPermission === false) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white' }}>{'Camera permission is required'}</Text>
            </SafeAreaView>
        )
    }

    if (!device || hasPermission == null) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white' }}>{'Loading camera…'}</Text>
            </SafeAreaView>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <Camera
                style={{ flex: 1 }}
                device={device}
                isActive={!busy}
                codeScanner={codeScanner}
                photo={false}
                video={false}
                audio={false}
            />

            {busy && <WaveActivityIndicatorFullscreen />}


            <View style={{ position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center' }}>
                <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}>
                    <Text style={{ color: 'white' }}>{I18n.t('text_place_QR_code')}</Text>
                </View>
            </View>
        </View>
    )
}

const mapStateToProps = (state: any) => ({
    isNetworkConnected: isNetworkConnected(state),
})

export default connect(mapStateToProps, { fetchCheckIn })(QRScanner)
