'use strict';

const autoHeightHtml0 = `<p style="font-weight: 400;font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. <span style="background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));">If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn't only tag the piece with "moving". I’d also use the tags "pets", "marriage", "career change", and "travel tips".</span></p>`;

const autoHeightHtml1 = `Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with "moving".`;

const style0 = `
    p {
        padding: 50px;
        box-sizing: border-box;
    }
`;

const style1 = `
    p {
        font-size: 12px !important;
        box-sizing: border-box;
    }
`;

const inlineBodyStyle = `
    body {
        display: inline-block;
    }
`;

const autoHeightScript = `
var styleElement = document.createElement('style');
styleElement.innerHTML = '${style1
  .replace(/\'/g, "\\'")
  .replace(/\n/g, '\\n')}';
document.head.appendChild(styleElement);
document.body.style.background = 'cornflowerblue';
`;

const autoWidthHtml0 = `
<html>
<head>
  <meta name="viewport" content="target-densitydpi=device-dpi, initial-scale=1.0, user-scalable=no" />
</head>
<p class="localStyle" style="display: inline;background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));font-style: normal;zoom:1;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">hey</p>
</html>
`;

const autoWidthHtml1 = `
<p style="display: inline;background-color: transparent !important;">easy</p>
`;

const autoWidthScript = `
var styleElement = document.createElement('style');
styleElement.innerHTML = '${style1
  .replace(/\'/g, "\\'")
  .replace(/\n/g, '\\n')}';
document.head.appendChild(styleElement);
`;

const autoDetectLinkHtml = `
  <p style="font-weight: 400;font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">
      <a href="https://github.com/iou90/react-native-autoheight-webview">Tags</a> are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing.
      <span style="background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));">If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn't only tag the piece with "moving". I’d also use the <a href="http://x-squad.com">tags</a> "pets", "marriage", "career change", and "travel tips".</span>
  </p>
`;

//https://medium.com/@elhardoum/opening-external-links-in-browser-in-react-native-webview-18fe6a66312a
const autoDetectLinkScript = `
!function(){
  function isUrl(str){
    return str.startsWith('http');
  }
  var e=function(e,n,t){if(n=n.replace(/^on/g,""),"addEventListener"in window)e.addEventListener(n,t,!1);else if("attachEvent"in window)e.attachEvent("on"+n,t);else{var o=e["on"+n];e["on"+n]=o?function(e){o(e),t(e)}:t}return e},n=document.querySelectorAll("a[href]");if(n)for(var t in n)n.hasOwnProperty(t)&&e(n[t],"onclick",function(e){!isUrl(this.href)||(e.preventDefault(),window.postMessage(JSON.stringify({url:this.href})))})
}();
`;

export {
  autoHeightHtml0,
  autoHeightHtml1,
  style0,
  autoHeightScript,
  autoWidthHtml0,
  autoWidthHtml1,
  autoWidthScript,
  inlineBodyStyle,
  autoDetectLinkHtml,
  autoDetectLinkScript
};
