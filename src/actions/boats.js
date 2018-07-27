import * as api from 'api'
import { fetchEntityFunction } from 'helpers/actions'


export const fetchBoat = fetchEntityFunction(api.requestBoat)
