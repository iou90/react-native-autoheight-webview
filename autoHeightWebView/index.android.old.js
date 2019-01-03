'use strict';

import React, { PureComponent } from 'react';

import { Animated, Dimensions, StyleSheet, WebView } from 'react-native';

import { androidPropTypes } from './propTypes.js';

import Immutable from 'immutable';

import { handleSizeUpdated, domMutationObserveScript } from './common.js';

export default class AutoHeightWebView extends PureComponent {
  static propTypes = androidPropTypes;

  static defaultProps = {
    scalesPageToFit: true,
    enableBaseUrl: false,
    enableAnimation: true,
    animationDuration: 555,
    heightOffset: 20
  };

  constructor(props) {
    super(props);
    props.enableAnimation && (this.opacityAnimatedValue = new Animated.Value(0));
    this.state = {
      isChangingSource: false,
      height: 0,
      heightOffset: 0,
      script: baseScript
    };
  }

  componentDidMount() {
    this.startInterval();
  }

  componentWillReceiveProps(nextProps) {
    // injectedJavaScript only works when webView reload (source changed)
    if (Immutable.is(Immutable.fromJS(this.props.source), Immutable.fromJS(nextProps.source))) {
      return;
    } else {
      this.setState(
        {
          isChangingSource: true,
          height: 0,
          heightOffset: 0
        },
        () => {
          this.startInterval();
          this.setState({ isChangingSource: false });
        }
      );
    }
    this.setState({ script: baseScript });
  }

  componentWillUnmount() {
    this.stopInterval();
  }

  startInterval() {
    this.finishInterval = false;
    this.interval = setInterval(() => !this.finishInterval && this.webView.postMessage('getBodyHeight'), 205);
  }

  stopInterval() {
    this.finishInterval = true;
    clearInterval(this.interval);
  }

  onMessage = event => {
    const height = parseInt(event.nativeEvent.data);
    if (height && height !== this.state.height) {
      const { enableAnimation, animationDuration, heightOffset, onSizeUpdated, style } = this.props;
      enableAnimation && this.opacityAnimatedValue.setValue(0);
      this.stopInterval();
      this.setState(
        {
          heightOffset,
          height
        },
        () => {
          const currentWidth = Object.assign(styles.container, style).width;
          enableAnimation
            ? Animated.timing(this.opacityAnimatedValue, {
                toValue: 1,
                duration: animationDuration
              }).start(() => handleSizeUpdated(height, currentWidth, onSizeUpdated))
            : handleSizeUpdated(height, currentWidth, onSizeUpdated);
        }
      );
    }
    const { onMessage } = this.props;
    onMessage && onMessage(event);
  };

  getWebView = webView => (this.webView = webView);

  render() {
    const { height, script, isChangingSource, heightOffset } = this.state;
    const {
      thirdPartyCookiesEnabled,
      domStorageEnabled,
      userAgent,
      geolocationEnabled,
      allowUniversalAccessFromFileURLs,
      mixedContentMode,
      onNavigationStateChange,
      renderError,
      originWhitelist,
      mediaPlaybackRequiresUserAction,
      scalesPageToFit,
      enableAnimation,
      source,
      customScript,
      style,
      enableBaseUrl,
      onError,
      onLoad,
      onLoadStart,
      onLoadEnd
    } = this.props;
    let webViewSource = source;
    if (enableBaseUrl) {
      webViewSource = Object.assign({}, source, {
        baseUrl: 'file:///android_asset/web/'
      });
    }
    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: enableAnimation ? this.opacityAnimatedValue : 1,
            height: height + heightOffset
          },
          style
        ]}
      >
        {isChangingSource ? null : (
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
            originWhitelist={originWhitelist}
            ref={this.getWebView}
            onMessage={this.onMessage}
            onError={onError}
            onLoad={onLoad}
            onLoadStart={onLoadStart}
            onLoadEnd={onLoadEnd}
            style={styles.webView}
            scalesPageToFit={scalesPageToFit}
            javaScriptEnabled={true}
            injectedJavaScript={script + customScript}
            source={webViewSource}
            messagingEnabled={true}
          />
        )}
      </Animated.View>
    );
  }
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: screenWidth,
    backgroundColor: 'transparent'
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent'
  }
});

const baseScript = `
; (function () {
    document.addEventListener('message', function (e) {
        window.postMessage(String(document.body.offsetHeight));
    });
    ${domMutationObserveScript}
} ());
`;
