'use strict';

import React, { PureComponent } from 'react';

import {
  findNodeHandle,
  requireNativeComponent,
  Animated,
  DeviceEventEmitter,
  StyleSheet,
  Platform,
  UIManager,
  ViewPropTypes,
  WebView,
  View
} from 'react-native';

import PropTypes from 'prop-types';

import {
  isEqual,
  setState,
  isSizeChanged,
  handleSizeUpdated,
  getWidth,
  getScript,
  domMutationObserveScript,
  getCurrentSize
} from './common.js';

const RCTAutoHeightWebView = requireNativeComponent('RCTAutoHeightWebView', AutoHeightWebView, {
  nativeOnly: {
    nativeOnly: {
      onLoadingStart: true,
      onLoadingError: true,
      onLoadingFinish: true,
      messagingEnabled: PropTypes.bool
    }
  }
});

import momoize from './momoize';

const baseUrl = 'file:///android_asset/web/';

const getUpdatedState = momoize(setState, isEqual);

export default class AutoHeightWebView extends PureComponent {
  static propTypes = {
    onMessage: PropTypes.func,
    scrollEnabled: PropTypes.bool,
    source: WebView.propTypes.source,
    customScript: PropTypes.string,
    customStyle: PropTypes.string,
    enableAnimation: PropTypes.bool,
    // either height or width updated will trigger this
    onSizeUpdated: PropTypes.func,
    // if set to false may cause some layout issues (width of container will be than width of screen)
    scalesPageToFit: PropTypes.bool,
    // only works on enable animation
    animationDuration: PropTypes.number,
    // offset of rn webView margin
    heightOffset: PropTypes.number,
    // baseUrl not work in android 4.3 or below version
    enableBaseUrl: PropTypes.bool,
    style: ViewPropTypes.style,
    //  rn WebView callback
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    onLoadStart: PropTypes.func,
    onLoadEnd: PropTypes.func,
    // works if set enableBaseUrl to true; add web/files... to android/app/src/assets/
    files: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string,
        type: PropTypes.string,
        rel: PropTypes.string
      })
    )
  };

  static defaultProps = {
    scalesPageToFit: true,
    enableBaseUrl: false,
    enableAnimation: true,
    animationDuration: 555,
    heightOffset: 20
  };

  constructor(props) {
    super(props);
    const { enableAnimation, style, source, enableBaseUrl } = props;
    enableAnimation && (this.opacityAnimatedValue = new Animated.Value(0));
    isBelowKitKat && DeviceEventEmitter.addListener('webViewBridgeMessage', this.listenWebViewBridgeMessage);
    this.state = {
      isSizeChanged: false,
      isSizeMayChange: false,
      height: 0,
      width: getWidth(style),
      script: getScript(props, getBaseScript),
      source: enableBaseUrl ? Object.assign({}, source, { baseUrl }) : source
    };
  }

  componentDidMount() {
    this.startInterval();
  }

  static getDerivedStateFromProps(props, state) {
    const { height: oldHeight, width: oldWidth, source: prevSource, script: prevScript } = state;
    const { style, enableBaseUrl } = props;
    const { source, script } = getUpdatedState(props, enableBaseUrl ? baseUrl : null, getBaseScript);
    const height = style ? style.height : null;
    const width = style ? style.width : null;
    // if (source !== prevSource || script !== prevScript) {
    //   console.log(1)
    //   return {
    //     source,
    //     script,
    //     isSizeMayChange: true
    //   };
    // }
    if (isSizeChanged(height, oldHeight, width, oldWidth)) {
      return {
        height,
        width,
        isSizeChanged: true
      };
    }
    return null;
  }

  componentDidUpdate() {
    const { height, width, isSizeChanged, isSizeMayChange } = this.state;
    if (isSizeMayChange) {
      this.startInterval();
      this.setState({ isSizeMayChange: false });
    }
    if (isSizeChanged) {
      const { enableAnimation, animationDuration, onSizeUpdated } = this.props;
      if (enableAnimation) {
        Animated.timing(this.opacityAnimatedValue, {
          toValue: 1,
          duration: animationDuration
        }).start(() => {
          handleSizeUpdated(height, width, onSizeUpdated);
        });
      } else {
        handleSizeUpdated(height, width, onSizeUpdated);
      }
      this.setState({ isSizeChanged: false });
    }
  }

  componentWillUnmount() {
    this.stopInterval();
    isBelowKitKat && DeviceEventEmitter.removeListener('webViewBridgeMessage', this.listenWebViewBridgeMessage);
  }

  // below kitkat
  listenWebViewBridgeMessage = body => this.onMessage(body.message);

  // below kitkat
  sendToWebView(message) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.webView),
      UIManager.RCTAutoHeightWebView.Commands.sendToWebView,
      [String(message)]
    );
  }

  postMessage(data) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.webView),
      UIManager.RCTAutoHeightWebView.Commands.postMessage,
      [String(data)]
    );
  }

  startInterval() {
    this.finishInterval = false;
    this.interval = setInterval(() => {
      if (!this.finishInterval) {
        isBelowKitKat ? this.sendToWebView('getBodyHeight') : this.postMessage('getBodyHeight');
      }
    }, 205);
  }

  stopInterval() {
    this.finishInterval = true;
    clearInterval(this.interval);
  }

  onMessage = e => {
    if (!e.nativeEvent) {
      return;
    }
    const { height, width } = JSON.parse(isBelowKitKat ? e.nativeEvent.message : e.nativeEvent.data);
    const { height: oldHeight, width: oldWidth } = this.state;
    if (isSizeChanged(height, oldHeight, width, oldWidth)) {
      this.props.enableAnimation && this.opacityAnimatedValue.setValue(0);
      this.stopInterval();
      this.setState({
        isSizeChanged: true,
        height,
        width
      });
    }
    const { onMessage } = this.props;
    onMessage && onMessage(e);
  };

  onLoadingStart = event => {
    const { onLoadStart } = this.props;
    onLoadStart && onLoadStart(event);
  };

  onLoadingError = event => {
    const { onError, onLoadEnd } = this.props;
    onError && onError(event);
    onLoadEnd && onLoadEnd(event);
    console.warn('Encountered an error loading page', event.nativeEvent);
  };

  onLoadingFinish = event => {
    const { onLoad, onLoadEnd } = this.props;
    onLoad && onLoad(event);
    onLoadEnd && onLoadEnd(event);
  };

  stopLoading() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.webView),
      UIManager.RCTAutoHeightWebView.Commands.stopLoading,
      null
    );
  }

  getWebView = webView => (this.webView = webView);

  render() {
    const { height, width, script, source } = this.state;
    const { scalesPageToFit, style, scrollEnabled, heightOffset } = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            opacity: 1,
            height: height ? height + heightOffset : 0,
            width: width
          },
          style
        ]}
      >
        <RCTAutoHeightWebView
          onLoadingStart={this.onLoadingStart}
          onLoadingFinish={this.onLoadingFinish}
          onLoadingError={this.onLoadingError}
          originWhitelist={['.*']}
          ref={this.getWebView}
          style={styles.webView}
          javaScriptEnabled={true}
          injectedJavaScript={script}
          scalesPageToFit={scalesPageToFit}
          scrollEnabled={!!scrollEnabled}
          source={source}
          onMessage={this.onMessage}
          messagingEnabled={true}
          // below kitkat
          onChange={this.onMessage}
        />
      </View>
    );
  }
}

