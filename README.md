# react-native-autoheight-webview

An auto height webview for React Native, even auto width for inline html.

[![NPM Version](http://img.shields.io/npm/v/react-native-autoheight-webview.svg?style=flat-square)](https://www.npmjs.com/package/react-native-autoheight-webview)
[![NPM Downloads](https://img.shields.io/npm/dt/react-native-autoheight-webview.svg?style=flat-square)](https://www.npmjs.com/package/react-native-autoheight-webview)

## versioning

`npm install react-native-autoheight-webview --save` (rn >= 0.60, rnw >= 10.9.0)

`npm install react-native-autoheight-webview@1.0.1 --save` (0.57 <= rn < 0.59)

`npm install react-native-autoheight-webview@1.5.2 --save` (0.59 <= rn < 0.60, 5.4.0 <= rnw < 10.9.0)

Read [README_old](./README_old.md) for earlier version guide and please note that fixes and new features will only be included in the last version.

## showcase

![react-native-autoheight-webview iOS](https://media.giphy.com/media/tocJYDUGCgwac0kkyB/giphy.gif)&nbsp;
![react-native-autoheight-webview Android](https://media.giphy.com/media/9JyX1wZshYIxuPklHK/giphy.gif)

## usage

react-native-webview is a peer dependency and must be installed along this lib.
```
npm install react-native-autoheight-webview react-native-webview
```

```javascript
import AutoHeightWebView from 'react-native-autoheight-webview'

import { Dimensions } from 'react-native'

<AutoHeightWebView
    style={{ width: Dimensions.get('window').width - 15, marginTop: 35 }}
    customScript={`document.body.style.background = 'lightyellow';`}
    customStyle={`
      * {
        font-family: 'Times New Roman';
      }
      p {
        font-size: 16px;
      }
    `}
    onSizeUpdated={size => console.log(size.height)}
    files={[{
        href: 'cssfileaddress',
        type: 'text/css',
        rel: 'stylesheet'
    }]}
    source={{ html: `<p style="font-weight: 400;font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. <span style="background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));">If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with “moving”. I’d also use the tags “pets”, “marriage”, “career change”, and “travel tips”.</span></p>` }}
    scalesPageToFit={true}
    viewportContent={'width=device-width, user-scalable=no'}
    /*
    other react-native-webview props
    */
  />
```

## properties

| Prop                         | Default |                                                      Type                                                       | Description                                                                                                                                                                                                  |
| :--------------------------- | :-----: | :-------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| __style__                        |    -    |                                              `ViewPropTypes.style`                                              | The width of this component will be the width of screen by default, if there are some text selection issues on iOS, the width should be reduced more than 15 and the marginTop should be added more than 35. |
| __customScript__                 |    -    |                                               `PropTypes.string`                                                | -                                                                                                                                                                                                            |
| __customStyle__                  |    -    |                                               `PropTypes.string`                                                | The custom css content will be added to the page's `<head>`.                                                                                                                                                 |
| __onSizeUpdated__                |    -    |                                                `PropTypes.func`                                                 | Either updated height or width will trigger onSizeUpdated.                                                                                                                                                   |
| __files__                        |    -    | `PropTypes.arrayOf(PropTypes.shape({ href: PropTypes.string, type: PropTypes.string, rel: PropTypes.string }))` | Using local or remote files. To add local files: Add files to android/app/src/main/assets/ (depends on baseUrl) on android; add files to web/ (depends on baseUrl) on iOS.                                   |
| __source__                       |    -    |                                               `PropTypes.object`                                                | BaseUrl now contained by source. 'web/' by default on iOS; 'file:///android_asset/' by default on Android or uri.                                                                                            |
| __scalesPageToFit__              |  false  |                                                `PropTypes.bool`                                                 | False by default (different from react-native-webview which true by default on Android). When scalesPageToFit was enabled, it will apply the scale of the page directly.    |
| __scrollEnabledWithZoomedin__                     |  false   |                                                `PropTypes.bool`                                                 | Making the webview scrollable on iOS when zoomed in even if scrollEnabled is false.                                                                        |
| __viewportContent__                     |  'width=device-width' on iOS   |                                                `PropTypes.string`                                                 | Please note that 'width=device-width' with scalesPageToFit may cause some layout issues on Android, for these conditions, using __customScript__ prop to apply custom viewport meta.                                                                        |
| __showsVerticalScrollIndicator__ |  false  |                                                `PropTypes.bool`                                                 | False by default (different from react-native-webview).                                                                                                                                                      |
| __showsHorizontalScrollIndicator__ |  false  |                                                `PropTypes.bool`                                                 | False by default (different from react-native-webview).                                                                                                                                                      |
| __originWhitelist__              |  ['*']  |                                      `PropTypes.arrayOf(PropTypes.string)`                                      |  Validate any origin by default cause of most cases using static HTML concerns.                                                                                                                                                                                                           |

## demo

```
npx react-native run-ios/android
```

You may have to use yarn to install the dependencies of the demo and remove "demo/node_modules/react-native-autoheight-webview/demo" manually, cause of installing a local package with npm will create symlink, but there is no supporting of React Native to symlink (https://github.com/facebook/watchman/issues/105) and "yarn install" ignores "files" from local dependencies (https://github.com/yarnpkg/yarn/issues/2822).
For android, you may have to copy the "Users\UserName\.android\debug.keystore" to "demo/android/app/".

## supporting rnahw

One-time donation via PayPal:

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/iou90)
