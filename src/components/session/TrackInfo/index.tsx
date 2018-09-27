import React from 'react'
import {
  View,
  ViewProps,
} from 'react-native'

import Images from '@assets/Images'
import { timeText } from 'helpers/date'
import { degToCompass } from 'helpers/physics'
import I18n from 'i18n'
import styles from './styles'

import LineSeparator from 'components/LineSeparator'
import TrackInfoItem from 'components/session/TrackInfoItem'
import TrackingProperty from 'components/TrackingProperty'


class TrackInfo extends React.Component<ViewProps & {
  trackInfo?: any,
  eventImageSize?: 'large' | 'medium',
  onTrackingPress?: () => void,
  onSettingsPress?: () => void,
} > {

  public renderProperty(options: any) {
    return (
      <TrackingProperty
        {...options}
        valueStyle={styles.propertyValue}
        unitStyle={styles.propertyUnit}
        key={JSON.stringify(options)}
      />
    )
  }

  public renderItem(title: string, source: any, ...children: any[]) {
    return (
      <TrackInfoItem
        style={styles.item}
        iconSource={source}
        title={title}
      >
        {children}
      </TrackInfoItem>
    )
  }

  public render() {
    const {
      style,
      trackInfo = {
        time: 60 * 60 * 4,
        distance: 2345,
        maneuvers: [
          { count: 23, type: 'Tacks' },
          { count: 12, type: 'Gybes' },
        ],
        wind: {
          courseInDeg: 235,
          speed: 13.52,
        },
        avgSpeed: {
          upwind: 7.5,
          downwind: 5.5,
        },
        maxSpeed: {
          upwind: 10.5,
          downwind: 8.5,
        },
      },
    } = this.props


    return (
      <View style={style}>
        <LineSeparator style={styles.topSeparator}/>
        <View style={[styles.line, styles.lineMargin]}>
          {this.renderItem(
            I18n.t('text_tracking_time'),
            Images.info.time,
            this.renderProperty({ value: timeText(trackInfo.time) }),
          )}
          {this.renderItem(
            I18n.t('text_tracking_distance'),
            Images.info.distance,
            this.renderProperty({ value: trackInfo.distance, unit: I18n.t('text_tracking_unit_meters') }),
          )}
        </View>
        <View style={styles.line}>
        {this.renderItem(
            I18n.t('text_tracking_maneuvers'),
            Images.info.maneuvers,
            trackInfo.maneuvers.map((maneuver: any) => this.renderProperty({
              value: maneuver.count,
              unit: maneuver.type,
            })),
          )}
          {this.renderItem(
            I18n.t('text_tracking_wind'),
            Images.info.wind,
            this.renderProperty({ value: degToCompass(trackInfo.wind.courseInDeg) }),
            this.renderProperty({ value: trackInfo.wind.speed, unit: I18n.t('text_tracking_unit_knots') }),
          )}
        </View>
        <LineSeparator style={styles.separatorMargin}/>
        <View style={[styles.line, styles.lineMargin]}>
          {this.renderItem(
            I18n.t('text_maneuver_avg_speed'),
            undefined,
            this.renderProperty({
              title: I18n.t('text_upwind'),
              value: trackInfo.avgSpeed.upwind,
              unit: I18n.t('text_tracking_unit_knots'),
              titlePosition: 'left',
              titleStyle: styles.leftTitle,
            }),
            this.renderProperty({
              title: I18n.t('text_downwind'),
              value: trackInfo.avgSpeed.downwind,
              unit: I18n.t('text_tracking_unit_knots'),
              titlePosition: 'left',
              titleStyle: styles.leftTitle,
            }),
          )}
          {this.renderItem(
            I18n.t('text_maneuver_max_speed'),
            undefined,
            this.renderProperty({
              title: I18n.t('text_upwind'),
              value: trackInfo.maxSpeed.upwind,
              unit: I18n.t('text_tracking_unit_knots'),
              titlePosition: 'left',
              titleStyle: styles.leftTitle,
            }),
            this.renderProperty({
              title: I18n.t('text_downwind'),
              value: trackInfo.maxSpeed.downwind,
              unit: I18n.t('text_tracking_unit_knots'),
              titlePosition: 'left',
              titleStyle: styles.leftTitle,
            }),
          )}
        </View>
      </View>
    )
  }
}


export default TrackInfo
