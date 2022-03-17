class Picrandomizer {
  constructor({
    containerId,
    imgUrls,
    dontTouch = false,
    howManyPics = -1,
    repetition = false,
    rotation = true,
  }) {
    containerId = containerId.trim();
    if (howManyPics < 0) {
      howManyPics = imgUrls.length;
    }

    this.errorState = false;

    // tests
    if (containerId.length == 0) {
      console.error("no Picrandomizer's container has been set");
      this.errorState = true;
      return;
    }
    if (imgUrls.length == 0) {
      console.error("no Picrandomizer's images urls have been set");
      this.errorState = true;
      return;
    }
    if (howManyPics > imgUrls.length && !repetition) {
      console.error(
        `can't take ${howManyPics} from the pictures provided (${imgUrls.length} images) without repetition`
      );
      this.errorState = true;
      return;
    }

    this.container = document.getElementById(containerId);
    this.containerSize = this.getContainerSize(this.container);
    this.dontTouch = dontTouch;
    this.howManyPics = howManyPics;
    this.imgUrls = imgUrls;
    this.imgs = [];
    this.repetition = repetition;
    this.rotation = rotation;

    this.setContainerStyle();

    if (this.repetition) {
      let tmpUrls = [];
      for (let i = 0; i < this.howManyPics; i++) {
        tmpUrls.push(this.imgUrls[this.rnd(this.imgUrls.length, 0)]);
      }
      this.imgUrls = tmpUrls;
    } else {
      this.shuffleArray(this.imgUrls);
      this.imgUrls = this.imgUrls.slice(0, howManyPics);
    }

    this.imgUrls.forEach((url) => {
      let img = document.createElement("img");
      img.src = url;
      img.setAttribute("draggable", "false");

      this.imgs.push({
        imgItself: img,
        imgConfig: this.getImgConfig(),
      });
    });
  }

  async init() {
    await this.preloadImages();

    if (!this.errorState) {
      for (let img of this.imgs) {
        if (this.dontTouch) {
          this.setRandomDontTouchPosition(img.imgConfig);
        } else {
          let randomPosition = this.getRandomPosition(img.imgConfig);
          this.setPosition(img.imgConfig, randomPosition);
        }
        if (img.imgConfig.isVisible) {
          debugger;
          this.setImgStyle(img);
          this.container.appendChild(img.imgItself);
        }
      }
      window.addEventListener("resize", this.handlerResize.bind(this));
    } else {
      console.error(
        "Due to errors, it's impossible to initialize Picrandomizer"
      );
    }
  }

  touchCriteria(imgConfig) {
    let touch = false;
    for (let otherImg of this.imgs) {
      if (imgConfig == otherImg.imgConfig) {
        continue;
      }
      if (otherImg.imgConfig.corners.length > 0) {
        touch = this.collision(imgConfig, otherImg.imgConfig);
        if (touch) {
          break;
        }
      }
    }
    return touch;
  }

  // TODO: remake
  handlerResize() {
    this.containerSize = this.getContainerSize(this.container);
    this.setImgsStyle();
  }

  getImgConfig() {
    return {
      center: { x: undefined, y: undefined },
      corners: [],
      height: undefined,
      isVisible: true,
      projections: undefined,
      radius: undefined,
      rotation: undefined,
      width: undefined,
    };
  }

  getRandomPosition(imgConfig) {
    let left = this.rnd(this.containerSize.width - imgConfig.width, 0);
    let top = this.rnd(this.containerSize.height - imgConfig.height, 0);

    return { left: left, top: top };
  }

  getRandomRotation() {
    return this.rnd(364, 0);
  }

  getContainerSize(container) {
    return {
      // clientWidth: container.clientWidth,
      // clientHeight: container.clientHeight,
      width: container.offsetWidth,
      height: container.offsetHeight,
    };
  }

  getImageSize(img) {
    return {
      height: img.width,
      width: img.height,
    };
  }

  async preloadImages() {
    for (let img of this.imgs) {
      const image = new Image();
      const preload = (src) =>
        new Promise((r) => {
          image.onload = r;
          image.onerror = r;
          image.src = src;
        });

      // Preload an image
      await preload(img.imgItself.src);
      let imgSize = this.getImageSize(image);
      img.imgConfig.height = imgSize.height;
      img.imgConfig.width = imgSize.width;
    }
  }

  rnd(a, b) {
    return Math.floor(Math.random() * a) + b;
  }

  setContainerStyle() {
    this.container.style.cssText = `
		overflow: hidden;
		position: relative;
	`;
  }

  setImgStyle(img) {
    if (img.imgConfig.isVisible) {
      img.imgItself.style.cssText = `
      left: ${img.imgConfig.corners[0].x}px;
      position: absolute;
      top: ${img.imgConfig.corners[0].y}px;
      user-select: none;
      z-index: 0;
    `;

      if (this.rotation) {
        img.imgItself.style.transform = `rotate(${img.imgConfig.rotation}deg)`;
      }
    }
  }

  setProjections(imgConfig) {
    debugger;
    let center_x = imgConfig.center.x;
    let center_y = imgConfig.center.y;
    let angle = imgConfig.rotation ? imgConfig.rotation : 0;
    let corners = imgConfig.corners;

    // Genere start Min-Max projection on center of Square
    let projections = {
      x: {
        min: null,
        max: null,
        distance: null,
      },
      y: {
        min: null,
        max: null,
        distance: null,
      },
    };

    for (let corner of corners) {
      let projection_x = {},
        projection_y = {};

      /**
       * Global calculation for projection X and Y
       */

      // Angle 0:horizontale (center > left) 90:verticatale (center > top)
      let angle90 = -(angle % 90);

      //Distance :
      let distance_corner_center = Math.floor(
        Math.sqrt(
          (center_x - corner.x) * (center_x - corner.x) +
            (center_y - corner.y) * (center_y - corner.y)
        )
      );

      // Angle between segment [center-corner] and real axe X (not square axe), must be negative (radius are negative clockwise)
      let angle_with_axeX = -Math.floor(
        this.degrees(Math.atan((corner.y - center_y) / (corner.x - center_x)))
      ); // Tan(alpha) = opposé (ecart sur Y) / adjacent (ecart sur X)
      // If angle is ]0;90[, he is on the 2em et 4th quart of rotation
      if (angle_with_axeX > 0) {
        angle_with_axeX -= 180;
      }
      // If corner as upper (so with less pixel on y) thant center, he is on 3th or 4th quart of rotation
      if (
        corner.y < center_y ||
        (corner.y == center_y && corner.x < center_x)
      ) {
        angle_with_axeX -= 180;
      }

      // Calculate difference between 2 angles to know the angle between [center-corner] and Square axe X
      let delta_angle = angle_with_axeX - angle90;
      // If angle is on ]-180;-360], corner are upper than Square axe X, so set a positive angle on [0;180]
      if (delta_angle < -180) {
        delta_angle += 360;
      }

      /**
       * Projection on X
       */

      // Calculate distance between center and projection on axe X
      let distance_center_projection_x = Math.floor(
        distance_corner_center * Math.cos(this.radians(delta_angle))
      );

      // Create projection
      projection_x.x = Math.floor(
        center_x +
          distance_center_projection_x * Math.cos(this.radians(-angle90))
      );
      projection_x.y = Math.floor(
        center_y +
          distance_center_projection_x * Math.sin(this.radians(-angle90))
      );

      // If is the min ?
      if (
        projections.x.min == null ||
        distance_center_projection_x < projections.x.min.distance
      ) {
        projections.x.min = projection_x;
        projections.x.min.distance = distance_center_projection_x;
        projections.x.min.corner = corner;
      }
      // Is the max ?
      if (
        projections.x.max == null ||
        distance_center_projection_x > projections.x.max.distance
      ) {
        projections.x.max = projection_x;
        projections.x.max.distance = distance_center_projection_x;
        projections.x.max.corner = corner;
      }

      /**
       * Projection on Y
       */

      // Calculate distance between center and projection on axe Y
      let distance_center_projection_y = Math.floor(
        distance_corner_center * Math.cos(this.radians(delta_angle - 90))
      );

      // Create projection
      projection_y.x = Math.floor(
        center_x +
          distance_center_projection_y * Math.cos(this.radians(-angle90 - 90))
      );
      projection_y.y = Math.floor(
        center_y +
          distance_center_projection_y * Math.sin(this.radians(-angle90 - 90))
      );

      // If is the min ?
      if (
        projections.y.min == null ||
        distance_center_projection_y < projections.y.min.distance
      ) {
        projections.y.min = projection_y;
        projections.y.min.distance = distance_center_projection_y;
        projections.y.min.corner = corner;
      }
      // Is the max ?
      if (
        projections.y.max == null ||
        distance_center_projection_y > projections.y.max.distance
      ) {
        projections.y.max = projection_y;
        projections.y.max.distance = distance_center_projection_y;
        projections.y.max.corner = corner;
      }
    }

    imgConfig.projections = projections;
  }

  setPosition(imgConfig, randomPosition) {
    imgConfig.corners = [];
    imgConfig.corners.push({ x: randomPosition.left, y: randomPosition.top });
    imgConfig.corners.push({
      x: randomPosition.left + imgConfig.width,
      y: randomPosition.top,
    });
    imgConfig.corners.push({
      x: randomPosition.left + imgConfig.width,
      y: randomPosition.top + imgConfig.height,
    });
    imgConfig.corners.push({
      x: randomPosition.left,
      y: randomPosition.top + imgConfig.height,
    });

    imgConfig.center = {
      x: imgConfig.corners[0].x + imgConfig.width / 2,
      y: imgConfig.corners[0].y + imgConfig.height / 2,
    };

    if (this.rotation) {
      imgConfig.rotation = this.getRandomRotation();
    }
  }

  setRandomDontTouchPosition(imgConfig) {
    let tryCount = 0;
    let randomPosition = this.getRandomPosition(imgConfig);
    this.setPosition(imgConfig, randomPosition);
    this.setProjections(imgConfig);

    while (this.touchCriteria(imgConfig) && tryCount < 10) {
      let randomPosition = this.getRandomPosition(imgConfig);
      this.setPosition(imgConfig, randomPosition);
      this.setProjections(imgConfig);
      tryCount++;
    }
    if (tryCount >= 10) {
      imgConfig.isVisible = false;
      imgConfig.corners = [];
      imgConfig.rotation = undefined;
    }
  }

  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = this.rnd(i + 1, 0);
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  // collision utils
  collision(imgConfig1, imgConfig2) {
    if (!imgConfig1.projections || !imgConfig2.projections) {
      return false;
    }

    imgConfig1.projections.x.is_collide =
      (imgConfig1.projections.x.min.distance <= -imgConfig2.width / 2 &&
        imgConfig1.projections.x.max.distance >= -imgConfig2.width / 2) ||
      (imgConfig1.projections.x.min.distance <= imgConfig2.width / 2 &&
        imgConfig1.projections.x.max.distance >= imgConfig2.width / 2) ||
      (imgConfig1.projections.x.min.distance >= -imgConfig2.width / 2 &&
        imgConfig1.projections.x.max.distance <= imgConfig2.width / 2)
        ? true
        : false;

    imgConfig1.projections.y.is_collide =
      (imgConfig1.projections.y.min.distance <= -imgConfig2.height / 2 &&
        imgConfig1.projections.y.max.distance >= -imgConfig2.height / 2) ||
      (imgConfig1.projections.y.min.distance <= imgConfig2.height / 2 &&
        imgConfig1.projections.y.max.distance >= imgConfig2.height / 2) ||
      (imgConfig1.projections.y.min.distance >= -imgConfig2.height / 2 &&
        imgConfig1.projections.y.max.distance <= imgConfig2.height / 2)
        ? true
        : false;

    imgConfig2.projections.x.is_collide =
      (imgConfig2.projections.x.min.distance <= -imgConfig1.width / 2 &&
        imgConfig2.projections.x.max.distance >= -imgConfig1.width / 2) ||
      (imgConfig2.projections.x.min.distance <= imgConfig1.width / 2 &&
        imgConfig2.projections.x.max.distance >= imgConfig1.width / 2) ||
      (imgConfig2.projections.x.min.distance >= -imgConfig1.width / 2 &&
        imgConfig2.projections.x.max.distance <= imgConfig1.width / 2)
        ? true
        : false;

    imgConfig2.projections.y.is_collide =
      (imgConfig2.projections.y.min.distance <= -imgConfig1.height / 2 &&
        imgConfig2.projections.y.max.distance >= -imgConfig1.height / 2) ||
      (imgConfig2.projections.y.min.distance <= imgConfig1.height / 2 &&
        imgConfig2.projections.y.max.distance >= imgConfig1.height / 2) ||
      (imgConfig2.projections.y.min.distance >= -imgConfig1.height / 2 &&
        imgConfig2.projections.y.max.distance <= imgConfig1.height / 2)
        ? true
        : false;

    return imgConfig1.projections.x.is_collide &&
      imgConfig1.projections.y.is_collide &&
      imgConfig2.projections.x.is_collide &&
      imgConfig2.projections.y.is_collide
      ? true
      : false;
  }

  radians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  degrees(radians) {
    return (radians * 180) / Math.PI;
  }
}
