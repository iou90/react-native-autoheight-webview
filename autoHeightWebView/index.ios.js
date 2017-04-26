'use strict'

import React, {
    Component,
    PropTypes
} from 'react';

import {
    Animated,
    Dimensions,
    View,
    WebView
} from 'react-native';

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
        const { enableAnimation, source, heightOffset, customScript, style } = this.props;
        const webViewSource = Object.assign({}, source, { baseUrl: 'web/' });
        return (
            <Animated.View style={[{
                opacity: enableAnimation ? this.opacityAnimatedValue : 1,
                width: ScreenWidth,
                height: height + heightOffset,
                backgroundColor: 'transparent'
            }, style]}>
                <WebView
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent'
                    }}
                    injectedJavaScript={script + customScript}
                    scrollEnabled={false}
                    source={webViewSource}
                    onNavigationStateChange={this.handleNavigationStateChange} />
            </Animated.View>
        );
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

const BaseScript =
    `
    ; (function () {
        var wrapper = document.createElement('div');
        wrapper.id = 'height-wrapper';
        while (document.body.firstChild) {
            wrapper.appendChild(document.body.firstChild);
        }
        document.body.appendChild(wrapper);
        var i = 0;
        function updateHeight() {
            document.title = wrapper.clientHeight;
            window.location.hash = ++i;
        }
        updateHeight();
        window.addEventListener('load', updateHeight);
        window.addEventListener('resize', updateHeight);
    } ());
    `;