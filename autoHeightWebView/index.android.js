'use strict'

import React, {
    Component,
    PropTypes
} from 'react';

import {
    requireNativeComponent,
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
        if ((nextProps.files && !this.props.files) || (nextProps.files && this.props.files && JSON.stringify(nextProps.files) !== JSON.stringify(this.props.files))) {
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
        this.setState({ height });
        if (this.props.onHeightUpdated) {
            this.props.onHeightUpdated(height);
        }
    }

    render() {
        const source = this.props.enableBaseUrl ? {
            html: this.props.html,
            baseUrl: 'file:///android_asset/web/'
        } : { html: this.props.html };
        return (
            <View style={[{
                height: this.state.height + this.props.heightOffset
            }, this.props.style]}>
                <RCTAutoHeightWebView
                    injectedJavaScript={this.state.script + this.props.customScript}
                    scrollEnabled={false}
                    source={source}
                    onNavigationStateChange={this.handleNavigationStateChange} />
            </View>
        );
    }
}

AutoHeightWebView.propTypes = {
    ...View.propTypes,
    html: PropTypes.string,
    onHeightUpdated: PropTypes.func,
    customScript: PropTypes.string,
    // offset rn webview margin
    heightOffset: PropTypes.number,
    // baseUrl not work in android 4.3 or below version
    enableBaseUrl: PropTypes.bool,
    // add web/files... to android/app/src/assets/
    files: PropTypes.arrayOf(PropTypes.shape({
        href: PropTypes.string,
        type: PropTypes.string,
        rel: PropTypes.string
    }))
}

const RCTAutoHeightWebView = requireNativeComponent('RCTAutoHeightWebView', AutoHeightWebView);

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