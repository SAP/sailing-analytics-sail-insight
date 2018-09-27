import { DispatchType, GetStateType } from 'helpers/types'
import I18n from 'i18n'
import { createSharingData, SharingData, showShareSheet } from 'integrations/DeepLinking'
import { TrackingSession } from 'models'
import { getFormValues } from 'selectors/form'
import { formValuesToSession, SessionException } from 'services/SessionService'


export const shareSession = (session: TrackingSession) => async () => {
  if (!session) {
    throw new SessionException('empty session.')
  }
  const sharingData: SharingData = {
    title: session.name,
    // TODO: venue from generated event?
    contentDescription: I18n.t('text_share_session_description', { venue: 'HAVEL' }),
    // contentImageUrl: session.image,
    // contentMetadata: {
      //   customMetadata: {
        //     sessionId: session.id
    //   },
    // },
  }
  const shareOptions = {
    messageHeader: I18n.t('text_share_session_message_header'),
    messageBody: I18n.t('text_share_session_message_body'),
  }
  return showShareSheet(await createSharingData(sharingData, shareOptions))
}

export const shareSessionFromForm = (formName: string) => async (dispatch: DispatchType, getState: GetStateType) => {
  const sessionValues = getFormValues(formName)(getState())
  return dispatch(shareSession(formValuesToSession(sessionValues)))
}
