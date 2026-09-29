# Android 16 connectivity integration

## Symptom

The app showed **No Connectivity** on Android 16 / API 36 even though Android's
network was validated, Chrome worked, the React Native runtime could make HTTP
requests, and `@react-native-community/netinfo` reported a connected/reachable
Wi-Fi network.

## Root cause

The app used `react-native-offline` 6.0.2 for both connectivity detection and its
Redux offline queue. Its HTTP reachability code relies on `this.status` inside an
`XMLHttpRequest.onload` callback. In the React Native 0.81 runtime used by this
upgrade, the callback's `this` is not the XHR instance, so a real HTTP 200 is
misread as a failed connectivity check and Redux is repeatedly set to offline.

## Fix

`@react-native-community/netinfo` is now the single connectivity source.
`src/App.tsx` subscribes to NetInfo and dispatches
`offlineActionCreators.connectionChange(...)` into the existing
`react-native-offline` reducer.

`react-native-offline` remains installed only for the existing Redux reducer,
`createNetworkMiddleware`, action queue, and `FETCH_OFFLINE_MODE` behavior.
No dependency code in `node_modules` is patched for connectivity detection.

The connectivity value uses the same semantics already used elsewhere in this
app (`AppStateSaga` and `ConnectivityIndicator`): connected only when both
`isConnected` and `isInternetReachable` are true.
