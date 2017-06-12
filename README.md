# react-native-autoheight-webview
An auto height webview for React Native.

Cause of moving View.propTypes to ViewPropTypes in React Naitve 0.44 (https://github.com/facebook/react-native/releases) and PropTypes has been moved to a separate package in React 16 (https://facebook.github.io/react/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes), please install react-native-autoheight-webview 0.2.3 for the project with rn version lower than 0.44.

`npm install react-native-autoheight-webview --save`

`npm install react-native-autoheight-webview@0.2.3 --save` (if the project with rn version lower than 0.44)

## android
`react-native link react-native-autoheight-webview`

## showcase
![react-native-autoheight-webview ios](https://media.giphy.com/media/l4FGyhnvWfUgxCfe0/200w.gif)&nbsp;
![react-native-autoheight-webview android](https://media.giphy.com/media/xUPGcIO0a1ggESelfq/200w.gif)

# usage

```javascript
<AutoHeightWebView
    onHeightUpdated={height => console.log(height)},
    // offset of rn webview margin 
    heightOffset={5}
    // default width is the width of screen
    style={customStyle}
    // enable animation by default
    enableAnimation={true},
    // only works on enable animation
    animationDuration={255},
    // or uri
    source={{ html: `<p style="font-weight: 400;font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. <span style="background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));">If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with “moving”. I’d also use the tags “pets”, “marriage”, “career change”, and “travel tips”.</span></p>` }}
    // use local or remote files
    files={[{
        href: 'cssfileaddress',
        type: 'text/css',
        rel: 'stylesheet'
    }]}
    // change script (have to change source to reload on android)
    customScript={`document.body.style.background = 'lightyellow';`} />
```
