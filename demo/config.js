'use strict';

const autoHeightHtml0 = `<p style="font-weight: 400;font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. <span style="background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));">If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with “moving”. I’d also use the tags “pets”, “marriage”, “career change”, and “travel tips”.</span></p>`;

const autoHeightHtml1 = `Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with “moving”. I’d also use the tags “pets”, “marriage”, “career change”, and “travel tips”.`;

const autoHeightStyle0 = `
    p {
        font-size: 25px !important;
    }
`;

const autoHeightStyle1 = `
    p {
        font-size: 12px !important;
    }
`;

const autoHeightScript = `
var styleElement = document.createElement('style');
styleElement.innerHTML = '${autoHeightStyle1.replace(/\'/g, "\\'").replace(/\n/g, '\\n')}';
document.head.appendChild(styleElement);
document.body.style.background = 'cornflowerblue';
`;

const autoWidthHtml0 = ``;

const autoWidthHtml1 = ``;

const autoWidthStyle0 = ``;

const autoWidthStyle1 = ``;

const autoWidthScript = ``;

export {
  autoHeightHtml0,
  autoHeightHtml1,
  autoHeightStyle0,
  autoHeightScript,
  autoWidthHtml0,
  autoWidthHtml1,
  autoWidthScript,
  autoWidthStyle0
};
