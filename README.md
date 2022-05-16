# Picrandomizer

![give a star to the project](./etc/header.png)

Background pictures positions randomiser. Usage and parameters are described below. Current version: 1.0.0
Soon the lib will be published in npm.
## Features
 * randomizes position and rotation of background images in a custom container
 * images can't be selected or copied

## Parameters
All the parameters have to be passed to the Picrandomizer's constructor. The instance of Picrandomized has to be visualized with the show() method (preferably on page load).
Requested parameters:
 * `containerId` - String, an id in DOM of the container for Picrandomizer.
 * `imagesUrls` - An array of strings. URLs for the images to show,
Optional parameters:
 * `howManyImages` - Number, how many images from imagesUrls will be shown at a time. Default: -1 (all the images),
 * `repetition` - Boolean, if the images provided to Picrandomizer can be repeated. Default: false,
 * `repetition` - Boolean, if images can be repeated. Default: false,
 * `resize` - Object, if resizing the given images can be applied. The measure of resize is percents of the original size (E.g. -1%,2%,10%,-15%,50%,100%, ... of the original size). The object consists of the following fields:
  - `needed` - Boolean, if resize should be applied. Default: false,
  - `type` - type of resizing. The following types are allowed: "cont" (for continuous random distribution if sizes, min and max limit are defined by range parameter), "desc" (for discrete states defined by range parameter). The distribution is Uniform,
range- Array, if the type is "cont", the array has two elements, min and max limits of sizes (in percentage). If the type is "disc", the array consists of all the requested states;
  - `rotation` - Object, which defines if and how images will be resized. The measure of rotation in degrees. The object consists of the following fields: if true the images will be rotated randomly. Default: true,
  - `needed` - Boolean, if rotation should be applied. Default: true,
  - `type` - Type of resizing. Allowed states: cont, disc,
  - `range` - Array, if the type is "cont", the array has two elements, min and max limits of rotation (in percentage). If the type is "disc", the array consists of all the requested states. Default: [0, 359].

## Usage
See the `example.html` file.
E.g.:

```
<body>
  ...
  <div id="background"></div>
  ...

  <script src="Picrandomizer.js"></script>
  <script>
      const background = new Picrandomizer({
        containerId: "background",
        imagesUrls: ["url/to/1.jpg","url/to/2.jpg","url/to/3.jpg"],
	howManyImages: 2,
	rotation: { needed: false }
      });

      window.onload = () => {
      	background.show();
      }
  </script>
</body>
```
