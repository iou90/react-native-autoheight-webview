'use strict'

import React, {
    Component,
    PropTypes
} from 'react';

import {
    findNodeHandle,
    requireNativeComponent,
    Animated,
    DeviceEventEmitter,
    Dimensions,
    Platform,
    UIManager,
    View,
    WebView
} from 'react-native';

import ImmutableComponent from 'react-immutable-component';

import Immutable from 'immutable';

const RCTAutoHeightWebView = requireNativeComponent('RCTAutoHeightWebView', AutoHeightWebView, { nativeOnly: { messagingEnabled: PropTypes.bool } });

export default class AutoHeightWebView extends ImmutableComponent {
    constructor(props) {
        super(props);
        this.onMessage = this.onMessage.bind(this);
        if (this.props.enableAnimation) {
            this.opacityAnimatedValue = new Animated.Value(0);
        }
        if (IsBelowKitKat) {
            this.listenWebViewBridgeMessage = this.listenWebViewBridgeMessage.bind(this);
        }
        const initialScript = props.files ? this.appendFilesToHead(props.files, BaseScript) : BaseScript;
        this.state = {
            isChangingSource: false,
            height: 0,
            heightOffset: 0,
            script: initialScript
        };
    }

    componentWillMount() {
        if (IsBelowKitKat) {
            DeviceEventEmitter.addListener("webViewBridgeMessage", this.listenWebViewBridgeMessage);
        }
    }

    componentDidMount() {
        this.startInterval();
    }

    componentWillReceiveProps(nextProps) {
        // injectedJavaScript only works when webview reload (source changed)
        if (Immutable.is(Immutable.fromJS(this.props.source), Immutable.fromJS(nextProps.source))) {
            return;
        }
        else {
            this.setState({
                isChangingSource: true,
                height: 0,
                heightOffset: 0
            }, () => {
                this.startInterval();
                this.setState({ isChangingSource: false });
            });
        }
        let currentScript = BaseScript;
        if (nextProps.files) {
            currentScript = this.appendFilesToHead(nextProps.files, BaseScript);
        }
        this.setState({ script: currentScript });
    }

    // componentDidUpdate(prevProps, prevState) {
    //     // redisplay webview when changing source
    //     if (this.state.isChangingSource) {
    //         this.startInterval();
    //         this.setState({ isChangingSource: false });
    //     }
    // }

    componentWillUnmount() {
        this.stopInterval();
        if (IsBelowKitKat) {
            DeviceEventEmitter.removeListener("webViewBridgeMessage", this.listenWebViewBridgeMessage);
        }
    }

    // below kitkat
    listenWebViewBridgeMessage(body) {
        this.onMessage(body.message);
    }

    postMessage(data) {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.webview),
            UIManager.RCTAutoHeightWebView.Commands.postMessage,
            [String(data)]
        );
    };

    // below kitkat
    sendToWebView(message) {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.webview),
            UIManager.RCTAutoHeightWebView.Commands.sendToWebView,
            [String(message)]
        );
    }

    startInterval() {
        this.finishInterval = false;
        this.interval = setInterval(() => {
            if (!this.finishInterval) {
                IsBelowKitKat ? this.sendToWebView('getBodyHeight') : this.postMessage('getBodyHeight');
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
        const height = parseInt(IsBelowKitKat ? e.nativeEvent.message : e.nativeEvent.data);
        if (height) {
            if (this.props.enableAnimation) {
                this.opacityAnimatedValue.setValue(0);
            }
            this.stopInterval();
            this.setState({
                heightOffset: this.props.heightOffset,
                height
            }, () => {
                if (this.props.enableAnimation) {
                    Animated.timing(this.opacityAnimatedValue, {
                        toValue: 1,
                        duration: this.props.animationDuration
                    }).start(() => this.onHeightUpdated(height));
                }
                else {
                    this.onHeightUpdated(height);
                }
            });
        }
    }

    appendFilesToHead(files, script) {
        if (!files) {
            return script;
        }
        for (let file of files) {
            script =
                `
                var link  = document.createElement('link');
                link.rel  = '` + file.rel + `';
                link.type = '` + file.type + `';
                link.href = '` + file.href + `';
                document.head.appendChild(link);
                `+ script;
        }
        return script;
    }

    render() {
        const { height, script, isChangingSource, heightOffset } = this.state;
        const { enableAnimation, source, customScript, style, enableBaseUrl } = this.props;
        let webViewSource = source;
        if (enableBaseUrl) {
            webViewSource = Object.assign({}, source, { baseUrl: 'file:///android_asset/web/' });
        }
        return (
            <Animated.View style={[{
                opacity: enableAnimation ? this.opacityAnimatedValue : 1,
                width: ScreenWidth,
                height: height + heightOffset,
                backgroundColor: 'transparent'
            }, style]}>
                {
                    isChangingSource ? null :
                        <RCTAutoHeightWebView
                            ref={webview => this.webview = webview}
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent'
                            }}
                            javaScriptEnabled={true}
                            injectedJavaScript={script + customScript}
                            scrollEnabled={false}
                            source={webViewSource}
                            onMessage={this.onMessage}
                            messagingEnabled={true}
                            // below kitkat
                            onChange={this.onMessage} />
                }
            </Animated.View>
        );
    }
}

AutoHeightWebView.propTypes = {
    enableAnimation: PropTypes.bool,
    source: WebView.propTypes.source,
    onHeightUpdated: PropTypes.func,
    customScript: PropTypes.string,
    // offset rn webview margin
    heightOffset: PropTypes.number,
    // baseUrl not work in android 4.3 or below version
    enableBaseUrl: PropTypes.bool,
    style: View.propTypes.style,
    // works if set enableBaseUrl to true; add web/files... to android/app/src/assets/
    files: PropTypes.arrayOf(PropTypes.shape({
        href: PropTypes.string,
        type: PropTypes.string,
        rel: PropTypes.string
    }))
}

AutoHeightWebView.defaultProps = {
    animationDuration: 555,
    enableBaseUrl: false,
    heightOffset: 20
}

const ScreenWidth = Dimensions.get('window').width;

const IsBelowKitKat = Platform.Version < 19;

const BaseScript =
    IsBelowKitKat ?
        `
    ; (function () {
        AutoHeightWebView.onMessage = function (message) {
            AutoHeightWebView.send(String(document.body.offsetHeight));
        };
    } ()); 
    ` :
        `
    ; (function () {
        document.addEventListener('message', function (e) {
            window.postMessage(String(document.body.offsetHeight));
        });
    } ()); 
    `;