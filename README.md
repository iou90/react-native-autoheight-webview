# react-native-autoheight-webview
An auto height webview for React Native, or even auto width for inline html.

The Current version do not support Android API version 18 and below and the native module has been removed.

Cause of javascript execution in webview is not working for Android API version 21 and below (https://github.com/facebook/react-native/issues/14754#issuecomment-361841219), auto width for inline html will not work on Android with API version 22 and below.

Cause of changes to lifecycle methods in React 16.3.0 (https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html), please install react-native-autoheight-webview 0.6.1 for the project with 0.47 <= rn < 0.55

Cause of removing unused createJSModules calls in React Naitve 0.47 (https://github.com/facebook/react-native/releases/tag/v0.47.2), please install react-native-autoheight-webview 0.3.1 for the project with 0.44 <= rn < 0.47.

Cause of moving View.propTypes to ViewPropTypes in React Naitve 0.44 (https://github.com/facebook/react-native/releases/tag/v0.44.3) and PropTypes has been moved to a separate package in React 16 (https://facebook.github.io/react/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes), please install react-native-autoheight-webview 0.2.3 for the project with rn < 0.44.

`npm install react-native-autoheight-webview --save` (rn >= 0.56)

`npm install react-native-autoheight-webview@0.6.1 --save` (0.47 <= rn < 0.56)

`npm install react-native-autoheight-webview@0.3.1 --save` (0.44 <= rn < 0.47)

`npm install react-native-autoheight-webview@0.2.3 --save` (rn < 0.44)

## Android
`react-native link react-native-autoheight-webview` (version 0.10.6 and below)

`import AutoHeightWebView from 'react-native-autoheight-webview';`

## iOS
`import AutoHeightWebView from 'react-native-autoheight-webview';`

## showcase
![react-native-autoheight-webview iOS](https://media.giphy.com/media/eehXhFjneVqEUCzYip/giphy.gif)&nbsp;
![react-native-autoheight-webview Android](https://media.giphy.com/media/1yTcqipIfHbgNNfcEU/giphy.gif)

## usage

```javascript
<AutoHeightWebView
    // default width is the width of screen
    // if there are some text selection issues on iOS, the width should be reduced more than 15 and the marginTop should be added more than 35
    style={{ width: Dimensions.get('window').width - 15, marginTop: 35 }}
    customScript={`document.body.style.background = 'lightyellow';`}
    // add custom CSS to the page's <head>
    customStyle={`
      * {
        font-family: 'Times New Roman';
      }
      p {
        font-size: 16px;
      }
    `}
    // animation enabled by default
    enableAnimation={false},
    // only works on enable animation
    animationDuration={255},
    // offset of rn webview margin 
    heightOffset={5}
    onMessage={e => console.log(e)},
    // either height or width updated will trigger this
    // no support auto width and height will triggered by source changing only on android 5.1 or below version
    onSizeUpdated={({size => console.log(size.height)})},
    // 'file:///android_asset/web/' by default on android, 
    // web/' by default on iOS
    baseUrl: 'webAssets/',
    /* 
    use local or remote files
    to add local files: 
    add baseUrl/files... to android/app/src/assets/ on android
    add baseUrl/files... to project root on iOS
    */
    files={[{
        href: 'cssfileaddress',
        type: 'text/css',
        rel: 'stylesheet'
    }]}
    // if set to true may cause some layout issues (smaller font size) on iOS
    // if set to false may cause some layout issues (width of container will be than width of screen) on android
    scalesPageToFit={Platform.OS === 'Android' ? true : false}
    // or uri
    source={{ html: `<p style="font-weight: 400;font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. <span style="background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));">If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with “moving”. I’d also use the tags “pets”, “marriage”, “career change”, and “travel tips”.</span></p>` }}
    // rn WebView callbacks
    onError={() => console.log('on error')}
    onLoad={() => console.log('on load')}
    onLoadStart={() => console.log('on load start')}
    onLoadEnd={() => console.log('on load end')}
    onNavigationStateChange={() => console.log('navigation state changed')}
    // set scrollEnabled to true may cause some layout issues
    // only on iOS
    scrollEnabled={true},
    // if page contains iframe on iOS, use a specific script for it
    // only on iOS
    hasIframe={true}
    // only on iOS
    onShouldStartLoadWithRequest={result => {
      console.log(result)
      return true;
    }}
    // only on Android for animating size (>= api 23)
    animationEasing={Easing.ease()}
    /* 
    other rn WebView props:
    renderError, mediaPlaybackRequiresUserAction, originWhitelist
    decelerationRate, allowsInlineMediaPlayback, bounces, dataDetectorTypes on iOS
    domStorageEnabled, thirdPartyCookiesEnabled, userAgent, geolocationEnabled, allowUniversalAccessFromFileURLs, mixedContentMode on Android
    */
  />
```

## demo
You may have to copy autoHeightWebView, node_modules folders and index.js to 'demo/node_modules/react-native-autoheight-webview/', cause of installing a local package with npm will create symlink, but there is no supporting of React Native to symlink (https://github.com/facebook/watchman/issues/105).