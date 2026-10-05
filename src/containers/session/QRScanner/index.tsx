import React, { useEffect, useRef, useState } from 'react'
import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
import { connect } from 'react-redux'

import { fetchCheckIn } from 'actions/checkIn'
import { showNetworkRequiredAlert } from 'helpers/network'
import { getErrorTitle, getInvitationErrorMessage } from 'helpers/texts'
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

    const handleValueRef = useRef<(value?: string) => void>(() => {})

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
            // allow the same code again after reconnecting; the delay keeps the
            // continuously scanning camera from stacking alerts
            setTimeout(() => { lastValueRef.current = null }, 3000)
            return
        }

        try {
            setBusy(true)
            const checkIn = await fetchCheckIn(value)

            navigation.goBack()
            // pop: reuse an already-open JoinRegatta instead of stacking a
            // second one (same as joinLinkInvitation)
            navigation.navigate(Screens.JoinRegatta, { data: checkIn }, { pop: true })
        } catch (err: any) {
            Alert.alert(
                getErrorTitle(),
                getInvitationErrorMessage(err),
                [{ text: I18n.t('caption_ok'), onPress: () => { lastValueRef.current = null } }],
                { cancelable: false }
            )
        } finally {
            setBusy(false)
        }
    }

    handleValueRef.current = handleValue

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes) => {
            const first = codes?.[0]
            if (first?.value) handleValueRef.current(first.value)
        },
    })

    if (hasPermission === false) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white', textAlign: 'center', marginHorizontal: 24 }}>{I18n.t('text_camera_permission_required')}</Text>
                <TouchableOpacity
                    testID="e2e-open-app-settings"
                    style={{ marginTop: 16, padding: 12, borderWidth: 2, borderColor: 'white' }}
                    onPress={() => Linking.openSettings()}>
                    <Text style={{ color: 'white' }}>{I18n.t('caption_open_settings').toUpperCase()}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }

    if (!device || hasPermission == null) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white' }}>{I18n.t('text_loading_camera')}</Text>
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
