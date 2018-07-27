import * as api from 'api'
import { fetchEntityFunction } from 'helpers/actions'


export const fetchCompetitor = fetchEntityFunction(api.requestCompetitor)
