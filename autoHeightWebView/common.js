'use strict';

import { Dimensions } from 'react-native';

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
  const currentStyles = bodyStyle + styles;
  // Escape any single quotes or newlines in the CSS with .replace()
  const escaped = currentStyles.replace(/\'/g, "\\'").replace(/\n/g, '\\n');
  return `
          var styleElement = document.createElement('style');
          var styleText = document.createTextNode('${escaped}');
          styleElement.appendChild(styleText);
          document.head.appendChild(styleElement);
          ${script}
        `;
}

function getScript(props, getBaseScript, getIframeBaseScript) {
  const { hasIframe, files, customStyle } = props;
  const baseScript = getBaseScript(props.style);
  let script = hasIframe ? baseScript : getIframeBaseScript(props.style);
  script = files ? appendFilesToHead(files, baseScript) : baseScript;
  script = appendStylesToHead(customStyle, script);
  return script;
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

export { getWidth, getScript, handleSizeUpdated, domMutationObserveScript };
