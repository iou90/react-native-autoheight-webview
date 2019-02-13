'use strict';

import React, { PureComponent } from 'react';

import { Animated, StyleSheet } from 'react-native';

import PropTypes from 'prop-types';

import { commonPropTypes } from './propTypes.js';

import { WebView } from 'react-native-webview';

import {
  isEqual,
  setState,
  getWidth,
  isSizeChanged,
  handleSizeUpdated,
  domMutationObserveScript,
  getStateFromProps,
  updateSizeWithMessage
} from './common.js';

import momoize from './momoize';

export default class AutoHeightWebView extends PureComponent {
  static propTypes = {
    ...commonPropTypes,
    hasIframe: PropTypes.bool,
    // only works on enable animation
    animationDuration: PropTypes.number,
    // offset of rn webview margin
    heightOffset: PropTypes.number,
    // webview props
    scrollEnabled: PropTypes.bool,
    onShouldStartLoadWithRequest: PropTypes.func,
    decelerationRate: PropTypes.number,
    allowsInlineMediaPlayback: PropTypes.bool,
    bounces: PropTypes.bool,
    dataDetectorTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  };

  static defaultProps = {
    baseUrl: 'web/',
    enableAnimation: true,
    animationDuration: 255,
    heightOffset: 12
  };

  constructor(props) {
    super(props);
    const { enableAnimation, style } = props;
    enableAnimation && (this.opacityAnimatedValue = new Animated.Value(0));
    this.webView = React.createRef();
    this.state = {
      isSizeChanged: false,
      width: getWidth(style),
      height: style && style.height ? style.height : 0
    };
  }

  getUpdatedState = momoize(setState, isEqual);

  static getDerivedStateFromProps(props, state) {
    return getStateFromProps(props, state);
  }

  componentDidUpdate() {
    const { height, width, isSizeChanged } = this.state;
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
      this.props.enableAnimation && this.opacityAnimatedValue.setValue(0);
      this.setState({
        isSizeChanged: true,
        height,
        width
      });
    }
    const { onMessage } = this.props;
    onMessage && onMessage(event);
  };

  stopLoading() {
    this.webView.current.stopLoading();
  }

  render() {
    const { height, width } = this.state;
    const {
      renderError,
      originWhitelist,
      mediaPlaybackRequiresUserAction,
      bounces,
      decelerationRate,
      allowsInlineMediaPlayback,
      dataDetectorTypes,
      onNavigationStateChange,
      onError,
      onLoad,
      onLoadStart,
      onLoadEnd,
      onShouldStartLoadWithRequest,
      enableAnimation,
      heightOffset,
      style,
      scrollEnabled
    } = this.props;
    const { source, script } = this.getUpdatedState(this.props, getBaseScript, getIframeBaseScript);
    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: enableAnimation ? this.opacityAnimatedValue : 1,
            width,
            height: height + heightOffset
          },
          style
        ]}
      >
        <WebView
          renderError={renderError}
          mediaPlaybackRequiresUserAction={mediaPlaybackRequiresUserAction}
          bounces={bounces}
          decelerationRate={decelerationRate}
          allowsInlineMediaPlayback={allowsInlineMediaPlayback}
          dataDetectorTypes={dataDetectorTypes}
          originWhitelist={originWhitelist || ['*']}
          ref={this.webView}
          onMessage={this.onMessage}
          onError={onError}
          onLoad={onLoad}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          style={styles.webView}
          scrollEnabled={!!scrollEnabled}
          injectedJavaScript={script}
          source={source}
          onNavigationStateChange={onNavigationStateChange}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  },
  webView: {
    backgroundColor: 'transparent',
    flex: 1
  }
});

// add viewport setting to meta for WKWebView
const commonScript = `
var meta = document.createElement('meta'); 
meta.setAttribute('name', 'viewport'); 
meta.setAttribute('content', 'width=device-width'); document.getElementsByTagName('head')[0].appendChild(meta);
updateSize();
window.addEventListener('load', updateSize);
window.addEventListener('resize', updateSize);
`;

function getBaseScript(style) {
  return `
  ;
  (function () {
    if (!document.getElementById("rnahw-wrapper")) {
      var wrapper = document.createElement('div');
      wrapper.id = 'rnahw-wrapper';
      wrapper.appendChild(document.body.firstChild);
      document.body.appendChild(wrapper);
    }
    var width = ${getWidth(style)};
    ${updateSizeWithMessage('wrapper')}
    ${commonScript}
    ${domMutationObserveScript}
  } ());
  `;
}

function getIframeBaseScript(style) {
  return `
  ;
  (function () {
    var width = ${getWidth(style)};
    ${updateSizeWithMessage('document.body.firstChild')}
    ${commonScript}
    ${domMutationObserveScript}
  } ());
  `;
}
