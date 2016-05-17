App.info({
  id: 'us.chemicaldevelopment.regressionApp',
  name: 'regressionApp',
  description: 'Snap a photo of your sketch or scatterplot, set the marker color, and see the line of best fit',
  author: 'Cade Brown || L&N STEMpunks',
  email: 'info@chemicaldevelopment.us',
  website: 'http://chemicaldevelopment.us'
});

// Set up resources such as icons and launch screens.
App.icons({
  //Apple
  'iphone': 'resources/res/icons/ios/icon-60.png',
  'iphone_2x': 'resources/res/icons/ios/icon-60-2x.png',
  'iphone_3x': 'resources/res/icons/ios/icon-60-3x.png',
  'ipad': 'resources/res/icons/ios/icon-76.png',
  'ipad_2x': 'resources/res/icons/ios/icon-76-2x.png',
  'ios_settings': 'resources/res/icons/ios/icon-small.png',
  'ios_settings_2x': 'resources/res/icons/ios/icon-small-2x.png',
  'ios_spotlight': 'resources/res/icons/ios/icon-40.png',
  'ios_spotlight_2x': 'resources/res/icons/ios/icon-40-2x.png',
  //You have to custom make ipad pro logo :(
  //'ipad_pro': 'resources/res/icons/ios/icon-76-2x.png',
  //Android
  'android_ldpi': 'resources/res/icons/android/icon-36-ldpi.png',
  'android_mdpi': 'resources/res/icons/android/icon-48-mdpi.png',
  'android_hdpi': 'resources/res/icons/android/icon-72-hdpi.png',
  'android_xhdpi': 'resources/res/icons/android/icon-96-xhdpi.png',
  'android_xxhdpi': 'resources/res/icons/android/icon-144-xxhdpi.png',
  'android_xxxhdpi': 'resources/res/icons/android/icon-192-xxxhdpi.png',
});

App.launchScreens({
  //Apple
  'iphone': 'resources/res/screens/ios/screen-iphone-portrait.png',
  'iphone_2x': 'resources/res/screens/ios/screen-iphone-portrait-2x.png',
  'iphone5': 'resources/res/screens/ios/screen-iphone-portrait-568h-2x.png',
  
  //Android
  'android_mdpi_portrait': 'resources/res/screens/android/screen-mdpi-portrait.png',
  'android_hdpi_portrait': 'resources/res/screens/android/screen-hdpi-portrait.png',
  'android_xhdpi_portrait': 'resources/res/screens/android/screen-xhdpi-portrait.png',
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0x20001c9f');
App.setPreference('HideKeyboardFormAccessoryBar', true);


