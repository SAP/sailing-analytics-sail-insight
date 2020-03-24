import ExpeditionCommunication, { Server1 } from 'sail-insight-expedition-communication'

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
        //#L,P,16.9903666666667,-61.7697833333333*3E

        const startPin = `#L,P,${startLine.pinLatitude},${startLine.pinLongitude}`
        const startBoat = `#L,P,${startLine.boatLatitude},${startLine.boatLongitude}`

        ExpeditionCommunication.clearMessages(Server1)

        sendServerMessage(startPin)
        sendServerMessage(startBoat)
    } else {
        ExpeditionCommunication.clearMessages(Server1)
    }
    
}