import * as api from 'api'
import { fetchEntityAction } from 'helpers/actions'


export const fetchMark = fetchEntityAction(api.requestMark)
