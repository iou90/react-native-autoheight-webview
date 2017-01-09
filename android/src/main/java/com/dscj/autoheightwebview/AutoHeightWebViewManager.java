package com.dscj.autoheightwebview;

import android.webkit.WebView;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.webview.ReactWebViewManager;

/**
 * Created by iou90 on 09/01/2017.
 */

public class AutoHeightWebViewManager extends ReactWebViewManager {
    private static final String REACT_CLASS = "RCTAutoHeightWebView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected WebView createViewInstance(ThemedReactContext reactContext) {
        WebView webview = super.createViewInstance(reactContext);
        webview.setVerticalScrollBarEnabled(false);
        webview.setHorizontalScrollBarEnabled(false);
        return webview;
    }
}
