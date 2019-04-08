import uuidv1 from 'uuid/v1'
import uuidv5 from 'uuid/v5'

const DEVICE_UUID_NAMESPACE = '7a6d6c8f-c634-481d-8443-adcd36c869ea'

export const getDeviceUuid = (id: string) => uuidv5(id, DEVICE_UUID_NAMESPACE)
export const getSharingUuid = () => uuidv1()
export const getRaceLogUuid = () => uuidv1()
