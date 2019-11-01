'use strict';

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

import { StyleSheet, Platform, ViewPropTypes } from 'react-native';

import PropTypes from 'prop-types';

import { WebView } from 'react-native-webview';

import { reduceData, getWidth, isSizeChanged, shouldUpdate } from './utils';

const AutoHeightWebView = React.memo(
  forwardRef((props, ref) => {
    const { style, onMessage, onSizeUpdated, source } = props;

    if (!source) {
      return null;
    }

    let webView = useRef();
    useImperativeHandle(ref, () => ({
      stopLoading: () => webView.current.stopLoading(),
      goForward: () => webView.current.goForward(),
      goBack: () => webView.current.goBack(),
      reload: () => webView.current.reload(),
      postMessage: e => webView.current.postMessage(e),
      injectJavaScript: script => webView.current.injectJavaScript(script)
    }));

    const [size, setSize] = useState({
      height: style && style.height ? style.height : 0,
      width: getWidth(style)
    });
    const handleMessage = event => {
      onMessage && onMessage(event);
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
      const { height: previousHeight, width: previousWidth } = size;
      isSizeChanged({ height, previousHeight, width, previousWidth }) &&
        setSize({
          height,
          width
        });
    };

    const { currentSource, script } = reduceData(props);

    const { width, height } = size;
    useEffect(
      () =>
        onSizeUpdated &&
        onSizeUpdated({
          height,
          width
        }),
      [width, height, onSizeUpdated]
    );

    return (
      <WebView
        {...props}
        ref={webView}
        onMessage={handleMessage}
        style={[
          styles.webView,
          {
            width,
            height
          },
          style
        ]}
        injectedJavaScript={script}
        source={currentSource}
      />
    );
  }),
  (prevProps, nextProps) => !shouldUpdate({ prevProps, nextProps })
);

AutoHeightWebView.propTypes = {
  onSizeUpdated: PropTypes.func,
  // add baseUrl/files... to android/app/src/assets/ on android
  // add baseUrl/files... to project root on iOS
  files: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      type: PropTypes.string,
      rel: PropTypes.string
    })
  ),
  style: ViewPropTypes.style,
  customScript: PropTypes.string,
  customStyle: PropTypes.string,
  zoomable: PropTypes.bool,
  // webview props
  originWhitelist: PropTypes.arrayOf(PropTypes.string),
  onMessage: PropTypes.func,
  // baseUrl now contained by source
  // 'web/' by default on iOS
  // 'file:///android_asset/web/' by default on Android
  source: PropTypes.object
};

let defaultProps = {
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
  originWhitelist: ['*'],
  zoomable: true
};

Platform.OS === 'android' &&
  Object.assign(defaultProps, {
    zoomable: false,
    // if set to true may cause some layout issues (width of container will be than width of screen) on android
    scalesPageToFit: false
  });

AutoHeightWebView.defaultProps = defaultProps;

const styles = StyleSheet.create({
  webView: {
    backgroundColor: 'transparent'
  }
});

export default AutoHeightWebView;
