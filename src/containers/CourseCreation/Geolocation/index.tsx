import React from 'react'
import { View } from 'react-native'
import EStyleSheets from 'react-native-extended-stylesheet'

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

const styles = EStyleSheets.create({
  container: {
    ...EStyleSheets.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...EStyleSheets.absoluteFillObject,
  },
})

export default () => (
   <View style={styles.container}>
     <MapView
       provider={PROVIDER_GOOGLE}
       style={styles.map}
       region={{
         latitude: 37.78825,
         longitude: -122.4324,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}
     />
   </View>
)
