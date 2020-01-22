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
6. use node version from .nvmrc file
- realm which is used to store pending GPS-Fixes needs nodejs 10.14.1 to work properly at currently used version realm 2.21.0
```
nvm use
```

**Android**

7. make sure the Android SDK and Android Studio is properly installed 
- if you have problems with AndroidX import than run:
```
npx jetify -r
```

**iOS**

8. make sure XCode and XCode command line tools are properly installed
9. install cocoapods (https://guides.cocoapods.org/using/getting-started.html)
```
$ sudo gem install cocoapods
```
10. install cocoapods
````
cd ios
pod install  
````
11.  install node modules
````
yarn install
```` 

- Build and run the apps via Android Studio or Xcode