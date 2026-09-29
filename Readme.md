[![REUSE status](https://api.reuse.software/badge/github.com/SAP/sailing-analytics-sail-insight)](https://api.reuse.software/info/github.com/SAP/sailing-analytics-sail-insight)

**Prerequisites**

Node setup, at least version 20.19.4 (required by React Native 0.81):
```
nvm install 20.19.4
nvm use 20.19.4
```

React Native setup (from https://facebook.github.io/react-native/docs/getting-started.html)

1. install nodejs (https://nodejs.org/en/download/package-manager/)
2. install watchman (https://facebook.github.io/watchman/docs/install.html)
3. install yarn (https://yarnpkg.com/lang/en/docs/install)
4. React Native CLI is installed by the project; do not install the legacy global `react-native-cli`.

5. Install nvm (https://github.com/creationix/nvm)

**Android**

6. make sure the Android SDK and Android Studio is properly installed
- if you have problems with AndroidX import than run:
```
npx jetify -r
```

Ensure you have a Java Development Kit (JDK) in a version >= 17, with ``JAVA_HOME`` pointing to that JDK.
Change to the android/ folder and run
```
./gradlew assembleDevDebug
```
for the `app-dev-debug.apk` output, or
```
./gradlew assembleDebug
```
for the `app-live-debug.apk` output.

The APKs will be signed using a debug key and can be found under `android/app/build/outputs/apk/live/debug`.

**iOS**

7. make sure XCode and XCode command line tools are properly installed
8. install cocoapods (https://guides.cocoapods.org/using/getting-started.html)
```
$ sudo gem install cocoapods
```
9. install cocoapods
````
cd ios
pod install
````
10.  install node modules
````
yarn install
````

- Build and run the apps via Android Studio or Xcode
