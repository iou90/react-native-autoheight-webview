// Type definitions for react-native-autoheight-webview 1.x
// Project: https://github.com/iou90/react-native-autoheight-webview
// Definitions by: Naveen Ithappu <https://github.com/naveen-ithappu>
// TypeScript Version: 2.8
import { Component } from 'react';

import { WebViewProps } from 'react-native-webview';

import { StyleProp, ViewStyle } from 'react-native';

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
  onSizeUpdated: (size: SizeUpdate) => void;
  files: StylesFile[];
  style: StyleProp<ViewStyle>;
  customScript: string;
  customStyle: string;
  viewportContent: string;
  scalesPageToFit: boolean;
  scrollEnabledWithZoomedin: boolean;
}

export default class AutoHeightWebView extends Component<Partial<AutoHeightWebViewProps>> {
  /**
   * Go back one page in the webview's history.
   */
  goBack(): void;

  /**
   * Go forward one page in the webview's history.
   */
  goForward(): void;

  /**
   * Reloads the current page.
   */
  reload(): void;

  /**
   * Stop loading the current page.
   */
  stopLoading(): void;

  /**
   * Extra Native Component Config.
   */
  extraNativeComponentConfig(): any;

  /**
   * Executes the JavaScript string.
   */
  injectJavaScript(script: string): void;

  /**
   * Focuses on WebView redered page.
   */
  requestFocus(): void;
}
