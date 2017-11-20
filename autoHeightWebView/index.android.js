"use strict";

import React, { PureComponent } from "react";

import {
  findNodeHandle,
  requireNativeComponent,
  Animated,
  DeviceEventEmitter,
  Dimensions,
  StyleSheet,
  Platform,
  UIManager,
  View,
  ViewPropTypes,
  WebView
} from "react-native";

import PropTypes from "prop-types";

import Immutable from "immutable";

const RCTAutoHeightWebView = requireNativeComponent(
  "RCTAutoHeightWebView",
  AutoHeightWebView,
  { nativeOnly:
    {
      nativeOnly: {
        onLoadingStart: true,
        onLoadingError: true,
        onLoadingFinish: true,
        messagingEnabled: PropTypes.bool
      }
    }
   }
);

export default class AutoHeightWebView extends PureComponent {
  static propTypes = {
    source: WebView.propTypes.source,
    onHeightUpdated: PropTypes.func,
    customScript: PropTypes.string,
    customStyle: PropTypes.string,
    enableAnimation: PropTypes.bool,
    // if set to false may cause some layout issues (width of container will be than width of screen)
    scalesPageToFit: PropTypes.bool,
    // only works on enable animation
    animationDuration: PropTypes.number,
    // offset of rn webview margin
    heightOffset: PropTypes.number,
    // baseUrl not work in android 4.3 or below version
    enableBaseUrl: PropTypes.bool,
    style: ViewPropTypes.style,
    //  rn WebView callback
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    onLoadStart: PropTypes.func,
    onLoadEnd: PropTypes.func,
    onMessage: PropTypes.func,
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
    heightOffset: 20
  };

  constructor(props) {
    super(props);
    this.onMessage = this.onMessage.bind(this);
    if (this.props.enableAnimation) {
      this.opacityAnimatedValue = new Animated.Value(0);
    }
    if (IsBelowKitKat) {
      this.listenWebViewBridgeMessage = this.listenWebViewBridgeMessage.bind(
        this
      );
    }
    let initialScript = props.files
      ? this.appendFilesToHead(props.files, BaseScript)
      : BaseScript;
    initialScript = props.customStyle
      ? this.appendStylesToHead(props.customStyle, initialScript)
      : initialScript;
    this.state = {
      isChangingSource: false,
      height: 0,
      heightOffset: 0,
      script: initialScript
    };
  }

  componentWillMount() {
    if (IsBelowKitKat) {
      DeviceEventEmitter.addListener(
        "webViewBridgeMessage",
        this.listenWebViewBridgeMessage
      );
    }
  }

  componentDidMount() {
    this.startInterval();
  }

  componentWillReceiveProps(nextProps) {
    // injectedJavaScript only works when webview reload (source changed)
    if (
      Immutable.is(
        Immutable.fromJS(this.props.source),
        Immutable.fromJS(nextProps.source)
      )
    ) {
      return;
    } else {
      this.setState(
        {
          isChangingSource: true,
          height: 0,
          heightOffset: 0
        },
        () => {
          this.startInterval();
          this.setState({ isChangingSource: false });
        }
      );
    }
    let currentScript = BaseScript;
    if (nextProps.files) {
      currentScript = this.appendFilesToHead(nextProps.files, BaseScript);
    }
    currentScript = nextProps.customStyle
      ? this.appendStylesToHead(nextProps.customStyle, currentScript)
      : currentScript;
    this.setState({ script: currentScript });
  }

  componentWillUnmount() {
    this.stopInterval();
    if (IsBelowKitKat) {
      DeviceEventEmitter.removeListener(
        "webViewBridgeMessage",
        this.listenWebViewBridgeMessage
      );
    }
  }

  // below kitkat
  listenWebViewBridgeMessage(body) {
    this.onMessage(body.message);
  }

