'use strict';

import React, { Component } from 'react';

import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import AutoHeightWebView from 'react-native-autoheight-webview';

import {
  autoHeightHtml0,
  autoHeightHtml1,
  autoHeightScript,
  autoWidthHtml0,
  autoWidthHtml1,
  autoWidthScript,
  style0,
  inlineBodyStyle
} from './config';

export default class Explorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heightHtml: autoHeightHtml0,
      heightScript: null,
      heightStyle: null,
      heightSize: {
        height: 0,
        width: 0
      },
      widthHtml: autoWidthHtml0,
      widthScript: null,
      widthStyle: inlineBodyStyle,
      widthSize: {
        height: 0,
        width: 0
      }
    };
  }

  changeSource = () => {
    this.setState(prevState => ({
      widthHtml: prevState.widthHtml === autoWidthHtml0 ? autoWidthHtml1 : autoWidthHtml0,
      heightHtml: prevState.heightHtml === autoHeightHtml0 ? autoHeightHtml1 : autoHeightHtml0
    }));
  };

  changeStyle = () => {
    this.setState(prevState => ({
      widthStyle: prevState.widthStyle == inlineBodyStyle ? style0 + inlineBodyStyle : inlineBodyStyle,
      heightStyle: prevState.heightStyle == null ? style0 : null
    }));
  };

  changeScript = () => {
    this.setState(prevState => ({
      widthScript: prevState.widthScript === null ? autoWidthScript : null,
      heightScript: prevState.heightScript === null ? autoHeightScript : null
    }));
  };

  render() {
    const {
      heightHtml,
      heightSize,
      heightStyle,
      heightScript,
      widthHtml,
      widthSize,
      widthStyle,
      widthScript
    } = this.state;
    return (
      <ScrollView
        style={{
          paddingTop: 45,
          backgroundColor: 'lightyellow'
        }}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <AutoHeightWebView
          customStyle={heightStyle}
          onError={() => console.log('height on error')}
          onLoad={() => console.log('height on load')}
          onLoadStart={() => console.log('height on load start')}
          onLoadEnd={() => console.log('height on load end')}
          onShouldStartLoadWithRequest={result => {
            console.log(result);
            return true;
          }}
          onSizeUpdated={heightSize => this.setState({ heightSize })}
          source={{ html: heightHtml }}
          customScript={heightScript}
        />
        <Text style={{ padding: 5 }}>
          height: {heightSize.height}, width: {heightSize.width}
        </Text>
        <AutoHeightWebView
          style={{
            marginTop: 15
          }}
          customStyle={widthStyle}
          onError={() => console.log('width on error')}
          onLoad={() => console.log('width on load')}
          onLoadStart={() => console.log('width on load start')}
          onLoadEnd={() => console.log('width on load end')}
          onShouldStartLoadWithRequest={result => {
            console.log(result);
            return true;
          }}
          onSizeUpdated={widthSize => this.setState({ widthSize })}
          source={{ html: widthHtml }}
          customScript={widthScript}
        />
        <Text style={{ padding: 5 }}>
          height: {widthSize.height}, width: {widthSize.width}
        </Text>
        <TouchableOpacity onPress={this.changeSource} style={styles.button}>
          <Text>change source</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.changeStyle} style={styles.button}>
          <Text>change style</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.changeScript} style={[styles.button, { marginBottom: 100 }]}>
          <Text>change heightScript</Text>
        </TouchableOpacity>
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
