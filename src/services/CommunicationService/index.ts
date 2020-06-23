import ExpeditionCommunication, { Server1 } from 'sail-insight-expedition-communication'
import { Platform } from 'react-native'

const fixDigits = 7

export const getServerState = () => {
    return new Promise((resolve) => {
        ExpeditionCommunication.getCommunicationStatus(Server1, (status: boolean) => {
            resolve(status)
        })
    })
}

export const setServerState = (state: boolean, ip: string, port: number) => {
    if (state === true) {
        ExpeditionCommunication.startCommunication(Server1, ip, port)
    } else {
        ExpeditionCommunication.stopCommunication(Server1)
    }
}

export const sendServerMessage = (message: string) => {
    ExpeditionCommunication.sendCommunicationMessage(Server1, message)
}

export const sendStartLine = (startLine: any) => {

    if (startLine.pinLongitude && startLine.pinLongitude && startLine.boatLatitude && startLine.boatLongitude) {
        //#L,P,16.9897166666667,-61.7854166666667*3F
        //#L,S,16.9903666666667,-61.7697833333333*3E

        let startPin = `#L,P,${startLine.pinLatitude.toFixed(fixDigits)},${startLine.pinLongitude.toFixed(fixDigits)}`
        let startBoat = `#L,S,${startLine.boatLatitude.toFixed(fixDigits)},${startLine.boatLongitude.toFixed(fixDigits)}`

        startPin = startPin + '*' + getChecksum(startPin) + '\r\n'
        startBoat = startBoat + '*' + getChecksum(startBoat) + '\r\n'
 
        ExpeditionCommunication.clearMessages(Server1)

        sendServerMessage(startPin)
        sendServerMessage(startBoat)
    } else {
        ExpeditionCommunication.clearMessages(Server1)
    }
    
}

export const updateSettings = (settings: any) => {
    ExpeditionCommunication.configureCommunication(settings)
}

export const keepServerAlive = () => {
    if (Platform.OS === 'ios') {
        ExpeditionCommunication.keepServerAlive(Server1)
    }
}

const getChecksum = (text: String) => {
    let bytes = []
    let checksum = 0
    for (let i = 0; i < text.length; i++) {
        bytes.push(text.charCodeAt(i));
    }

    for (let i = 0; i < bytes.length; i++) {
        checksum = checksum ^ bytes[i]
    }

    let checksumHex = ('0' + (checksum & 0xFF).toString(16)).slice(-2).toUpperCase()

    return checksumHex
}