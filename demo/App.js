import React, {useState} from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';

import AutoHeightWebView from 'react-native-autoheight-webview';

import {
  autoHeightHtml0,
  autoHeightHtml1,
  autoHeightScript,
  autoWidthHtml0,
  autoWidthHtml1,
  autoWidthScript,
  autoDetectLinkScript,
  style0,
  inlineBodyStyle,
} from './config';

const onShouldStartLoadWithRequest = result => {
  console.log(result);
  return true;
};

const onError = ({nativeEvent}) =>
  console.error('WebView error: ', nativeEvent);

const onMessage = event => {
  const {data} = event.nativeEvent;
  let messageData;
  // maybe parse stringified JSON
  try {
    messageData = JSON.parse(data);
  } catch (e) {
    console.log(e.message);
  }
  if (typeof messageData === 'object') {
    const {url} = messageData;
    // check if this message concerns us
    if (url && url.startsWith('http')) {
      Linking.openURL(url).catch(error =>
        console.error('An error occurred', error),
      );
    }
  }
};

const onHeightLoadStart = () => console.log('height on load start');

const onHeightLoad = () => console.log('height on load');

const onHeightLoadEnd = () => console.log('height on load end');

const onWidthLoadStart = () => console.log('width on load start');

const onWidthLoad = () => console.log('width on load');

const onWidthLoadEnd = () => console.log('width on load end');

const Explorer = () => {
  const [{widthHtml, heightHtml}, setHtml] = useState({
    widthHtml: autoWidthHtml0,
    heightHtml: autoHeightHtml0,
  });
  const changeSource = () =>
    setHtml({
      widthHtml: widthHtml === autoWidthHtml0 ? autoWidthHtml1 : autoWidthHtml0,
      heightHtml:
        heightHtml === autoHeightHtml0 ? autoHeightHtml1 : autoHeightHtml0,
    });

  const [{widthStyle, heightStyle}, setStyle] = useState({
    heightStyle: null,
    widthStyle: inlineBodyStyle,
  });
  const changeStyle = () =>
    setStyle({
      widthStyle:
        widthStyle === inlineBodyStyle
          ? style0 + inlineBodyStyle
          : inlineBodyStyle,
      heightStyle: heightStyle === null ? style0 : null,
    });

  const [{widthScript, heightScript}, setScript] = useState({
    heightScript: autoDetectLinkScript,
    widthScript: null,
  });
  const changeScript = () =>
    setScript({
      widthScript: widthScript == autoWidthScript ? autoWidthScript : null,
      heightScript:
        heightScript !== autoDetectLinkScript
          ? autoDetectLinkScript
          : autoHeightScript + autoDetectLinkScript,
    });

  const [heightSize, setHeightSize] = useState({height: 0, width: 0});
  const [widthSize, setWidthSize] = useState({height: 0, width: 0});

  return (
    <ScrollView
      style={{
        paddingTop: 45,
        backgroundColor: 'lightyellow',
      }}
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <AutoHeightWebView
        customStyle={heightStyle}
        onError={onError}
        onLoad={onHeightLoad}
        onLoadStart={onHeightLoadStart}
        onLoadEnd={onHeightLoadEnd}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onSizeUpdated={setHeightSize}
        source={{html: heightHtml}}
        customScript={heightScript}
        onMessage={onMessage}
      />
      <Text style={{padding: 5}}>
        height: {heightSize.height}, width: {heightSize.width}
      </Text>
      <AutoHeightWebView
        style={{
          marginTop: 15,
        }}
        customStyle={widthStyle}
        onError={onError}
        onLoad={onWidthLoad}
        onLoadStart={onWidthLoadStart}
        onLoadEnd={onWidthLoadEnd}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        onSizeUpdated={setWidthSize}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        source={{
          html: widthHtml,
          baseUrl:
            Platform.OS === 'android' ? 'file:///android_asset/' : 'web/',
        }}
        customScript={widthScript}
      />
      <Text style={{padding: 5}}>
        height: {widthSize.height}, width: {widthSize.width}
      </Text>
      <TouchableOpacity onPress={changeSource} style={styles.button}>
        <Text>change source</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={changeStyle} style={styles.button}>
        <Text>change style</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={changeScript}
        style={[styles.button, {marginBottom: 100}]}>
        <Text>change script</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
    backgroundColor: 'aliceblue',
    borderRadius: 5,
    padding: 5,
  },
});

export default Explorer;
