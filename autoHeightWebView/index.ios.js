'use strict'

import React, {
    Component,
    PropTypes
} from 'react';

import {
    Dimensions,
    View,
    WebView
} from 'react-native';

export default class AutoHeightWebView extends Component {
    constructor(props) {
        super(props);
        this.handleNavigationStateChange = this.handleNavigationStateChange.bind(this);
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

    handleNavigationStateChange(navState) {
        const height = Number(navState.title);
        if (height) {
            this.setState({ height });
            if (this.props.onHeightUpdated) {
                this.props.onHeightUpdated(height);
            }
        }
    }

    render() {
        return (
            <View style={[{
                width: ScreenWidth,
                height: this.state.height + this.props.heightOffset,
            }, this.props.style]}>
                <WebView
                    style={{ flex: 1 }}
                    injectedJavaScript={this.state.script + this.props.customScript}
                    scrollEnabled={false}
                    source={{
                        html: this.props.html,
                        baseUrl: 'web/'
                    }}
                    onNavigationStateChange={this.handleNavigationStateChange} />
            </View>
        );
    }
}

AutoHeightWebView.propTypes = {
    html: PropTypes.string,
    onHeightUpdated: PropTypes.func,
    customScript: PropTypes.string,
    // offset rn webview margin
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
        window.addEventListener('load', function () {
            updateHeight();
        });
        window.addEventListener('resize', updateHeight);
    } ());
    `;