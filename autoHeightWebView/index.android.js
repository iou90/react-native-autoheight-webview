'use strict'

import React, {
    Component,
    PropTypes
} from 'react';

import {
    findNodeHandle,
    requireNativeComponent,
    Dimensions,
    UIManager,
    View,
    WebView
} from 'react-native';

const RCTAutoHeightWebView = requireNativeComponent('RCTAutoHeightWebView', AutoHeightWebView, { nativeOnly: { messagingEnabled: PropTypes.bool } });

export default class AutoHeightWebView extends Component {
    constructor(props) {
        super(props);
        this.onMessage = this.onMessage.bind(this);
        this.onLoadingStart = this.onLoadingStart.bind(this);
        const initialScript = props.files ? this.appendFilesToHead(props.files, BaseScript) : BaseScript;
        this.state = {
            isOnLoadingStart: false,
            height: 0,
            heightOffset: 0,
            script: initialScript
        };
    }

    componentDidMount() {
        this.intervalPostMessage();
    }

    componentWillReceiveProps(nextProps) {
        // injectedJavaScript only works when webview reload (html changed)
        if (nextProps.html === this.props.html) {
            this.htmlHasChanged = false;
            return;
        }
        else {
            this.htmlHasChanged = true;
            this.setState({
                height: 0,
                heightOffset: 0
            });
        }
        let currentScript = BaseScript;
        if ((nextProps.files && !this.props.files) || (nextProps.files && this.props.files && JSON.stringify(nextProps.files) !== JSON.stringify(this.props.files))) {
            currentScript = this.appendFilesToHead(nextProps.files, BaseScript);
        }
        this.setState({ script: currentScript });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.htmlHasChanged) {
            if (this.state.isOnLoadingStart && this.state.height === 0 && this.state.heightOffset === 0) {
                this.intervalPostMessage();
                this.htmlHasChanged = false;
                this.setState({ isOnLoadingStart: false });
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onLoadingStart() {
        if (this.htmlHasChanged) {
            this.setState({ isOnLoadingStart: true });
        }
    }

    postMessage(data) {
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.webview),
            UIManager.RCTWebView.Commands.postMessage,
            [String(data)]
        );
    };

    intervalPostMessage() {
        this.interval = setInterval(() => {
            this.postMessage('getBodyHeight');
        }, 205);
    }

    onMessage(e) {
        const height = parseInt(e.nativeEvent.data);
        console.log(height);
        if (height) {
            clearInterval(this.interval);
            this.setState({
                heightOffset: this.props.heightOffset,
                height
            });
            if (this.props.onHeightUpdated) {
                this.props.onHeightUpdated(height);
            }
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
        const source = this.props.enableBaseUrl ? {
            html: this.props.html,
            baseUrl: 'file:///android_asset/web/'
        } : { html: this.props.html };
        return (
            <View style={[{
                width: ScreenWidth,
                height: this.state.height + this.state.heightOffset
            }, this.props.style]}>
                <RCTAutoHeightWebView
                    ref={webview => this.webview = webview}
                    style={{ flex: 1 }}
                    javaScriptEnabled={true}
                    injectedJavaScript={this.state.script + this.props.customScript}
                    onLoadingStart={this.onLoadingStart}
                    scrollEnabled={false}
                    source={source}
                    onMessage={this.onMessage}
                    messagingEnabled={true} />
            </View>
        );
    }
}

AutoHeightWebView.propTypes = {
    ...WebView.propTypes,
    html: PropTypes.string,
    onHeightUpdated: PropTypes.func,
    customScript: PropTypes.string,
    // offset rn webview margin
    heightOffset: PropTypes.number,
    // baseUrl not work in android 4.3 or below version
    enableBaseUrl: PropTypes.bool,
    // works if set enableBaseUrl to true; add web/files... to android/app/src/assets/
    files: PropTypes.arrayOf(PropTypes.shape({
        href: PropTypes.string,
        type: PropTypes.string,
        rel: PropTypes.string
    }))
}

AutoHeightWebView.defaultProps = {
    enableBaseUrl: false,
    heightOffset: 20
}

const ScreenWidth = Dimensions.get('window').width;

const BaseScript =
    `
    ; (function () {
        document.addEventListener('message', function (e) {
            window.postMessage(String(document.body.offsetHeight));
        });
    } ()); 
    `;