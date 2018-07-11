'use strict';

import { Dimensions } from 'react-native';

import Immutable from 'immutable';

function appendFilesToHead(files, script) {
  if (!files) {
    return script;
  }
  return files.reduceRight((file, combinedScript) => {
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

function getWidth(style) {
  return style && style.width ? style.width : screenWidth;
}

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
  const { hasIframe, files, customStyle, customScript, style } = props;
  return {
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

function getScript(props, getBaseScript, getIframeBaseScript) {
  const { hasIframe, files, customStyle, customScript, style } = props;
  const baseScript = getBaseScript(style);
  let script = hasIframe ? baseScript : getIframeBaseScript(style);
  script = files ? appendFilesToHead(files, baseScript) : baseScript;
  script = appendStylesToHead(customStyle, script);
  customScript && (script = customScript + script);
  return script;
}

function needChangeSource(nextProps, props) {
 return nextProps && props && isChanged(getReloadRelatedData(nextProps), getReloadRelatedData(props));
}

function handleSizeUpdated(height, width, onSizeUpdated) {
  onSizeUpdated &&
    onSizeUpdated({
      height,
      width
    });
}

const domMutationObserveScript = `
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(updateSize);
observer.observe(document, {
    subtree: true,
    attributes: true
});
`;

export { needChangeSource, getWidth, getScript, handleSizeUpdated, domMutationObserveScript };
