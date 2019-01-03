'use strict';

import { Platform } from 'react-native';

import AutoHeightWebViewOld from './index.android.old.js';

import AutoHeightWebView from './index.android.current.js';

const isBelowMarshmallow = Platform.Version < 23;

const webview = isBelowMarshmallow ? AutoHeightWebViewOld : AutoHeightWebView;

export default webview;