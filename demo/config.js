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
styleElement.innerHTML = '${style1.replace(/\'/g, "\\'").replace(/\n/g, '\\n')}';
document.head.appendChild(styleElement);
document.body.style.background = 'cornflowerblue';
`;

const autoWidthHtml0 = `
<html>
<head>
  <meta name="viewport" content="target-densitydpi=device-dpi, initial-scale=1.0, user-scalable=no" />
</head>
<p style="display: inline;background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));font-weight: 400;font-style: normal;zoom:1;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">hey</p>
</html>
`;

const autoWidthHtml1 = `
<p style="display: inline;background-color: transparent !important;">easy</p>
`;

const autoWidthScript = `
var styleElement = document.createElement('style');
styleElement.innerHTML = '${style1.replace(/\'/g, "\\'").replace(/\n/g, '\\n')}';
document.head.appendChild(styleElement);
`;

export {
  autoHeightHtml0,
  autoHeightHtml1,
  style0,
  autoHeightScript,
  autoWidthHtml0,
  autoWidthHtml1,
  autoWidthScript,
  inlineBodyStyle
};
