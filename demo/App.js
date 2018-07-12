'use strict';

import React, { Component } from 'react';

import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import AutoHeightWebView from 'react-native-autoheight-webview';

import {
  autoHeightHtml0,
  autoHeightHtml1,
  autoHeightScript,
  autoHeightStyle0,
  autoWidthHtml0,
  autoWidthHtml1,
  autoWidthScript,
  autoWidthStyle0
} from './config';

export default class Explorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: autoHeightHtml0,
      script: null,
      webViewStyle: null,
      size: {
        height: 0,
        width: 0
      }
    };
  }

  changeSource = () => {
    this.setState(prevState => ({
      html: prevState.html === autoHeightHtml0 ? autoHeightHtml1 : autoHeightHtml0
    }));
  };

  changeStyle = () => {
    this.setState(prevState => ({
      webViewStyle: prevState.webViewStyle == null ? autoHeightStyle0 : null
    }));
  };

  changeScript = () => {
    this.setState(prevState => ({
      script: prevState.script === null ? autoHeightScript : null
    }));
  };

  render() {
    const { html, size, webViewStyle, script } = this.state;
    return (
      <ScrollView
        style={{
          backgroundColor: 'lightyellow'
        }}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <AutoHeightWebView
          customStyle={webViewStyle}
          onError={() => console.log('on error')}
          onLoad={() => console.log('on load')}
          onLoadStart={() => console.log('on load start')}
          onLoadEnd={() => console.log('on load end')}
          onShouldStartLoadWithRequest={result => {
            console.log(result);
            return true;
          }}
          onSizeUpdated={size => this.setState({ size })}
          source={{ html }}
          customScript={script}
        />
        <TouchableOpacity onPress={this.changeSource} style={styles.button}>
          <Text>change source</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.changeStyle} style={styles.button}>
          <Text>change style</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.changeScript} style={styles.button}>
          <Text>change script (have to change source to reload on android)</Text>
        </TouchableOpacity>
        <Text style={{ padding: 5 }}>
          height: {size.height}, width: {size.width}
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
    backgroundColor: 'aliceblue',
    borderRadius: 5,
    padding: 5
  }
});
