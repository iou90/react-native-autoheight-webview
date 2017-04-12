# react-native-autoheight-webview
An auto height webview for React Native.

`npm install react-native-autoheight-webview --save`

## android
`react-native link react-native-autoheight-webview`

## showcase
![react-native-autoheight-webview](https://media.giphy.com/media/xUA7bj3KScXHeom1I4/giphy.gif)&nbsp;
![react-native-autoheight-webview](https://media.giphy.com/media/xUA7b4xTJ4FYX3RuZq/giphy.gif)

# usage

```javascript
<AutoHeightWebView
    onHeightUpdated={height => console.log(height)}
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
