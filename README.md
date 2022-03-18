# Picrandomizer

![give a star to the project](./etc/header.png)

Background pictures positions randomizer. Usage and parameters are described below.
Current version: 1.0.0

Soon the lib will be published in `npm`.

## Features

- randomizes position and rotation of background images in a custom container
- images can't be selected or copied

## Parameters

All the parameters have to be passed to the Picrandomizer's constructor. The nstance of Picrandomized has to be visualized with `show()` method (preferebly on page load).

Requested parameters:

- `containerId` - String, an id in DOM of the container for `Picrandomizer`.
- `imagesUrls` - An array of strings. Urls for the images to show,

Optional parameters:

- `howManyImages` - Number, how many images from `imagesUrls` will be shown at a time. Default: `-1` (all the images),
- `repetition` - Boolean, if the images provided to Picrandomizer can be repeated. Default: `false`,
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
        imagesUrls: ["url/to/1.jpg","url/to/2.jpg","url/to/3.jpg"],
				2,
				rotation: false
      });

      windod.onload = () => {
      	background.show();
      }
  </script>
</body>
```
