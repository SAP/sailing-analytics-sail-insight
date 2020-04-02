import SailInsightMtcpNetwork from 'sail-insight-mtcp-network/index'
import { isPlatformIOS } from "../../environment";

export const updateSettings = (settings: any) => {
    if (isPlatformIOS) {
        SailInsightMtcpNetwork.configure(settings)
    }
}
