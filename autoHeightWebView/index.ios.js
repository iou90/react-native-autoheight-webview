'use strict'

import React, {
    Component,
    PropTypes
} from 'react';

import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
    Linking,
    WebView
} from 'react-native';
import url from 'url';
import ImmutableComponent from 'react-immutable-component';

export default class AutoHeightWebView extends ImmutableComponent {
    constructor(props) {
        super(props);
        this.handleNavigationStateChange = this.handleNavigationStateChange.bind(this);
        if (this.props.enableAnimation) {
            this.opacityAnimatedValue = new Animated.Value(0);
        }
        const initialScript = props.files ? this.appendFilesToHead(props.files, BaseScript) : BaseScript;
        this.state = {
            height: 0,
            script: initialScript
        };
    }

    componentWillReceiveProps(nextProps) {
        let currentScript = BaseScript;
        if (nextProps.files) {
            currentScript = this.appendFilesToHead(nextProps.files, BaseScript);
        }
        this.setState({ script: currentScript });
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

    onHeightUpdated(height) {
        if (this.props.onHeightUpdated) {
            this.props.onHeightUpdated(height);
        }
    }

    handleNavigationStateChange(navState) {
        const height = Number(navState.title);
        if (height) {
            if (this.props.enableAnimation) {
                this.opacityAnimatedValue.setValue(0);
            }
            this.setState({ height }, () => {
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

    render() {
        const { height, script } = this.state;
        const { enableAnimation, source, heightOffset, customScript, style, onLoad, LoadEnd } = this.props;
        const webViewSource = Object.assign({}, source, { baseUrl: 'web/' });
        return (
            <Animated.View style={[Styles.container, {
                opacity: enableAnimation ? this.opacityAnimatedValue : 1,
                height: height + heightOffset + 5,
            }, style]}>
                <WebView
                    ref={(ref) => this.webview = ref}
                    style={Styles.webView}
                    injectedJavaScript={script + customScript}
                    scrollEnabled={false}
                    source={webViewSource}
                    onNavigationStateChange={this.handleNavigationStateChange}
                    onLoadStart={this.OnLoadWebview.bind(this)}/>
            </Animated.View>
        );
    }

    shouldLoadUrl(urlString) {
        const parsedURL = url.parse(urlString);
        switch (parsedURL.protocol) {
            case 'https:':
            case 'http:':
                return false;
            default:
                return true;
        }
    }

    OnLoadWebview(event) {
        let nativeEvent = { ...event.nativeEvent };
        if (this.shouldLoadUrl(nativeEvent.url))
            return;

        this.webview.stopLoading();
        let openLinkPromise = Linking.canOpenURL(nativeEvent.url).then(supported => {
            if (!supported)
                return Promise.reject({ msg: 'cannot open url' });
            return Linking.openURL(nativeEvent.url);
        }).catch(() => { });
    }
}

AutoHeightWebView.propTypes = {
    source: WebView.propTypes.source,
    onHeightUpdated: PropTypes.func,
    customScript: PropTypes.string,
    enableAnimation: PropTypes.bool,
    // only works on enable animation
    animationDuration: PropTypes.number,
    // offset of rn webview margin
    heightOffset: PropTypes.number,
    style: View.propTypes.style,
    // add web/files... to project root
    files: PropTypes.arrayOf(PropTypes.shape({
        href: PropTypes.string,
        type: PropTypes.string,
        rel: PropTypes.string
    }))
}

AutoHeightWebView.defaultProps = {
    enableAnimation: true,
    animationDuration: 555,
    heightOffset: 12
}

const ScreenWidth = Dimensions.get('window').width;

const Styles = StyleSheet.create({
    container: {
        width: ScreenWidth,
        backgroundColor: 'transparent'
    },
    webView: {
        flex: 1,
        backgroundColor: 'transparent'
    }
});

// note that it can not get height when there are only text objects in a html body which does not make any sense 
const BaseScript =
    `
    ; (function () {
        var i = 0;
        function updateHeight() {
            document.title = document.body.firstChild.clientHeight;
            window.location.hash = ++i;
        }
        updateHeight();
        window.addEventListener('load', updateHeight);
        window.addEventListener('resize', updateHeight);
    } ());
    `;