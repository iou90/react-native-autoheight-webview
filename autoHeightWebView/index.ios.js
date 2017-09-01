'use strict'

import React, { PureComponent } from 'react';

import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
    ViewPropTypes,
    WebView
} from 'react-native';

import PropTypes from 'prop-types';

export default class AutoHeightWebView extends PureComponent {
    static propTypes = {
        source: WebView.propTypes.source,
        onHeightUpdated: PropTypes.func,
        customScript: PropTypes.string,
        enableAnimation: PropTypes.bool,
        // if set to true may cause some layout issues (smaller font size)
        scalesPageToFit: PropTypes.bool,
        // only works on enable animation
        animationDuration: PropTypes.number,
        // offset of rn webview margin
        heightOffset: PropTypes.number,
        style: ViewPropTypes.style,
        // add web/files... to project root
        files: PropTypes.arrayOf(PropTypes.shape({
            href: PropTypes.string,
            type: PropTypes.string,
            rel: PropTypes.string
        }))
    }

    static defaultProps = {
        scalesPageToFit: false,
        enableAnimation: true,
        animationDuration: 555,
        heightOffset: 12
    }

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
        const { scalesPageToFit, enableAnimation, source, heightOffset, customScript, style } = this.props;
        const webViewSource = Object.assign({}, source, { baseUrl: 'web/' });
        return (
            <Animated.View style={[Styles.container, {
                opacity: enableAnimation ? this.opacityAnimatedValue : 1,
                height: height + heightOffset,
            }, style]}>
                <WebView
                    style={Styles.webView}
                    injectedJavaScript={script + customScript}
                    scrollEnabled={false}
                    scalesPageToFit={scalesPageToFit}
                    source={webViewSource}
                    onNavigationStateChange={this.handleNavigationStateChange} />
            </Animated.View>
        );
    }
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
            document.title = document.body.offsetHeight;
            window.location.hash = ++i;
        }
        updateHeight();
        window.addEventListener('load', updateHeight);
        window.addEventListener('resize', updateHeight);
    } ());
    `;