import { tokenSigner } from 'api/authorization'
import { HttpMethods, urlGenerator } from 'api/config'
import {
  AddRaceColumnResponseData,
  AddRaceColumnsBody,
  CompetitorBody,
  CompetitorResponseData,
  CreateEventBody,
  CreateEventResponseData,
  SetTrackingTimesBody,
  StartTrackingBody,
  StopTrackingBody,
} from 'api/endpoints/types'
import { dataRequest } from 'api/handler'


const getUrl = urlGenerator()

const apiEndpoints = {
  createEvent: getUrl('/events/createEvent'),
  addRaceColumns: getUrl('/regattas/{0}/addracecolumns'),
  startTracking: getUrl('/leaderboards/{0}/starttracking'),
  stopTracking: getUrl('/leaderboards/{0}/stoptracking'),
  setTrackingTimes: getUrl('/leaderboards/{0}/settrackingtimes'),
  createAndAddCompetitor: getUrl('/regattas/{0}/competitors/createandadd'),
}

export default {
  createEvent: (token: string, body: CreateEventBody) => dataRequest(
    apiEndpoints.createEvent(),
    {
      body,
      method: HttpMethods.POST,
      bodyType: 'x-www-form-urlencoded',
      signer: tokenSigner(token),
    },
  ) as Promise<CreateEventResponseData>,
  addRaceColumns: (token: string, regattaName: string, data?: AddRaceColumnsBody) => dataRequest(
    apiEndpoints.addRaceColumns({ urlParams: data, pathParams: [regattaName] }),
    {
      method: HttpMethods.POST,
      signer: tokenSigner(token),
    },
  ) as Promise<AddRaceColumnResponseData[]>,
  startTracking: (token: string, leaderboardName: string, data: StartTrackingBody) => dataRequest(
    apiEndpoints.startTracking({ pathParams: [leaderboardName], urlParams: data }),
    {
      method: HttpMethods.POST,
      signer: tokenSigner(token),
    },
  ),
  stopTracking: (token: string, leaderboardName: string, data?: StopTrackingBody) => dataRequest(
    apiEndpoints.stopTracking({ pathParams: [leaderboardName], urlParams: data }),
    {
      method: HttpMethods.POST,
      signer: tokenSigner(token),
    },
  ),
  setTrackingTimes: (token: string, leaderboardName: string, data: SetTrackingTimesBody) => dataRequest(
    apiEndpoints.setTrackingTimes({ pathParams: [leaderboardName], urlParams: data }),
    {
      method: HttpMethods.POST,
      signer: tokenSigner(token),
    },
  ),
  createAndAddCompetitor: (token: string, regattaName: string, data?: CompetitorBody) => dataRequest(
    apiEndpoints.createAndAddCompetitor({ pathParams: [regattaName], urlParams: data }),
    { method: HttpMethods.POST, signer: tokenSigner(token) },
  ) as Promise<CompetitorResponseData>,
}
