import * as api from 'api'
import { fetchEntityAction } from 'helpers/actions'


export const fetchEvent = fetchEntityAction(api.requestEvent)
