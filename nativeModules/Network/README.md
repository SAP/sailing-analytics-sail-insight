
# react-native-network

## Getting started

`$ npm install react-native-network --save`

### Mostly automatic installation

`$ react-native link react-native-network`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-network` and add `SINetwork.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libSINetwork.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.SINetworkPackage;` to the imports at the top of the file
  - Add `new SINetworkPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-network'
  	project(':react-native-network').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-network/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-network')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `SINetwork.sln` in `node_modules/react-native-network/windows/SINetwork.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Network.SINetwork;` to the usings at the top of the file
  - Add `new SINetworkPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import SINetwork from 'react-native-network';

// TODO: What to do with the module?
SINetwork;
```
  