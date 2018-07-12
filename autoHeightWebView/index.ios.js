'use strict';

import React, { PureComponent } from 'react';

import { Animated, StyleSheet, ViewPropTypes, WebView } from 'react-native';

import PropTypes from 'prop-types';

import { needChangeSource, getWidth, getScript, handleSizeUpdated, domMutationObserveScript } from './common.js';

export default class AutoHeightWebView extends PureComponent {
  static propTypes = {
    hasIframe: PropTypes.bool,
    source: WebView.propTypes.source,
    customScript: PropTypes.string,
    customStyle: PropTypes.string,
    enableAnimation: PropTypes.bool,
    style: ViewPropTypes.style,
    scrollEnabled: PropTypes.bool,
    // either height or width updated will trigger this
    onSizeUpdated: PropTypes.func,
    // if set to true may cause some layout issues (smaller font size)
    scalesPageToFit: PropTypes.bool,
    // only works on enable animation
    animationDuration: PropTypes.number,
    // offset of rn webview margin
    heightOffset: PropTypes.number,
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
    const { enableAnimation, style } = props;
    enableAnimation && (this.opacityAnimatedValue = new Animated.Value(0));
    this.state = {
      width: getWidth(style),
      height: style && style.height ? style.height : 0,
      script: getScript(props, getBaseScript, getIframeBaseScript)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.style) {
      const { width, height } = nextProps.style;
      width && this.setState({ width });
      height && this.setState({ height });
    }
    this.setState({ script: getScript(nextProps, getBaseScript, getIframeBaseScript) });
    this.needChangeSource = needChangeSource(nextProps, this.props);
  }

  handleNavigationStateChange = navState => {
    const { title } = navState;
    if (!title) {
      return;
    }
    const [heightValue, widthValue] = title.split(',');
    const width = Number(widthValue);
    const height = Number(heightValue);
    const { height: oldHeight, width: oldWidth } = this.state;
    if ((height && height !== oldHeight) || (width && width !== oldWidth)) {
      // if ((height && height !== oldHeight)) {
      const { enableAnimation, animationDuration, onSizeUpdated } = this.props;
      enableAnimation && this.opacityAnimatedValue.setValue(0);
      this.setState(
        {
          height,
          width
        },
        () => {
          enableAnimation
            ? Animated.timing(this.opacityAnimatedValue, {
                toValue: 1,
                duration: animationDuration
              }).start(() => handleSizeUpdated(height, width, onSizeUpdated))
            : handleSizeUpdated(height, width, onSizeUpdated);
        }
      );
    }
  };

  getWebView = webView => (this.webView = webView);

  stopLoading() {
    this.webView.stopLoading();
  }

  render() {
    const { height, width, script } = this.state;
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
      style,
      scrollEnabled
    } = this.props;
    let webViewSource = Object.assign({}, source, { baseUrl: 'web/' });
    if (this.needChangeSource) {
      this.changeSourceFlag = !this.changeSourceFlag;
      webViewSource = Object.assign(webViewSource, { changeSourceFlag: this.changeSourceFlag });
    }
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
          originWhitelist={['*']}
          ref={this.getWebView}
          onError={onError}
          onLoad={onLoad}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          style={styles.webView}
          injectedJavaScript={script}
          scrollEnabled={!!scrollEnabled}
          scalesPageToFit={scalesPageToFit}
          source={webViewSource}
          onNavigationStateChange={this.handleNavigationStateChange}
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
    flex: 1,
    backgroundColor: 'transparent'
  }
});

const commonScript = `
    updateSize();
    window.addEventListener('load', updateSize);
    window.addEventListener('resize', updateSize);
    `;

const getSize = `
    function getSize(container) {
      var height = container.clientHeight || document.body.offsetHeight;
      var width = container.clientWidth || document.body.offsetWidth;
      return {
        height,
        width
      };
    }
    `;

function getBaseScript(style) {
  return `
    ;
    ${getSize}
    (function () {
        var height = 0;
        var width = ${getWidth(style)};
        var wrapper = document.createElement('div');
        wrapper.id = 'rnahw-wrapper';
        while (document.body.firstChild instanceof Node) {
            wrapper.appendChild(document.body.firstChild);
        }
        document.body.appendChild(wrapper);
        function updateSize() {
            if(document.body.offsetHeight !== height || document.body.offsetWidth !== width) {
                var size = getSize(wrapper);
                height = size.height;
                width = size.width;
                document.title = height.toString() + ',' + width.toString();
            }
        }
        ${commonScript}
        ${domMutationObserveScript}
    } ());
    `;
}

function getIframeBaseScript(style) {
  return `
    ;
    ${getSize}
    (function () {
        var height = 0;
        var width = ${getWidth(style)};
        function updateSize() {
            if(document.body.offsetHeight !== height || document.body.offsetWidth !== width) {
                var size = getSize(document.body.firstChild);
                height = size.height;
                width = size.width;
                document.title = height.toString() + ',' + width.toString();
            }
        }
        ${commonScript}
        ${domMutationObserveScript}
    } ());
    `;
}
