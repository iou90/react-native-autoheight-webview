'use strict';

import React, { useState, useEffect, useMemo, useRef, useImperativeHandle, forwardRef } from 'react';

import { StyleSheet, Platform, ViewPropTypes } from 'react-native';

import PropTypes from 'prop-types';

import { WebView } from 'react-native-webview';

import { getMemoResult, getWidth, isSizeChanged } from './utils';

const AutoHeightWebView = forwardRef((props, ref) => {
  let webView = useRef();
  useImperativeHandle(ref, () => ({
    stopLoading: () => webView.current.stopLoading(),
    goForward: () => webView.current.goForward(),
    goBack: () => webView.current.goBack(),
    reload: () => webView.current.reload(),
    injectJavaScript: script => webView.current.injectJavaScript(script)
  }));

  const { style, onMessage, onSizeUpdated, source, baseUrl, files, customStyle, customScript, zoomable } = props;

  const [size, setSize] = useState(() => ({
    height: style && style.height ? style.height : 0,
    width: getWidth(style)
  }));
  const hanldeMessage = event => {
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

  const { currentSource, script } = useMemo(
    () => getMemoResult({ source, baseUrl, files, customStyle, customScript, zoomable }),
    [source, baseUrl, files, customStyle, customScript, zoomable]
  );

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
      onMessage={hanldeMessage}
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
});

AutoHeightWebView.propTypes = {
  onSizeUpdated: PropTypes.func,
  // 'web/' by default on iOS
  // 'file:///android_asset/web/' by default on Android
  baseUrl: PropTypes.string,
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
  source: PropTypes.object
};

let defaultProps = {
  showsVerticalScrollIndicator: false,
  showsHorizontalScrollIndicator: false,
  originWhitelist: ['*'],
  baseUrl: 'web/',
  zoomable: true
};

Platform.OS === 'android' &&
  Object.assign(defaultProps, {
    baseUrl: 'file:///android_asset/web/',
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
