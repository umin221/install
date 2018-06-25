# one

> description one

## Build Setup

``` bash

# Prepare project
cordova prepare

# Build project
cordova build [ios/android]

# Run on emulate
cordova emulate [ios/android]

# Hot update content for Hybrid application
cordova-hcp build

# Build android
cordova build android --release -- --keystore="kinlong-install.keystore" --alias=kinlong  --storePassword=1234567890 --password=1234567890

# Build ios
to xCode build

For a detailed explanation on how things work

# Modify the hot update server
modify the cordova-hcp.json/content_url and config.xml/chcp/config-xml on root，and rebuild pacakge or publish
