import ExpeditionCommunication, { Server1, Server1Protocol } from 'sail-insight-expedition-communication'
import { NetworkInfo } from "react-native-network-info"

import { updateServerProtocol, updateServerIP, updateServerPort, updateServerState, updateServerValid } from 'actions/communications'
import { getStartLine } from 'selectors/communications'
import { getStore } from 'store'

const Server1Port = 8001
let Server1IP = "0.0.0.0"

const getServerState = () => {
    ExpeditionCommunication.getCommunicationStatus(Server1, (status: boolean) => {
        let store = getStore()
        store.dispatch(updateServerState(status))
    })
}

export const getServerInfo = () => {
    let store = getStore()

    store.dispatch(updateServerValid(false))
    store.dispatch(updateServerPort(Server1Port))
    store.dispatch(updateServerProtocol(Server1Protocol))
    
    // get wifi address
    NetworkInfo.getIPV4Address().then(ipWifi => {
        if (ipWifi) {
            Server1IP = ipWifi
            store.dispatch(updateServerValid(true))
        }
        store.dispatch(updateServerIP(ipWifi))
    })
    // get server state
    getServerState()
}

export const setServerState = (state: boolean) => {
    let store = getStore()

    if (state === true) {
        ExpeditionCommunication.startCommunication(Server1, Server1IP, Server1Port)
        store.dispatch(updateServerState(true))
    } else {
        ExpeditionCommunication.stopCommunication(Server1)
        store.dispatch(updateServerState(false))
    }
}

export const sendServerMessage = (message: string) => {
    ExpeditionCommunication.sendCommunicationMessage(Server1, message)
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