fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew cask install fastlane`

# Available Actions
### check_git_status
```
fastlane check_git_status
```

### set_src_env
```
fastlane set_src_env
```


----

## iOS
### ios setup_entitlements
```
fastlane ios setup_entitlements
```

### ios setup
```
fastlane ios setup
```

### ios setup_push
```
fastlane ios setup_push
```

### ios build
```
fastlane ios build
```

### ios deploy_enterprise_store
```
fastlane ios deploy_enterprise_store
```

### ios deploy_to_itunes_connect
```
fastlane ios deploy_to_itunes_connect
```


----

## Android
### android build
```
fastlane android build
```

### android deploy_enterprise_store
```
fastlane android deploy_enterprise_store
```

### android deploy_to_play_store
```
fastlane android deploy_to_play_store
```


----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
