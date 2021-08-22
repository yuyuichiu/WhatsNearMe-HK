# WhatsNearMe-HK <img src="./assets/icon.png" width='40px' height=40px />      ![](https://img.shields.io/github/last-commit/yuyuichiu/not-pizza-hut?style=flat-square)
Wonder where is the nearest supermarket to you? WhatsNearMe suggests your target facilities near you, so you can easily decide where to go. You can search the type of facility you plan to go, and the application will return the 3 nearest places to you.

Web is live on: <a href="https://yuyuichiu.github.io/WhatsNearMe-HK/" target="__blank" >https://yuyuichiu.github.io/WhatsNearMe-HK</a>  (works on mobile and PC!)

## How to use
![basic app flow](https://media.giphy.com/media/apeuU3w3TGQLl9vNEL/giphy.gif?cid=790b7611c3f4314d84d37b779a3510fee03aaa9da5c592f1&rid=giphy.gif&ct=g)

No matter on mobile or PC, you can find your nearest places in just 2 simple steps:
1. Enter your starting location address
> No need to fill in your housing speifics, just your rough location is all we need.
<!-- ![whatsnearme-step1](https://user-images.githubusercontent.com/68574667/123072401-16315e00-d448-11eb-907b-41991df70dea.png) -->
2. Select a target facility to look for, then submit.
> You can type in your custom query, or choose one of the predefined options.
<!-- ![whatsnearme-step2](https://user-images.githubusercontent.com/68574667/123073984-812f6480-d449-11eb-8527-ff184f8b0769.png) -->

That's it! You should now see up to 5 result of the nearest facilities that you are looking for. Optionally, you can press the google map direction button to see how should to go there.
<!-- ![whatsnearme-result](https://user-images.githubusercontent.com/68574667/123072712-598bcc80-d448-11eb-9317-438249695f28.png) -->

## Behind the scene
This web application communicates with Google Places and Geocoding API (and its related libraries) to retrieve the nearest facilities from your starting location dyanmically. This website provides a convenient and easy-to-simple interface to let everyone access to Google's amazing service without charge. It also utilizes other plugins for better UX, such as Google Autocomplete to fill in address easier, as well as localStorage to store the last search start location. Import module system is also implemented in the JavaScript source code to organized code into several files with distinct purpose.

### Things that I am planning to add
* Captcha
* Display estimated travel distance as a part of search result
* Make a English version
