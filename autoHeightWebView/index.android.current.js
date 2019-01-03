'use strict';

import React, { PureComponent } from 'react';

import { Animated, Easing, StyleSheet, WebView, Dimensions } from 'react-native';

import PropTypes from 'prop-types';

import { androidPropTypes } from 'react-native-autoheight-webview/autoHeightWebView/propTypes';

import {
  isEqual,
  setState,
  isSizeChanged,
  handleSizeUpdated,
  getWidth,
  getScript,
  domMutationObserveScript,
  getCurrentSize
} from 'react-native-autoheight-webview/autoHeightWebView/common';

import momoize from 'react-native-autoheight-webview/autoHeightWebView/momoize';

const getUpdatedState = momoize(setState, isEqual);

function getRenderSize(enableAnimation, height, width, heightOffset, heightValue, widthValue) {
  return {
    height: enableAnimation ? heightValue : height ? height + heightOffset : 0,
    width: enableAnimation ? widthValue : width
  };
}

export default class AutoHeightWebView extends PureComponent {
  static propTypes = {
    ...androidPropTypes,
    animationEasing: PropTypes.func
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
    this.webView = React.createRef();
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
  }

  startInterval() {
    if (this.finishInterval === false) {
      return;
    }
    this.finishInterval = false;
    this.setState({
      interval: setInterval(() => !this.finishInterval && this.webView.current.postMessage('getBodyHeight'), 205)
    });
  }

  stopInterval() {
    this.finishInterval = true;
    clearInterval(this.state.interval);
  }

  onMessage = event => {
    if (!event.nativeEvent) {
      return;
    }
    let data = {};
    // Sometimes the message is invalid JSON, so we ignore that case
    try {
      data = JSON.parse(event.nativeEvent.data);
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
    onMessage && onMessage(event);
  };

  render() {
    const { height, width, script, source, heightValue, widthValue } = this.state;
    const {
      domStorageEnabled,
      thirdPartyCookiesEnabled,
      userAgent,
      geolocationEnabled,
      allowUniversalAccessFromFileURLs,
      mixedContentMode,
      onNavigationStateChange,
      renderError,
      originWhitelist,
      mediaPlaybackRequiresUserAction,
      scalesPageToFit,
      style,
      heightOffset,
      enableAnimation,
      onError,
      onLoad,
      onLoadStart,
      onLoadEnd
    } = this.props;
    return (
      <Animated.View
        style={[
          styles.container,
          getRenderSize(enableAnimation, height, width, heightOffset, heightValue, widthValue),
          style
        ]}
      >
        <WebView
          onNavigationStateChange={onNavigationStateChange}
          domStorageEnabled={domStorageEnabled}
          thirdPartyCookiesEnabled={thirdPartyCookiesEnabled}
          userAgent={userAgent}
          geolocationEnabled={geolocationEnabled}
          allowUniversalAccessFromFileURLs={allowUniversalAccessFromFileURLs}
          mixedContentMode={mixedContentMode}
          renderError={renderError}
          mediaPlaybackRequiresUserAction={mediaPlaybackRequiresUserAction}
          originWhitelist={originWhitelist || ['*']}
          ref={this.webView}
          onMessage={this.onMessage}
          onError={onError}
          onLoad={onLoad}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          style={styles.webView}
          scalesPageToFit={scalesPageToFit}
          javaScriptEnabled={true}
          injectedJavaScript={script}
          source={source}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: Dimensions.get('window').width,
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

const getBaseScript = function(style) {
  return `
  ; 
  ${commonScript}
  var width = ${getWidth(style)};
  function updateSize() {
    var size = getSize(document.body.firstChild); 
    height = size.height;
    width = size.width;
    window.postMessage(JSON.stringify({ width: width, height: height }), '*');
  }
  (function () {
    document.addEventListener("message", updateSize);
    ${domMutationObserveScript}
  } ());
`;
};
