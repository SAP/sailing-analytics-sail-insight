import Realm from 'realm'
import { GPS_SCHEMA } from './schemas'


const realm = new Realm({ schema: [GPS_SCHEMA] })

export default realm
