'use strict';

import { Dimensions } from 'react-native';

import Immutable from 'immutable';

function appendFilesToHead(files, script) {
  return files.reduceRight((combinedScript, file) => {
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
}

const screenWidth = Dimensions.get('window').width;

const bodyStyle = `
body {
  margin: 0;
  padding: 0;
}
`;

function appendStylesToHead(styles, script) {
  const currentStyles = styles ? bodyStyle + styles : bodyStyle;
  // Escape any single quotes or newlines in the CSS with .replace()
  const escaped = currentStyles.replace(/\'/g, "\\'").replace(/\n/g, '\\n');
  return `
          var styleElement = document.createElement('style');
          styleElement.innerHTML = '${escaped}';
          document.head.appendChild(styleElement);
          ${script}
        `;
}

function getReloadRelatedData(props) {
  const { hasIframe, files, customStyle, customScript, style, source } = props;
  return {
    source,
    hasIframe,
    files,
    customStyle,
    customScript,
    style
  };
}

function isChanged(newValue, oldValue) {
  return !Immutable.is(Immutable.fromJS(newValue), Immutable.fromJS(oldValue));
}

function getInjectedSource(html, script) {
  return `
    ${html}
    <script>
    ${script}
    </script>
    `;
}

export function getScript(props, getBaseScript, getIframeBaseScript) {
  const { hasIframe, files, customStyle, customScript, style } = getReloadRelatedData(props);
  const baseScript = getBaseScript(style);
  let script = hasIframe && getIframeBaseScript ? getIframeBaseScript(style) : baseScript;
  script = files && files.length > 0 ? appendFilesToHead(files, script) : script;
  script = appendStylesToHead(customStyle, script);
  customScript && (script = customScript + script);
  return script;
}

export function getWidth(style) {
  return style && style.width ? style.width : screenWidth;
}

export function isEqual(newProps, oldProps) {
  return isChanged(getReloadRelatedData(newProps), getReloadRelatedData(oldProps));
}

export function setState(props, baseUrl, getBaseScript, getIframeBaseScript) {
  const { source } = props;
  const script = getScript(props, getBaseScript, getIframeBaseScript);
  let state = {};
  if (source.html) {
    let currentSource = { html: getInjectedSource(source.html, script) };
    baseUrl && Object.assign(currentSource, { baseUrl });
    Object.assign(state, { source: currentSource });
  } else {
    let currentSource = Object.assign({}, source);
    baseUrl && Object.assign(currentSource, { baseUrl });
    Object.assign(state, {
      source: currentSource,
      script
    });
  }
  return state;
}

export function handleSizeUpdated(height, width, onSizeUpdated) {
  onSizeUpdated &&
    onSizeUpdated({
      height,
      width
    });
}

export function isSizeChanged(height, oldHeight, width, oldWidth) {
  return (height && height !== oldHeight) || (width && width !== oldWidth);
}

export const domMutationObserveScript = `
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(updateSize);
observer.observe(document, {
    subtree: true,
    attributes: true
});
`;

export const getCurrentSize = `
function getSize(container) {
  var height = container.offsetHeight || document.body.offsetHeight;
  var width = container.offsetWidth || document.body.offsetWidth;
  return {
    height,
    width
  };
}
`;

export function getRenderSize(enableAnimation, height, width, heightOffset, heightValue, widthValue) {
  return {
    height: enableAnimation ? heightValue : height ? height + heightOffset : 0,
    width: enableAnimation ? widthValue : width
  }
}
