package com.iou90.autoheightwebview;

import android.webkit.WebView;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.webview.ReactWebViewManager;

import java.util.Map;
import javax.annotation.Nullable;

public class AutoHeightWebViewManager extends ReactWebViewManager {
    private static final String REACT_CLASS = "RCTAutoHeightWebView";

    public static final int COMMAND_SEND_TO_WEBVIEW = 101;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public
    @Nullable
    Map<String, Integer> getCommandsMap() {
        Map<String, Integer> commandsMap = super.getCommandsMap();
        commandsMap.put("sendToWebView", COMMAND_SEND_TO_WEBVIEW);

        return commandsMap;
    }

    @Override
    protected WebView createViewInstance(ThemedReactContext reactContext) {
        WebView webview = super.createViewInstance(reactContext);
        webview.setVerticalScrollBarEnabled(false);
        webview.setHorizontalScrollBarEnabled(false);
        webview.addJavascriptInterface(new JavascriptBridge(webview), "AutoHeightWebView");

        return webview;
    }

    @Override
    public void receiveCommand(WebView webView, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(webView, commandId, args);

        switch (commandId) {
            case COMMAND_SEND_TO_WEBVIEW:
                sendToWebView(webView, args.getString(0));
                break;
            default:
                break;
        }
    }

    private void sendToWebView(WebView webView, String message) {
        String script = "AutoHeightWebView.onMessage('" + message + "');";
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
            webView.evaluateJavascript(script, null);
        } else {
            webView.loadUrl("javascript:" + script);
        }
    }
}