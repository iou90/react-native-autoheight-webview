'use strict';

import React, { PureComponent } from 'react';

import {
  findNodeHandle,
  requireNativeComponent,
  Animated,
  DeviceEventEmitter,
  Dimensions,
  StyleSheet,
  Platform,
  UIManager,
  ViewPropTypes,
  WebView
} from 'react-native';

import PropTypes from 'prop-types';

import Immutable from 'immutable';

import { getScript, onHeightUpdated, onWidthUpdated, onHeightWidthUpdated, domMutationObserveScript } from './common.js';

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

const screenWidth = Dimensions.get('window').width;

export default class AutoHeightWebView extends PureComponent {
  static propTypes = {
    source: WebView.propTypes.source,
      onHeightUpdated: PropTypes.func,
      onWidthUpdated: PropTypes.func,
      onHeightWidthUpdated: PropTypes.func,
      shouldResizeWidth: PropTypes.bool,
    customScript: PropTypes.string,
    customStyle: PropTypes.string,
    enableAnimation: PropTypes.bool,
    // if set to false may cause some layout issues (width of container will be than width of screen)
    scalesPageToFit: PropTypes.bool,
    // only works on enable animation
    animationDuration: PropTypes.number,
    // offset of rn webView margin
      heightOffset: PropTypes.number,
      widthOffset: PropTypes.number,
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
      heightOffset: 20,
      widthOffset: 20,
      shouldResizeWidth: false
  };

  constructor(props) {
    super(props);
    props.enableAnimation && (this.opacityAnimatedValue = new Animated.Value(0));
    isBelowKitKat && DeviceEventEmitter.addListener('webViewBridgeMessage', this.listenWebViewBridgeMessage);
    this.state = {
      isChangingSource: false,
      height: 0,
        heightOffset: 0,
        width: screenWidth,
        widthOffset: 0,
      script: getScript(props, baseScript)
    };
  }

  componentDidMount() {
    this.startInterval();
  }

  componentWillReceiveProps(nextProps) {
    // injectedJavaScript only works when webView reload (source changed)
      if (Immutable.is(Immutable.fromJS(this.props.source), Immutable.fromJS(nextProps.source))) {
          return;
      }
      else {
          this.setState(
              {
                  isChangingSource: true,
                  height: 0,
                  heightOffset: 0,
                  width: 0,
                  widthOffset: 0,
              },
              () => {
                  this.startInterval();
                  this.setState({ isChangingSource: false });
              }
          );
      }
    this.setState({ script: getScript(nextProps, baseScript) });
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
      const { height, width } = JSON.parse(isBelowKitKat ? e.nativeEvent.message : e.nativeEvent.data);
      if (height && height !== this.state.height && width && width !== this.state.width) {
          const { enableAnimation, animationDuration, heightOffset, widthOffset } = this.props;
          enableAnimation && this.opacityAnimatedValue.setValue(0);
          this.stopInterval();
          
          this.setState(
              {
                  heightOffset,
                  height,
                  widthOffset,
                  width
              },
              () => {
                  enableAnimation
                      ? Animated.timing(this.opacityAnimatedValue, {
                          toValue: 1,
                          duration: animationDuration
                      }).start(() => onHeightWidthUpdated(height, width, this.props))
                      : onHeightWidthUpdated(height, width, this.props);
              }
          );
      }
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

  getWebView = webView => (this.webView = webView);

  stopLoading() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.webView),
      UIManager.RCTAutoHeightWebView.Commands.stopLoading,
      null
    );
  }

  render() {
      const { height, width, script, isChangingSource, heightOffset, widthOffset } = this.state;
    const { scalesPageToFit, enableAnimation, source, customScript, style, enableBaseUrl } = this.props;
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
              height: height + heightOffset,
              width: width + widthOffset
          },
          style
        ]}
      >
        {isChangingSource ? null : (
          <RCTAutoHeightWebView
            onLoadingStart={this.onLoadingStart}
            onLoadingFinish={this.onLoadingFinish}
            onLoadingError={this.onLoadingError}
            ref={this.getWebView}
            style={styles.webView}
            javaScriptEnabled={true}
            injectedJavaScript={script + customScript}
            scalesPageToFit={scalesPageToFit}
            source={webViewSource}
            onMessage={this.onMessage}
            messagingEnabled={true}
            // below kitkat
            onChange={this.onMessage}
          />
        )}
      </Animated.View>
    );
  }
}

const isBelowKitKat = Platform.Version < 19;

const styles = StyleSheet.create({
  container: {
    //width: screenWidth,
    backgroundColor: 'transparent'
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent'
  }
});

const baseScript = isBelowKitKat
  ? `
    ; (function () {
        var wrapper = document.createElement('div');
        wrapper.id = 'wrapper';
        while (document.body.firstChild instanceof Node) {
            wrapper.appendChild(document.body.firstChild);
        }
        document.body.appendChild(wrapper);

        AutoHeightWebView.onMessage = function (message) {
            var rect = document.body.firstElementChild.getBoundingClientRect().toJSON();
            var width = Math.round(rect.width);
            var height = Math.round(rect.height);
            AutoHeightWebView.send(JSON.stringify({ width, height }));
        };
        ${domMutationObserveScript}
    } ());
    `
  : `
    ; (function () {
        var wrapper = document.createElement('div');
        wrapper.id = 'wrapper';
        while (document.body.firstChild instanceof Node) {
            wrapper.appendChild(document.body.firstChild);
        }
        document.body.appendChild(wrapper);

        document.addEventListener('message', function (e) {
            var rect = document.body.firstElementChild.getBoundingClientRect().toJSON();
            var width = Math.round(rect.width);
            var height = Math.round(rect.height);
            window.postMessage(JSON.stringify({ width, height }));
        });
        ${domMutationObserveScript}
    } ());
    `;

