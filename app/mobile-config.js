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
  'iphone': 'icons/icon-60.png',
  'iphone_2x': 'icons/icon-60@2x.png',
  'android_ldpi': 'resources/res/icons/android/icon-36-ldpi.png',
  'android_mdpi': 'resources/res/icons/android/icon-48-mdpi.png',
  'android_hdpi': 'resources/res/icons/android/icon-72-hdpi.png',
  'android_xhdpi': 'resources/res/icons/android/icon-96-xhdpi',
  // ... more screen sizes and platforms ...
});

App.launchScreens({
  'iphone': 'splash/Default~iphone.png',
  'iphone_2x': 'splash/Default@2x~iphone.png',
  // ... more screen sizes and platforms ...
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);

// Pass preferences for a particular PhoneGap/Cordova plugin
App.configurePlugin('com.phonegap.plugins.facebookconnect', {
  APP_ID: '1234567890',
  API_KEY: 'supersecretapikey'
});
