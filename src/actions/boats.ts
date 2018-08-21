import api from 'api'
import { fetchEntityAction } from 'helpers/actions'


export const fetchBoat = fetchEntityAction(api.requestBoat)
