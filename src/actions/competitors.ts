import * as api from 'api'
import { fetchEntityAction } from 'helpers/actions'


export const fetchCompetitor = fetchEntityAction(api.requestCompetitor)
