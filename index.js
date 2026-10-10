/**
 * @format
 */

import '@react-native-firebase/app';

import {AppRegistry, ScrollView, Text} from 'react-native';
import {name as appName} from './app.json';

function BootErrorScreen({error}) {
    const msg = String(error?.message ?? error);
    const stack = String(error?.stack ?? '');
    return (
        <ScrollView contentContainerStyle={{padding: 16}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>
                Boot error
            </Text>
            <Text selectable style={{marginBottom: 8}}>{msg}</Text>
            <Text selectable>{stack}</Text>
        </ScrollView>
    );
}

const getApp = () => {
    try {
        // IMPORTANT: require inside try/catch so top-level errors surface
        return require('./src/App').default;
    } catch (e) {
        try {
            require('./src/helpers/Logger').default.error('Boot error', e);
        } catch (_) {
            // Keep bootstrap diagnostics safe even if the logger itself failed to load.
            console.error('Boot error');
        }
        return () => <BootErrorScreen error={e} />;
    }

};
AppRegistry.registerComponent('sap_sailing_insight', getApp);