const isBelowKitKat = Platform.Version < 19;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent'
  }
});

const commonScript = `
    ${getCurrentSize}
    var wrapper = document.createElement('div');
    wrapper.id = 'wrapper';
    while (document.body.firstChild instanceof Node) {
        wrapper.appendChild(document.body.firstChild);
    }
`;

const getBaseScript = isBelowKitKat
  ? function(style) {
      return `
    ; 
    ${commonScript}
    var height = 0;
    var width = ${getWidth(style)};
    function updateSize() {
      if(document.body.offsetHeight !== height || document.body.offsetWidth !== width) {
        var size = getSize(document.body.firstChild); 
        height = size.height;
        width = size.width;
        AutoHeightWebView.send(JSON.stringify({ width, height }));
      }
    }
    (function () {
      document.body.appendChild(wrapper);
      AutoHeightWebView.onMessage = updateSize;
      ${domMutationObserveScript}
    } ());
  `;
    }
  : function(style) {
      return `
    ; 
    ${commonScript}
    var height = 0;
    var width = ${getWidth(style)};
    function updateSize() {
      if(document.body.offsetHeight !== height || document.body.offsetWidth !== width) {
        var size = getSize(document.body.firstChild); 
        height = size.height;
        width = size.width;
        window.postMessage(JSON.stringify({ width, height }));
      }
    }
    (function () {
      document.body.appendChild(wrapper);
      document.addEventListener('message', updateSize);
      ${domMutationObserveScript}
    } ());
  `;
    };
