// Type definitions for react-native-autoheight-webview 1.x
// Project: https://github.com/iou90/react-native-autoheight-webview
// Definitions by: Naveen Ithappu <https://github.com/naveen-ithappu>
// TypeScript Version: ^4.0.5

import WebView, {WebViewProps} from 'react-native-webview';

import {StyleProp, ViewStyle} from 'react-native';

export interface StylesFile {
  href: string;
  type: string;
  rel: string;
}

export interface SizeUpdate {
  width: number;
  height: number;
}

export interface AutoHeightWebViewProps extends WebViewProps {
  onSizeUpdated?: (size: SizeUpdate) => void;
  files?: StylesFile[];
  style?: StyleProp<ViewStyle>;
  customScript?: string;
  customStyle?: string;
  viewportContent?: string;
  scalesPageToFit?: boolean;
  scrollEnabledWithZoomedin?: boolean;
}

export default class AutoHeightWebView extends WebView<
  AutoHeightWebViewProps
> {}
