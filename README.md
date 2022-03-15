# Picrandomizer

![give a star to the project](./etc/header.png)

Background pictures positions randomizer. Usage and parameters are described below.
Current version: 1.0.0

Soon the lib will be published in `npm`.

## Features

- randomizes position and rotation of background images in a custom container
- images can't be selected or copied

## Parameters

All the parameters have to be passed to the Picrandomizer's constructor. The nstance of Picrandomized has to be initizlized with `init()` method (preferebly on page load).

Requested parameters:

* `imgUrls` - An array of strings. Urls for the images to show,
*  `wrapperId` - String, an id in DOM of the container for `Picrandomizer`.

Optional parameters:

- `howManyPics` - Number, how many images from `imgUrls` will be shown at a time. Default: `-1` (all the images),
- `rotation` Boolean parameter, if true the images will be rotated randomly. Default: `true`.

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
        imgUrls: ["url/to/1.jpg","url/to/2.jpg","url/to/3.jpg"],
				2,
				rotation: false
      });

      windod.onload = () => {
      	background.init();
      }
  </script>
</body>
```
