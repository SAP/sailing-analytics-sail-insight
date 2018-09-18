import React from 'react'
import { View } from 'react-native'

import I18n from 'i18n'
import { container } from 'styles/commons'
import styles from './styles'

import Text from 'components/Text'
import TrackingProperty from 'components/TrackingProperty'
import TrackingPropertyAutoFit from 'components/TrackingPropertyAutoFit'


class ManeuverMonitor extends React.Component<{
  stopLocationTracking: () => void,
  trackingStats: any,
  checkInData: any,
} > {
  public render() {

    // TODO: use values from maneuver notification
    const cogChange = '24°'
    const maneuverLoss = 2.38.toString()
    const lowestSpeed = 0.2.toString()
    const speedEnter = 12.20.toString()
    const speedEnd = 11.32.toString()
    const speedChange = 9.56.toString()
    const turnMaxRate = '23.25°'
    const turnAvgRate = '9.07°'

    const propertyProps = {
      titleFontSize: 12,
      valueFontSize: 16,
      unitFontSize: 8,
    }

    return (
      <View style={container.main}>
        <View style={[container.mediumHorizontalMargin, container.stretchContent, styles.container]}>
          <TrackingPropertyAutoFit
            style={styles.dynamicPropertyContainer}
            title={I18n.t('text_maneuver_cog_change')}
            value={cogChange}
          />
          <TrackingPropertyAutoFit
            style={[styles.dynamicPropertyContainer, styles.property]}
            title={I18n.t('text_maneuver_loss')}
            value={maneuverLoss}
            unit={I18n.t('text_tracking_unit_meters')}
            tendency="down"
          />
          <TrackingPropertyAutoFit
            style={[styles.dynamicPropertyContainer, styles.property]}
            title={I18n.t('text_maneuver_lowest_speed')}
            value={lowestSpeed}
            unit={I18n.t('text_tracking_unit_knots')}
            tendency="up"
          />
        </View>
        <View style={styles.lowerValueContainer}>
          <Text style={styles.sectionTitle}>{I18n.t('text_maneuver_speed').toUpperCase()}</Text>
          <View style={styles.separator}/>
          <View style={[container.mediumHorizontalMargin, styles.propertyRow]}>
            <TrackingProperty
              title={I18n.t('text_maneuver_enter')}
              value={speedEnter}
              unit={I18n.t('text_tracking_unit_knots')}
              {...propertyProps}
            />
            <TrackingProperty
              title={I18n.t('text_maneuver_end')}
              value={speedEnd}
              unit={I18n.t('text_tracking_unit_knots')}
              {...propertyProps}
            />
            <TrackingProperty
              title={I18n.t('text_maneuver_change')}
              value={speedChange}
              unit={I18n.t('text_tracking_unit_knots')}
              {...propertyProps}
            />
          </View>
          <Text style={styles.sectionTitle}>{I18n.t('text_maneuver_turn').toUpperCase()}</Text>
          <View style={styles.separator}/>
          <View style={[container.mediumHorizontalMargin, styles.propertyRow]}>
            <TrackingProperty
              title={I18n.t('text_maneuver_max_rate')}
              value={turnMaxRate}
              unit={'/s'}
              {...propertyProps}
            />
            <TrackingProperty
              title={I18n.t('text_maneuver_avg_rate')}
              value={turnAvgRate}
              unit={'/s'}
              {...propertyProps}
            />
          </View>
        </View>
      </View>
    )
  }
}


export default ManeuverMonitor
