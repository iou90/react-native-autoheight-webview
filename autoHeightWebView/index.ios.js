

import React, { PureComponent } from 'react';

import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
    ViewPropTypes,
    WebView,
    Linking,
} from 'react-native';

import PropTypes from 'prop-types';

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
    files: PropTypes.arrayOf(PropTypes.shape({
      href: PropTypes.string,
      type: PropTypes.string,
      rel: PropTypes.string,
    })),
  }

  static defaultProps = {
    scalesPageToFit: false,
    enableAnimation: true,
    animationDuration: 555,
    heightOffset: 25,
  }

  constructor(props) {
    super(props);
    this.handleNavigationStateChange = this.handleNavigationStateChange.bind(this);
    if (this.props.enableAnimation) {
      this.opacityAnimatedValue = new Animated.Value(0);
    }
    let initialScript = props.hasIframe ? IframeBaseScript : BaseScript;
    initialScript = props.files
            ? this.appendFilesToHead(props.files, BaseScript)
            : BaseScript;
    initialScript = props.customStyle
            ? this.appendStylesToHead(props.customStyle, initialScript)
            : initialScript;
    this.state = {
      height: 0,
      script: initialScript,
    };
  }

  componentWillReceiveProps(nextProps) {
    let currentScript = nextProps.hasIframe ? IframeBaseScript : BaseScript;
    if (nextProps.files) {
      currentScript = this.appendFilesToHead(nextProps.files, currentScript);
    }
    currentScript = nextProps.customStyle
            ? this.appendStylesToHead(nextProps.customStyle, currentScript)
            : currentScript;
    this.setState({ script: currentScript });
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
    const escaped = styles.replace(/\'/g, "\\'").replace(/\n/g, '\\n');
    return `
        var styleElement = document.createElement('style');
        var styleText = document.createTextNode('${escaped}');
        styleElement.appendChild(styleText);
        document.head.appendChild(styleElement);
        ${script}
      `;
  }

  onHeightUpdated(height) {
    if (this.props.onHeightUpdated) {
      this.props.onHeightUpdated(height);
    }
  }

  handleNavigationStateChange(navState) {
    const height = Number(navState.title);
    if (height && height !== this.state.height) {
      if (this.props.enableAnimation) {
        this.opacityAnimatedValue.setValue(0);
       
      }
      this.setState({ height }, () => {
        if (this.props.enableAnimation) {
          Animated.timing(this.opacityAnimatedValue, {
              toValue: 1,
              duration: this.props.animationDuration,
            }).start(() => this.onHeightUpdated(height));
        } else {
          this.onHeightUpdated(height);
        }
      });
    }
    Linking.canOpenURL(navState.url).then((supported) => {
        if (supported) {
            this.webview.stopLoading();
          Linking.openURL(navState.url);
        }
        return false;
      });
  }

  render() {
    const { height, script } = this.state;
    const { onError, onLoad, onLoadStart, onLoadEnd, onShouldStartLoadWithRequest, scalesPageToFit, enableAnimation, source, heightOffset, customScript, style, dataDetectorTypes } = this.props;
    const webViewSource = Object.assign({}, source);
    return (
      <Animated.View style={[Styles.container, {
        opacity: enableAnimation ? this.opacityAnimatedValue : 1,
        height: height + heightOffset,
      }, style]}
      >
        <WebView
          ref={(ref) => { this.webview = ref; }}
          onError={onError}
          onLoad={onLoad}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          style={Styles.webView}
          injectedJavaScript={script + customScript}
          scrollEnabled
          scalesPageToFit={scalesPageToFit}
          source={webViewSource}
          bounces={false}
          onNavigationStateChange={this.handleNavigationStateChange}
          dataDetectorTypes={dataDetectorTypes || 'all'}
        />
      </Animated.View>
    );
  }
}

const ScreenWidth = Dimensions.get('window').width;

const Styles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    backgroundColor: 'transparent',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

const BaseScript =
    `
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
        updateHeight();
        window.addEventListener('load', updateHeight);
        window.addEventListener('resize', updateHeight);
    } ());
    `;

const IframeBaseScript =
    `
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
        updateHeight();
        window.addEventListener('load', updateHeight);
        window.addEventListener('resize', updateHeight);
    } ());
    `;
