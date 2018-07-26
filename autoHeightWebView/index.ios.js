'use strict';

import React, { PureComponent } from 'react';

import { Animated, StyleSheet, ViewPropTypes, WebView } from 'react-native';

import PropTypes from 'prop-types';

import {
  isEqual,
  setState,
  getWidth,
  isSizeChanged,
  handleSizeUpdated,
  domMutationObserveScript,
  getCurrentSize
} from './common.js';

import momoize from './momoize';

export default class AutoHeightWebView extends PureComponent {
  static propTypes = {
    hasIframe: PropTypes.bool,
    onNavigationStateChange: PropTypes.func,
    onMessage: PropTypes.func,
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
    const { height: oldHeight, width: oldWidth } = state;
    const height = props.style ? props.style.height : null;
    const width = props.style ? props.style.width : null;
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

  handleNavigationStateChange = navState => {
    const { title } = navState;
    const { onNavigationStateChange } = this.props;
    if (!title) {
      onNavigationStateChange && onNavigationStateChange();
      return;
    }
    const [heightValue, widthValue] = title.split(',');
    const width = Number(widthValue);
    const height = Number(heightValue);
    const { height: oldHeight, width: oldWidth } = this.state;
    if (isSizeChanged(height, oldHeight, width, oldWidth)) {
      this.props.enableAnimation && this.opacityAnimatedValue.setValue(0);
      this.setState({
        isSizeChanged: true,
        height,
        width
      });
    }
    onNavigationStateChange && onNavigationStateChange();
  };

  stopLoading() {
    this.webView.stopLoading();
  }

  render() {
    const { height, width } = this.state;
    const {
      onMessage,
      onError,
      onLoad,
      onLoadStart,
      onLoadEnd,
      onShouldStartLoadWithRequest,
      scalesPageToFit,
      enableAnimation,
      heightOffset,
      style,
      scrollEnabled
    } = this.props;
    const { source, script } = this.getUpdatedState(this.props, 'web/', getBaseScript, getIframeBaseScript);
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
          ref={this.webView}
          onMessage={onMessage}
          onError={onError}
          onLoad={onLoad}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          style={styles.webView}
          scrollEnabled={!!scrollEnabled}
          scalesPageToFit={scalesPageToFit}
          injectedJavaScript={script}
          source={source}
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

function getBaseScript(style) {
  return `
    ;
    ${getCurrentSize}
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
    ${getCurrentSize}
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
