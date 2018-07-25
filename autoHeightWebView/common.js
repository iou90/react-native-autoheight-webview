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

function insertStringAfterAnotherString(raw, searchValue, insertValue) {
  const position = raw.indexOf(searchValue) + searchValue.length;
  return [raw.slice(0, position), insertValue, raw.slice(position)].join('');
}

function getInjectedSource(html, script) {
  const scriptString = `
  <script>
  ${script}
  </script>
  `;
  if (html.startsWith('<html')) {
    return insertStringAfterAnotherString(html, '>', scriptString);
  } else {
    return `
    ${html}
    ${scriptString}
    `;
  }
}

export function getScript(props, getBaseScript, getIframeBaseScript) {
  const { hasIframe, files, customStyle, customScript, style } = getReloadRelatedData(props);
  const baseScript = getBaseScript(style);
  let script = hasIframe ? getIframeBaseScript(style) : baseScript;
  script = files ? appendFilesToHead(files, baseScript) : baseScript;
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

export function setState(props, getBaseScript, getIframeBaseScript) {
  const { source, style } = props;
  const script = getScript(props, getBaseScript, getIframeBaseScript);
  let state = {
    height: style && style.height ? style.height : 0,
    width: getWidth(style)
  };
  if (source.html) {
    Object.assign(state, {
      source: Object.assign(
        {},
        {
          html: getInjectedSource(source.html, script),
          baseUrl: 'web/'
        }
      )
    });
  } else {
    Object.assign(state, {
      source: Object.assign({}, source, { baseUrl: 'web/' }),
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

export function getSize(newHeight, newWidth, height, width, updatingSize, calledOnce) {
  if (!calledOnce || updatingSize) {
    return {
      h: height,
      w: width
    };
  }
  return {
    h: height,
    w: width
  };
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
  var height = container.clientHeight || document.body.offsetHeight;
  var width = container.clientWidth || document.body.offsetWidth;
  return {
    height,
    width
  };
}
`;

