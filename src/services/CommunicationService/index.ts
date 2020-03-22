import ExpeditionCommunication from 'sail-insight-expedition-communication'
import { updateServerProtocol, updateServerIP, updateServerPort, updateServerState, updateServerValid } from 'actions/communications'
import { getStartLine } from 'selectors/communications'
import { getStore } from 'store'

const getServerState = () => {
    if (ExpeditionCommunication.Server1 && ExpeditionCommunication.Server1Protocol) {
        ExpeditionCommunication.getCommunicationStatus(ExpeditionCommunication.Server1, (status: boolean) => {
            let store = getStore()
            store.dispatch(updateServerState(status))
        })
    }
}

export const getServerInfo = () => {
    let store = getStore()

    if (ExpeditionCommunication.Server1 && ExpeditionCommunication.Server1Protocol) {
        store.dispatch(updateServerState(false))
        store.dispatch(updateServerProtocol(ExpeditionCommunication.Server1Protocol))
        ExpeditionCommunication.getCommunicationIP(ExpeditionCommunication.Server1, (ip: string) => {
            store.dispatch(updateServerIP(ip))
            ExpeditionCommunication.getCommunicationPort(ExpeditionCommunication.Server1, (port: number) => {
                store.dispatch(updateServerPort(port))
                store.dispatch(updateServerValid(true))
                getServerState()
            })
        })
    }
}

export const setServerState = (state: boolean) => {
    let store = getStore()

    if (ExpeditionCommunication.Server1 && ExpeditionCommunication.Server1Protocol) {
        if (state === true) {
            ExpeditionCommunication.startCommunication(ExpeditionCommunication.Server1)
            store.dispatch(updateServerState(true))
        } else {
            ExpeditionCommunication.stopCommunication(ExpeditionCommunication.Server1)
            store.dispatch(updateServerState(false))
        }
    }
}

export const sendServerMessage = (message: string) => {
    if (ExpeditionCommunication.Server1 && ExpeditionCommunication.Server1Protocol) {
        ExpeditionCommunication.sendCommunicationMessage(ExpeditionCommunication.Server1, message)
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