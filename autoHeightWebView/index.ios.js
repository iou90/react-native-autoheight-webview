'use strict';

import React, { PureComponent } from 'react';

import { Animated, Dimensions, StyleSheet, ViewPropTypes, WebView } from 'react-native';

import PropTypes from 'prop-types';

import { getScript, onHeightUpdated, domMutationObserveScript } from './common.js';

export default class AutoHeightWebView extends PureComponent {
  static propTypes = {
    hasIframe: PropTypes.bool,
    source: WebView.propTypes.source,
    onHeightUpdated: PropTypes.func,
    customScript: PropTypes.string,
    customStyle: PropTypes.string,
    enableAnimation: PropTypes.bool,
    // if set to true may cause some layout issues (smaller font size)
    scalesPageToFit: PropTypes.bool,
    // only works on enable animation
    animationDuration: PropTypes.number,
    // offset of rn webview margin
    heightOffset: PropTypes.number,
    style: ViewPropTypes.style,
    //  rn WebView callback
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    onLoadStart: PropTypes.func,
    onLoadEnd: PropTypes.func,
    onShouldStartLoadWithRequest: PropTypes.func,
    // add web/files... to project root
    files: PropTypes.arrayOf(
      PropTypes.shape({
        href: PropTypes.string,
        type: PropTypes.string,
        rel: PropTypes.string
      })
    )
  };

  static defaultProps = {
    scalesPageToFit: false,
    enableAnimation: true,
    animationDuration: 555,
    heightOffset: 12
  };

  constructor(props) {
    super(props);
    props.enableAnimation && (this.opacityAnimatedValue = new Animated.Value(0));
    this.state = {
      height: 0,
      script: getScript(props, baseScript, iframeBaseScript)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ script: getScript(nextProps, baseScript, iframeBaseScript) });
  }

  handleNavigationStateChange = navState => {
    const height = Number(navState.title);
    const { enableAnimation, animationDuration } = this.props;
    if (height && height !== this.state.height) {
      enableAnimation && this.opacityAnimatedValue.setValue(0);
      this.setState({ height }, () => {
        enableAnimation
          ? Animated.timing(this.opacityAnimatedValue, {
              toValue: 1,
              duration: animationDuration
            }).start(() => onHeightUpdated(height, this.props))
          : onHeightUpdated(height, this.props);
      });
    }
  };

  getWebView = webView => {
      this.webView = webView;
      this.props.webViewInstance(webView));
  }



  stopLoading() {
    this.webView.stopLoading();
  }

  render() {
    const { height, script } = this.state;
    const {
      onError,
      onLoad,
      onLoadStart,
      onLoadEnd,
      onShouldStartLoadWithRequest,
      scalesPageToFit,
      enableAnimation,
      source,
      heightOffset,
      customScript,
      style
    } = this.props;
    const webViewSource = Object.assign({}, source, { baseUrl: 'web/' });
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
        <WebView
          ref={this.getWebView}
          onError={onError}
          onLoad={onLoad}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          style={styles.webView}
          injectedJavaScript={script + customScript}
          scrollEnabled={false}
          scalesPageToFit={scalesPageToFit}
          source={webViewSource}
          onNavigationStateChange={this.handleNavigationStateChange}
        />
      </Animated.View>
    );
  }
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    backgroundColor: 'transparent'
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent'
  }
});

const commonScript = `
    updateHeight();
    window.addEventListener('load', updateHeight);
    window.addEventListener('resize', updateHeight);
    `;

const baseScript = `
    ;
    (function () {
        var i = 0;
        var height = 0;
        var wrapper = document.createElement('div');
        wrapper.id = 'height-wrapper';
        while (document.body.firstChild) {
            wrapper.appendChild(document.body.firstChild);
        }
        document.body.appendChild(wrapper);
        function updateHeight() {
            if(document.body.offsetHeight !== height) {
                height = wrapper.clientHeight;
                document.title = wrapper.clientHeight;
                window.location.hash = ++i;
            }
        }
        ${commonScript}
        ${domMutationObserveScript}
    } ());
    `;

const iframeBaseScript = `
    ;
    (function () {
        var i = 0;
        var height = 0;
        function updateHeight() {
            if(document.body.offsetHeight !== height) {
                height = document.body.firstChild.clientHeight;
                document.title = document.body.firstChild.clientHeight;
                window.location.hash = ++i;
            }
        }
        ${commonScript}
        ${domMutationObserveScript}
    } ());
    `;
