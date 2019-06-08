'use strict';

import { Dimensions, Platform } from 'react-native';

const domMutationObserveScript = `
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(updateSize);
observer.observe(document, {
    subtree: true,
    attributes: true
});
`;

const updateSizeWithMessage = element =>
  `
  var updateSizeInterval = null;
  var height = 0;
  function updateSize(event) {
    if (!window.hasOwnProperty('ReactNativeWebView') || !window.ReactNativeWebView.hasOwnProperty('postMessage')) {
      !updateSizeInterval && (updateSizeInterval = setInterval(updateSize, 200));
      return;
    }
    clearInterval(updateSizeInterval)
    height = ${element}.offsetHeight || window.innerHeight;
    width = ${element}.offsetWidth || window.innerWidth;
    window.ReactNativeWebView.postMessage(JSON.stringify({ width: width, height: height, event: event }));
  }
  `;

// add viewport setting to meta for WKWebView
const makeScalePageToFit = zoomable => `
var meta = document.createElement('meta'); 
meta.setAttribute('name', 'viewport'); 
meta.setAttribute('content', 'width=device-width, user-scalable=${zoomable ? 'yes' : 'no'}'); document.getElementsByTagName('head')[0].appendChild(meta);
`;

const getBaseScript = props =>
  `
  ;
  if (!document.getElementById("rnahw-wrapper")) {
    var wrapper = document.createElement('div');
    wrapper.id = 'rnahw-wrapper';
    while (document.body.firstChild instanceof Node) {
      wrapper.appendChild(document.body.firstChild);
    }
    document.body.appendChild(wrapper);
  }
  var width = ${getWidth(props.style)};
  ${updateSizeWithMessage('wrapper')}
  window.addEventListener('load', updateSize);
  window.addEventListener('resize', updateSize);
  ${domMutationObserveScript}
  ${Platform.OS === 'ios' ? makeScalePageToFit(props.zoomable) : ''}
  updateSize();
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

const getInjectedSource = ({ html, script }) => `
${html}
<script>
${script}
</script>
`;

const getScript = props => {
  const { files, customStyle, customScript } = props;
  let script = getBaseScript(props);
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
}

export const getMemoInputProps = props => {
  const { files, customStyle, customScript, style, source, baseUrl } = props;
  return [files, customStyle, customScript, style, source, baseUrl];
};

export const getMemoResult = props => {
  const { source, baseUrl } = props;
  const script = getScript(props);
  if (source.html) {
    let currentSource = { html: getInjectedSource({ html: source.html, script }) };
    baseUrl && Object.assign(currentSource, { baseUrl });
    return { source: currentSource };
  } else {
    let currentSource = Object.assign({}, source);
    baseUrl && Object.assign(currentSource, { baseUrl });
    return {
      source: currentSource,
      script
    };
  }
};
