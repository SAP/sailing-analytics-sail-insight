import Realm from 'realm'
import { GPS_REQUEST_SCHEMA, GPS_SCHEMA } from './schemas'


const realm = new Realm({ schema: [GPS_SCHEMA, GPS_REQUEST_SCHEMA] })

export default realm
