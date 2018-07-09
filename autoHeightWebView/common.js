'use strict';

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

function appendStylesToHead(styles, script, shouldResizeWidth) {
    var bodyStyle;
    if (shouldResizeWidth) {
        bodyStyle = `
            body {
                display: flex;
                justify-content: center;
                align-items: center;
            }`;
    }
    else {
        bodyStyle = '';
    }
    
    if (!styles) {
        styles = bodyStyle;
    }
    else {
        styles += bodyStyle;
    }
  // Escape any single quotes or newlines in the CSS with .replace()
    const escaped = styles.replace(/\'/g, "\\'").replace(/\n/g, '\\n');
    
  return `
          var styleElement = document.createElement('style');
          var styleText = document.createTextNode('${escaped}');
          styleElement.appendChild(styleText);
          document.head.appendChild(styleElement);
          ${script}
        `;
}

function getScript(props, baseScript, iframeBaseScript) {
    const { hasIframe, files, customStyle, shouldResizeWidth } = props;
  let script = hasIframe ? iframeBaseScript : baseScript;
  script = files ? appendFilesToHead(files, baseScript) : baseScript;
    script = appendStylesToHead(customStyle, script, shouldResizeWidth);
  return script;
}

function onHeightUpdated(height, props) {
  props.onHeightUpdated && props.onHeightUpdated(height);
}

function onWidthUpdated(width, props) {
    props.onWidthUpdated && props.onWidthUpdated(width);
}

function onHeightWidthUpdated(height, width, props) {
    onHeightUpdated(height, props);
    onWidthUpdated(width, props);
    props.onHeightWidthUpdated && props.onHeightWidthUpdated(height, width);
}

const domMutationObserveScript = 
`
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(updateHeight);
observer.observe(document, {
    subtree: true,
    attributes: true
});
`;

export { getScript, onHeightUpdated, onWidthUpdated, onHeightWidthUpdated, domMutationObserveScript };
