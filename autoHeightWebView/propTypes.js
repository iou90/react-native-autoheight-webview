import PropTypes from 'prop-types';

import { ViewPropTypes, WebView } from 'react-native';

export const commonPropTypes = {
  style: ViewPropTypes.style,
  onNavigationStateChange: PropTypes.func,
  customScript: PropTypes.string,
  customStyle: PropTypes.string,
  enableAnimation: PropTypes.bool,
  // only works on enable animation
  animationDuration: PropTypes.number,
  // offset of rn webView margin
  heightOffset: PropTypes.number,
  // either height or width updated will trigger this
  // no support auto width and height will triggered by source changing only on android 6.0 or below version
  onSizeUpdated: PropTypes.func,
  // 'file:///android_asset/web/' by default on android, 
  // web/' by default on iOS
  baseUrl: PropTypes.string,
  // add baseUrl/files... to android/app/src/assets/ on android
  // add baseUrl/files... to project root on iOS
  files: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      type: PropTypes.string,
      rel: PropTypes.string
    })
  ),
  // if set to true may cause some layout issues (smaller font size) on iOS
  // if set to false may cause some layout issues (width of container will be than width of screen) on android
  scalesPageToFit: PropTypes.bool,
  // other rn webview props
  source: WebView.propTypes.source,
  originWhitelist: PropTypes.arrayOf(PropTypes.string),
  mediaPlaybackRequiresUserAction: PropTypes.bool,
  renderError: PropTypes.func,
  onError: PropTypes.func,
  onMessage: PropTypes.func,
  onLoad: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoadEnd: PropTypes.func
};

export const androidPropTypes = {
  ...commonPropTypes,
  domStorageEnabled: PropTypes.bool,
  thirdPartyCookiesEnabled: PropTypes.bool,
  userAgent: PropTypes.string,
  geolocationEnabled: PropTypes.string,
  allowUniversalAccessFromFileURLs: PropTypes.bool,
  mixedContentMode: PropTypes.oneOf(['never', 'always', 'compatibility'])
};
