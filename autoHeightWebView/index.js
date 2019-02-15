'use strict';

import React, { PureComponent } from 'react';

import { StyleSheet, Platform, ViewPropTypes } from 'react-native';

import PropTypes from 'prop-types';

import { WebView } from 'react-native-webview';

import {
  isEqual,
  setState,
  getWidth,
  isSizeChanged,
  handleSizeUpdated,
  getStateFromProps,
  getBaseScript
} from './utils';

import momoize from './momoize';

export default class AutoHeightWebView extends PureComponent {
  static propTypes = {
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
    // webview props
    originWhitelist: PropTypes.arrayOf(PropTypes.string),
    onMessage: PropTypes.func
  };

  static defaultProps = {
    baseUrl: Platform.OS === 'ios' ? 'web/' : 'file:///android_asset/web/'
  };

  constructor(props) {
    super(props);
    const { style } = props;
    this.webView = React.createRef();
    const width = getWidth(style);
    const height = style && style.height ? style.height : 1;
    this.size = {
      oldWidth: width,
      oldHeight: height
    };
    this.state = {
      width,
      height
    };
  }

  getUpdatedState = momoize(setState, isEqual);

  static getDerivedStateFromProps(props, state) {
    return getStateFromProps(props, state);
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
    const { oldHeight, oldWidth } = this.size;
    if (isSizeChanged(height, oldHeight, width, oldWidth)) {
      this.size = {
        oldHeight: height,
        oldWidth: width
      };
      this.setState(
        {
          height,
          width
        },
        () => handleSizeUpdated(height, width, this.props.onSizeUpdated)
      );
    }
    const { onMessage } = this.props;
    onMessage && onMessage(event);
  };

  stopLoading() {
    this.webView.current.stopLoading();
  }

  render() {
    const { height, width } = this.state;
    const { style, originWhitelist } = this.props;
    const { source, script } = this.getUpdatedState(this.props, getBaseScript);
    return (
      <WebView
        {...this.props}
        originWhitelist={originWhitelist || ['*']}
        ref={this.webView}
        onMessage={this.onMessage}
        style={[
          styles.webView,
          {
            width,
            height
          },
          style
        ]}
        injectedJavaScript={script}
        source={source}
      />
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    backgroundColor: 'transparent'
  }
});
