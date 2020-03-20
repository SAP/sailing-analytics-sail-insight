import CommunicationBoat from 'react-native-communication-boat'
import { updateServerProtocol, updateServerIP, updateServerPort, updateServerState, updateServerValid } from 'actions/communications'
import { getStartLine } from 'selectors/communications'
import { getStore } from 'store'


export const getServerInfo = () => {
    let store = getStore()

    if (CommunicationBoat.Server1 && CommunicationBoat.Server1Protocol) {
        store.dispatch(updateServerState(false))
        store.dispatch(updateServerProtocol(CommunicationBoat.Server1Protocol))
        CommunicationBoat.getCommunicationIP(CommunicationBoat.Server1, (ip: string) => {
            store.dispatch(updateServerIP(ip))
            CommunicationBoat.getCommunicationPort(CommunicationBoat.Server1, (port: number) => {
                store.dispatch(updateServerPort(port))
                store.dispatch(updateServerValid(true))
            })
        })
    }
}

export const setServerState = (state: boolean) => {
    let store = getStore()

    if (CommunicationBoat.Server1 && CommunicationBoat.Server1Protocol) {
        if (state === true) {
            CommunicationBoat.startCommunication(CommunicationBoat.Server1)
            store.dispatch(updateServerState(true))
        } else {
            CommunicationBoat.stopCommunication(CommunicationBoat.Server1)
            store.dispatch(updateServerState(false))
        }
    }
}

export const sendServerMessage = (message: string) => {
    if (CommunicationBoat.Server1 && CommunicationBoat.Server1Protocol) {
        CommunicationBoat.sendCommunicationMessage(CommunicationBoat.Server1, message)
    }
}

export const sendStartLine = () => {
    const startLine: any = getStartLine(getStore().getState())

    if (startLine.pinLongitude && startLine.pinLongitude && startLine.boatLatitude && startLine.boatLongitude) {
        //#L,P,16.9897166666667,-61.7854166666667*3F
        //#L,P,16.9903666666667,-61.7697833333333*3E

        const startPin = `#L,P,${startLine.pinLatitude},${startLine.pinLongitude}*3F`
        const startBoat = `#L,P,${startLine.boatLatitude},${startLine.boatLongitude}*3E`

        sendServerMessage(startPin)
        sendServerMessage(startBoat)
    }
    
}