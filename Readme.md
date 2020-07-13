**Prerequisites**

React Native setup (from https://facebook.github.io/react-native/docs/getting-started.html)

1. install nodejs (https://nodejs.org/en/download/package-manager/)
2. install watchman (https://facebook.github.io/watchman/docs/install.html)
3. install yarn (https://yarnpkg.com/lang/en/docs/install)
4.  install react native cli:
````
npm install -g react-native-cli
````

5. Install nvm (https://github.com/creationix/nvm)

**Android**

6. make sure the Android SDK and Android Studio is properly installed 
- if you have problems with AndroidX import than run:
```
npx jetify -r
```

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