'use strict';

import { Dimensions } from 'react-native';

function updateSize() {
  if (!window.hasOwnProperty('ReactNativeWebView') || !window.ReactNativeWebView.hasOwnProperty('postMessage')) {
    setTimeout(updateSize, 200);
    return;
  }

  // we use body dimentions because window is stretched to size of WebView
  const height = document.body.offsetHeight;
  const width = document.body.offsetWidth;
  
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ 
      width, height
    })
  );
}

function addResizeObserverWithFallback () {
  const isResizeObserverSupported = 'ResizeObserver' in window;

  if (isResizeObserverSupported) {
    const observer = new ResizeObserver(updateSize);

    observer.observe(document.body);
  } else {
    // if old webview and doesn't support ResizeObserver
    // use old behaviour, there still can be some additional spacing
    // but at least nothing will be cropped
    window.addEventListener('load', updateSize);
    window.addEventListener('resize', updateSize);
  }
}

// add viewport setting to meta for WKWebView
const makeScalePageToFit = zoomable => `
var meta = document.createElement('meta'); 
meta.setAttribute('name', 'viewport'); 
meta.setAttribute('content', 'width=device-width, user-scalable=${
  zoomable ? 'yes' : 'no'
}');
document.getElementsByTagName('head')[0].appendChild(meta);
`;

const getBaseScript = ({zoomable}) => `
  ;
  ${updateSize.toString()}
  ${addResizeObserverWithFallback.toString()}
  addResizeObserverWithFallback();
  updateSize();
  ${makeScalePageToFit(zoomable)}
`;

const appendFilesToHead = ({ files, script }) =>
  files.reduceRight((combinedScript, file) => {
    const { rel, type, href } = file;
    return `
          var link  = document.createElement('link');
          link.rel  = '${rel}';
          link.type = '${type}';
          link.href = '${href}';
          document.head.appendChild(link);
          ${combinedScript}
        `;
  }, script);

const screenWidth = Dimensions.get('window').width;

const bodyStyle = `
body {
  margin: 0;
  padding: 0;
}
`;

const appendStylesToHead = ({ style, script }) => {
  const currentStyles = style ? bodyStyle + style : bodyStyle;
  // Escape any single quotes or newlines in the CSS with .replace()
  const escaped = currentStyles.replace(/\'/g, "\\'").replace(/\n/g, '\\n');
  return `
    var styleElement = document.createElement('style');
    styleElement.innerHTML = '${escaped}';
    document.head.appendChild(styleElement);
    ${script}
  `;
};

// we use IIFE to create local variables scope
const getInjectedSource = ({ html, script }) => `
${html}
<script>
(() => {
${script}
})();
</script>
`;

const getScript = ({ files, customStyle, customScript, style, zoomable }) => {
  let script = getBaseScript({ style, zoomable });
  script = files && files.length > 0 ? appendFilesToHead({ files, script }) : script;
  script = appendStylesToHead({ style: customStyle, script });
  customScript && (script = customScript + script);
  return script;
};

export const getWidth = style => {
  return style && style.width ? style.width : screenWidth;
};

export const isSizeChanged = ({ height, previousHeight, width, previousWidth }) => {
  if (!height || !width) {
    return;
  }
  return height !== previousHeight || width !== previousWidth;
};

export const reduceData = props => {
  const { source } = props;
  const script = getScript(props);
  const { html, baseUrl } = source;
  if (html) {
    return { currentSource: { baseUrl, html: getInjectedSource({ html, script }) } };
  } else {
    return {
      currentSource: source,
      script
    };
  }
};

export const shouldUpdate = ({ prevProps, nextProps }) => {
  if (!(prevProps && nextProps)) {
    return true;
  }
  for (const prop in nextProps) {
    if (nextProps[prop] !== prevProps[prop]) {
      if (typeof nextProps[prop] === 'object' && typeof prevProps[prop] === 'object') {
        if (shouldUpdate({ prevProps: prevProps[prop], nextProps: nextProps[prop] })) {
          return true;
        }
      } else {
        return true;
      }
    }
  }
  return false;
};
