// Type definitions for react-native-autoheight-webview 1.x
// Project: https://github.com/iou90/react-native-autoheight-webview
// Definitions by: Naveen Ithappu <https://github.com/naveen-ithappu>
// TypeScript Version: 2.8
import { Component } from "react";
import { WebViewProps } from "react-native-webview";
import {ViewStyle} from "react-native";

export interface Styles{
    href: string;
    type: string;
    rel: string;
}

export interface AutoHeightWebViewProps extends WebViewProps {
    onSizeUpdated: (size:number)=>void;
    baseUrl: string;
    files: Styles[];
    style: ViewStyle;
    customScript: string;
    customStyle: string;
}

export class AutoHeightWebView extends Component<Partial<AutoHeightWebViewProps>> {}
