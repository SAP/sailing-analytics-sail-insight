import React from 'react'
import { View } from 'react-native'

import Images from '@assets/Images'
import { button, container } from 'styles/commons'
import styles from './styles'

import ImageButton from 'components/ImageButton'
import LineSeparator from 'components/LineSeparator'
import PropertyView from 'components/PropertyView'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import I18n from 'i18n'
import { Session } from 'models'
import { connect } from 'react-redux'
import { getBoat } from 'selectors/boat'

class TrackingSetup extends React.Component<{
  navigation: any,
  session: Session,
  boat: any,
} > {

  public render() {
    const empty = I18n.t('text_empty_value_placeholder')
    const {
      session,
      boat,
    } = this.props
    return (
      <ScrollContentView>
        <View style={container.stretchContent}>
          <View style={styles.infoContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>TITLE</Text>
              <ImageButton
                style={styles.edit}
                source={Images.actions.pen}
              />
            </View>
            <PropertyView
              style={styles.keyValue}
              propertyKey={I18n.t('text_track_name')}
              propertyValue={session.trackName}
            />
            <PropertyView
              style={styles.keyValue}
              propertyKey={I18n.t('text_boat')}
              propertyValue={session.boatName}
            />
            <PropertyView
              style={styles.keyValue}
              propertyKey={I18n.t('text_number')}
              propertyValue={session.sailNumber}
            />
            <PropertyView
              style={styles.keyValue}
              propertyKey={I18n.t('text_class')}
              propertyValue={(boat && boat.class) || empty} // TODO: get class property
            />
            <PropertyView
              style={styles.keyValue}
              propertyKey={I18n.t('text_team_name')}
              propertyValue={session.teamName}
            />
            <PropertyView
              style={styles.keyValue}
              propertyKey={I18n.t('text_privacy_setting')}
              propertyValue={session.privacySetting}
            />
          </View>
          <View style={styles.shareContainer}>
            <LineSeparator/>
            <TextButton
              style={styles.shareButton}
              textStyle={button.textButtonText}
            >
              {I18n.t('caption_share_session')}
            </TextButton>
            <LineSeparator/>
          </View>
        </View>
        <TextButton
          style={[button.trackingAction, styles.startButton]}
          textStyle={button.trackingActionText}
        >
          {I18n.t('caption_start').toUpperCase()}
        </TextButton>
      </ScrollContentView>
    )
  }
}

const mapStateToProps = (state: any, props: any) => {
  const session = props.navigation.state.params
  return {
    session,
    boat: getBoat(session && session.boatName)(state),
  }
}

export default connect(mapStateToProps)(TrackingSetup)