  // below kitkat
  sendToWebView(message) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.webview),
      UIManager.RCTAutoHeightWebView.Commands.sendToWebView,
      [String(message)]
    );
  }

  postMessage(data) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.webview),
      UIManager.RCTAutoHeightWebView.Commands.postMessage,
      [String(data)]
    );
  }

  startInterval() {
    this.finishInterval = false;
    this.interval = setInterval(() => {
      if (!this.finishInterval) {
        IsBelowKitKat
          ? this.sendToWebView("getBodyHeight")
          : this.postMessage("getBodyHeight");
      }
    }, 205);
  }

  stopInterval() {
    this.finishInterval = true;
    clearInterval(this.interval);
  }

  onHeightUpdated(height) {
    if (this.props.onHeightUpdated) {
      this.props.onHeightUpdated(height);
    }
  }

  onMessage(e) {
    const height = parseInt(
      IsBelowKitKat ? e.nativeEvent.message : e.nativeEvent.data
    );
    if (this.props.onMessage) {
      this.props.onMessage(e);
    }
    if (height) {
      if (this.props.enableAnimation) {
        this.opacityAnimatedValue.setValue(0);
      }
      this.stopInterval();
      this.setState(
        {
          heightOffset: this.props.heightOffset,
          height
        },
        () => {
          if (this.props.enableAnimation) {
            Animated.timing(this.opacityAnimatedValue, {
              toValue: 1,
              duration: this.props.animationDuration
            }).start(() => this.onHeightUpdated(height));
          } else {
            this.onHeightUpdated(height);
          }
        }
      );
    }
  }

  appendFilesToHead(files, script) {
    if (!files) {
      return script;
    }
    return files.reduceRight((file, combinedScript) => `
      var link  = document.createElement('link');
      link.rel  = '${file.rel}';
      link.type = '${file.type}';
      link.href = '${file.href}';
      document.head.appendChild(link);
      ${combinedScript}
    `, script);
  }

  appendStylesToHead(styles, script) {
    if (!styles) {
      return script;
    }
    // Escape any single quotes or newlines in the CSS with .replace()
    const escaped = styles.replace(/\'/g, "\\'").replace(/\n/g, '\\n')
    return `
      var styleElement = document.createElement('style');
      var styleText = document.createTextNode('${escaped}');
      styleElement.appendChild(styleText);
      document.head.appendChild(styleElement);
      ${script}
    `;
  }

  onLoadingStart = (event) => {
    var onLoadStart = this.props.onLoadStart;
    onLoadStart && onLoadStart(event);
  };

  onLoadingError = (event) => {
    var {onError, onLoadEnd} = this.props;
    onError && onError(event);
    onLoadEnd && onLoadEnd(event);
    console.warn('Encountered an error loading page', event.nativeEvent);
  };

  onLoadingFinish = (event) => {
    var {onLoad, onLoadEnd} = this.props;
    onLoad && onLoad(event);
    onLoadEnd && onLoadEnd(event);
  };

  render() {
    const { height, script, isChangingSource, heightOffset } = this.state;
    const {
      scalesPageToFit,
      enableAnimation,
      source,
      customScript,
      style,
      enableBaseUrl
    } = this.props;
    let webViewSource = source;
    if (enableBaseUrl) {
      webViewSource = Object.assign({}, source, {
        baseUrl: "file:///android_asset/web/"
      });
    }
    return (
      <Animated.View
        style={[
          Styles.container,
          {
            opacity: enableAnimation ? this.opacityAnimatedValue : 1,
            height: height + heightOffset
          },
          style
        ]}
      >
        {isChangingSource ? null : (
          <RCTAutoHeightWebView
            onLoadingStart={this.onLoadingStart}
            onLoadingFinish={this.onLoadingFinish}
            onLoadingError={this.onLoadingError}
            ref={webview => (this.webview = webview)}
            style={Styles.webView}
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

const ScreenWidth = Dimensions.get("window").width;

const IsBelowKitKat = Platform.Version < 19;

const Styles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    backgroundColor: "transparent"
  },
  webView: {
    flex: 1,
    backgroundColor: "transparent"
  }
});

const BaseScript = IsBelowKitKat
  ? `
    ; (function () {
        AutoHeightWebView.onMessage = function (message) {
            AutoHeightWebView.send(String(document.body.offsetHeight));
        };
    } ());
    `
  : `
    ; (function () {
        document.addEventListener('message', function (e) {
            window.postMessage(String(document.body.offsetHeight));
        });
    } ());
    `;
