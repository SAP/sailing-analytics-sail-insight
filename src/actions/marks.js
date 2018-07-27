import * as api from 'api'
import { fetchEntityFunction } from 'helpers/actions'


export const fetchMark = fetchEntityFunction(api.requestMark)
