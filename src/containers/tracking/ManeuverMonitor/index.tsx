import { get, isNumber } from 'lodash'
import React from 'react'
import { View } from 'react-native'
import timer from 'react-native-timer'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'

import { Maneuver } from 'api/endpoints/types'
import I18n from 'i18n'
import { navigateToTracking } from 'navigation'
import { getCustomScreenParamData } from 'navigation/utils'

import Text from 'components/Text'
import TrackingProperty from 'components/TrackingProperty'
import TrackingPropertyAutoFit from 'components/TrackingPropertyAutoFit'

import { container } from 'styles/commons'
import styles from './styles'


class ManeuverMonitor extends React.Component<NavigationScreenProps & {
  maneuver: Maneuver,
} > {

  private lastManeuverTimeInMillis: number | undefined

  public componentDidMount() {
    timer.setTimeout(this, 'maneuver_timer', this.handleTimerEvent, 10000)
    const { maneuver } = this.props
    if (!maneuver) {
      return
    }
    this.props.navigation.setParams({ heading: I18n.t(maneuver.maneuverType) || I18n.t('title_maneuver_monitor') })
  }

  public componentWillUnmount() {
    timer.clearTimeout(this)
  }

  public componentWillReceiveProps() {
    const newTime = get(this, 'props.maneuver.positionAndTime.unixtime')
    if (this.lastManeuverTimeInMillis && newTime && this.lastManeuverTimeInMillis === newTime) {
      this.updateTimer()
    }
    this.lastManeuverTimeInMillis = newTime
  }

  public render() {
    const { maneuver } = this.props

    const cogChange = `${this.toFixedFractionText(maneuver.cogAfterInTrueDegrees - maneuver.cogBeforeInTrueDegrees)}°`
    const maneuverLoss = this.toFixedFractionText('maneuverLoss.meters')
    const lowestSpeed = this.toFixedFractionText('lowestSpeedInKnots')
    const speedEnter = this.toFixedFractionText('speedBeforeInKnots')
    const speedEnd = this.toFixedFractionText('speedAfterInKnots')
    const speedChange = speedEnter && speedEnd ?
      this.toFixedFractionText(maneuver.speedAfterInKnots - maneuver.speedBeforeInKnots) :
      undefined
    const turnMaxRate = `${this.toFixedFractionText('maxTurningRateInDegreesPerSecond')}°`
    const turnAvgRate = `${this.toFixedFractionText('avgTurningRateInDegreesPerSecond')}°`

    const propertyProps = {
      titleStyle: styles.lowerTitle,
      valueStyle: styles.lowerValue,
      unitStyle: styles.lowerUnit,
    }

    return (
      <View style={container.main}>
        <View style={[container.largeHorizontalMargin, container.stretchContent, styles.container]}>
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
            // tendency="down"
          />
          <TrackingPropertyAutoFit
            style={[styles.dynamicPropertyContainer, styles.property]}
            title={I18n.t('text_maneuver_lowest_speed')}
            value={lowestSpeed}
            unit={I18n.t('text_tracking_unit_knots')}
            // tendency="up"
          />
        </View>
        <View style={styles.lowerValueContainer}>
          <Text style={styles.sectionTitle}>{I18n.t('text_maneuver_speed').toUpperCase()}</Text>
          <View style={styles.separator}/>
          <View style={[container.largeHorizontalMargin, styles.propertyRow]}>
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
          <View style={[container.largeHorizontalMargin, styles.propertyRow]}>
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

  private updateTimer = () => {
    timer.clearTimeout(this)
    timer.setTimeout(this, 'maneuver_timer', this.handleTimerEvent, 10000)
  }

  private handleTimerEvent = () => {
    navigateToTracking()
  }

  private toFixedFractionText = (value: string | number, fractionDigits?: number) => {
    const { maneuver } = this.props
    const num = isNumber(value) ? value : get(maneuver, value)
    return num ?
      num.toFixed(fractionDigits || 2).toString() :
      undefined
  }
}

const mapStateToProps = (state: any, props: any) => ({
  maneuver: getCustomScreenParamData(props),
})

export default connect(mapStateToProps)(ManeuverMonitor)
