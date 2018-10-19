'use strict';

import React, { PureComponent } from 'react';

import {
  findNodeHandle,
  requireNativeComponent,
  Animated,
  DeviceEventEmitter,
  Easing,
  StyleSheet,
  Platform,
  UIManager,
  ViewPropTypes,
  WebView
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
  getCurrentSize,
  getRenderSize
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

const getUpdatedState = momoize(setState, isEqual);

export default class AutoHeightWebView extends PureComponent {
  static propTypes = {
    onNavigationStateChange: PropTypes.func,
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
    // only on android
    animationEasing: PropTypes.func,
    // offset of rn webView margin
    heightOffset: PropTypes.number,
    style: ViewPropTypes.style,
    //  rn WebView callback
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    onLoadStart: PropTypes.func,
    onLoadEnd: PropTypes.func,
    // 'file:///android_asset/web/' by default, and baseUrl not work in android 4.3 or below version
    baseUrl: PropTypes.string,
    // add baseUrl/files... to android/app/src/assets/
    files: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string,
        type: PropTypes.string,
        rel: PropTypes.string
      })
    )
  };

  static defaultProps = {
    baseUrl: 'file:///android_asset/web/',
    scalesPageToFit: true,
    enableAnimation: true,
    animationDuration: 255,
    heightOffset: 20,
    animationEasing: Easing.out(Easing.quad)
  };

  constructor(props) {
    super(props);
    const { baseUrl, enableAnimation, style, source, heightOffset } = props;
    isBelowKitKat && DeviceEventEmitter.addListener('webViewBridgeMessage', this.listenWebViewBridgeMessage);
    this.finishInterval = true;
    const initWidth = getWidth(style);
    const initHeight = style ? (style.height ? style.height : 0) : 0;
    let state = {
      isSizeChanged: false,
      isSizeMayChange: false,
      height: initHeight,
      width: initWidth,
      script: getScript(props, getBaseScript),
      source: Object.assign({}, source, { baseUrl })
    };
    if (enableAnimation) {
      Object.assign(state, {
        heightValue: new Animated.Value(initHeight ? initHeight + heightOffset : 0),
        widthValue: new Animated.Value(initWidth)
      });
    }
    this.state = state;
  }

  componentDidMount() {
    this.startInterval();
  }

  static getDerivedStateFromProps(props, state) {
    const { height: oldHeight, width: oldWidth, source: prevSource, script: prevScript } = state;
    const { style } = props;
    const { source, script } = getUpdatedState(props, getBaseScript);
    const height = style ? style.height : null;
    const width = style ? style.width : null;
    if (source.html !== prevSource.html || source.uri !== prevSource.uri || script !== prevScript) {
      return {
        source,
        script,
        isSizeMayChange: true
      };
    }
    if (isSizeChanged(height, oldHeight, width, oldWidth)) {
      return {
        height: height || oldHeight,
        width: width || oldWidth,
        isSizeChanged: true
      };
    }
    return null;
  }

  componentDidUpdate() {
    const { height, width, isSizeChanged, isSizeMayChange, heightValue, widthValue } = this.state;
    if (isSizeMayChange) {
      this.startInterval();
      this.setState({ isSizeMayChange: false });
    }
    if (isSizeChanged) {
      const { enableAnimation, animationDuration, animationEasing, onSizeUpdated, heightOffset } = this.props;
      if (enableAnimation) {
        Animated.parallel([
          Animated.timing(heightValue, {
            toValue: height ? height + heightOffset : 0,
            easing: animationEasing,
            duration: animationDuration
          }),
          Animated.timing(widthValue, {
            toValue: width,
            easing: animationEasing,
            duration: animationDuration
          })
        ]).start(() => {
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
    if (this.finishInterval === false) {
      return;
    }
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
    let data = {};
    // Sometimes the message is invalid JSON, so we ignore that case
    try {
      data = JSON.parse(isBelowKitKat ? e.nativeEvent.message : e.nativeEvent.data);
    } catch (error) {
      console.error(error);
      return;
    }
    const { height, width } = data;
    const { height: oldHeight, width: oldWidth } = this.state;
    if (isSizeChanged(height, oldHeight, width, oldWidth)) {
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
    const { onLoadStart, onNavigationStateChange } = this.props;
    onLoadStart && onLoadStart(event);
    onNavigationStateChange && onNavigationStateChange(event.nativeEvent);
  };

  onLoadingError = event => {
    const { onError, onLoadEnd } = this.props;
    onError && onError(event);
    onLoadEnd && onLoadEnd(event);
    console.warn('Encountered an error loading page', event.nativeEvent);
  };

  onLoadingFinish = event => {
    const { onLoad, onLoadEnd, onNavigationStateChange } = this.props;
    onLoad && onLoad(event);
    onLoadEnd && onLoadEnd(event);
    onNavigationStateChange && onNavigationStateChange(event.nativeEvent);
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
    const { height, width, script, source, heightValue, widthValue } = this.state;
    const { scalesPageToFit, style, scrollEnabled, heightOffset, enableAnimation } = this.props;
    return (
      <Animated.View
        style={[
          styles.container,
          getRenderSize(enableAnimation, height, width, heightOffset, heightValue, widthValue),
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
      </Animated.View>
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
    var wrapper = document.createElement("div");
    wrapper.id = "wrapper";
    while (document.body.firstChild instanceof Node) {
        wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(wrapper);
    var height = 0;
`;

const getBaseScript = isBelowKitKat
  ? function(style) {
      return `
    ; 
    ${commonScript}
    var width = ${getWidth(style)};
    function updateSize() {
      var size = getSize(document.body.firstChild); 
      height = size.height;
      width = size.width;
      AutoHeightWebView.send(JSON.stringify({ width, height }));
    }
    (function () {
      AutoHeightWebView.onMessage = updateSize;
      ${domMutationObserveScript}
    } ());
  `;
    }
  : function(style) {
      return `
    ; 
    ${commonScript}
    var width = ${getWidth(style)};
    function updateSize() {
      var size = getSize(document.body.firstChild); 
      height = size.height;
      width = size.width;
      window.postMessage(JSON.stringify({ width, height }), '*');
    }
    (function () {
      document.addEventListener("message", updateSize);
      ${domMutationObserveScript}
    } ());
  `;
    };
