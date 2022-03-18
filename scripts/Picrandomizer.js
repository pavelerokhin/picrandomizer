class Picrandomizer {
  constructor({
    containerId,
    imagesUrls,
    dontTouch = false,
    howManyImages = -1,
    repetition = false,
    rotation = true,
  }) {
    this.config.containerId = containerId.trim();
    this.config.imagesUrls = imagesUrls;
    this.config.dontTouch = dontTouch;
    this.config.howManyImages = howManyImages;
    this.config.repetition = repetition;
    this.config.rotation = rotation;

    this.errors.errorState = false;

    this.setParent();

    // tests
    this.controls.containerExistsInDOM();
    this.controls.imagesUrlsIsNotEmpty();
    this.controls.isItPossibleToPrimtImagesWithNoRepetition();
    if (this.errors.errorState) {
      this.errors.logErrorMessages();
      return;
    }

    // intiialization
    this.container.dom = document.getElementById(containerId);
    this.container.size = this.container.getSize();

    this.images.howManyImages =
      this.config.howManyImages > 0
        ? this.config.imagesUrls.length
        : this.config.howManyImages;
    this.images.images = [];

    this.container.setStyle();

    if (this.config.repetition) {
      for (let i = 0; i < this.config.howManyImages; i++) {
        this.images.imagesUrls.push(
          this.config.imagesUrls[this.utils.rnd(this.config.imagesUrls.length)]
        );
      }
    } else {
      this.images.imagesUrls = this.utils
        .shuffleArray(this.config.imagesUrls)
        .slice(0, this.config.howManyImages);
    }

    this.images.createDomElements();

    window.addEventListener("resize", () => {
      debugger;
      this.container.size = this.container.getSize();
      this.show();
    });
  }

  container = {
    parent: undefined,

    dom: undefined,
    size: {
      height: undefined,
      width: undefined,
    },
    getSize() {
      return {
        width: this.dom.offsetWidth,
        height: this.dom.offsetHeight,
      };
    },

    setStyle() {
      this.dom.style.cssText = `
      overflow: hidden;
      position: relative;
    `;
    },
  };

  controls = {
    parent: undefined,

    containerExistsInDOM() {
      if (this.parent.config.containerId.length == 0) {
        this.parent.errors.errorMessages.push(
          "no Picrandomizer's container has been set"
        );
        this.parent.errors.errorState = true;
      }

      return;
    },

    imagesUrlsIsNotEmpty() {
      if (this.parent.config.imagesUrls.length == 0) {
        this.parent.errors.errorMessages.push(
          "no Picrandomizer's images urls have been set"
        );
        this.parent.errors.errorState = true;
      }

      return;
    },

    isItPossibleToPrimtImagesWithNoRepetition() {
      let imagesN =
        this.parent.config.howManyImages >= 0
          ? this.parent.config.howManyImages
          : urlsN;
      let urlsN = this.parent.config.imagesUrls.length;

      if (
        imagesN > this.parent.config.imagesUrls.length &&
        !this.parent.config.repetition
      ) {
        this.parent.errors.errorMessages.push(
          `can't take ${imagesN} from the pictures provided (${urlsN} images) without repetition`
        );
        this.parent.errors.errorState = true;
      }

      return;
    },
  };

  config = {
    containerId: undefined,
    imagesUrls: [],
    dontTouch: false,
    howManyImages: -1,
    repetition: false,
    rotation: true,
  };

  errors = {
    parent: undefined,

    errorState: false,
    errorMessages: [],

    logErrorMessages() {
      if (this.errorState) {
        console.error("Prirandomazer is in error state!");
        errorMessages.forEach((e, i) => {
          console.error(i, ":", e);
        });
      }
    },
  };

  geometry = {
    isCollision(imgConfig1, imgConfig2) {
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
    },

    setProjections(imgConfig) {
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
          this.parent.utils.degrees(
            Math.atan((corner.y - center_y) / (corner.x - center_x))
          )
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
          distance_corner_center *
            Math.cos(this.parent.utils.radians(delta_angle))
        );

        // Create projection
        projection_x.x = Math.floor(
          center_x +
            distance_center_projection_x *
              Math.cos(this.parent.utils.radians(-angle90))
        );
        projection_x.y = Math.floor(
          center_y +
            distance_center_projection_x *
              Math.sin(this.parent.utils.radians(-angle90))
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
          distance_corner_center *
            Math.cos(this.parent.utils.radians(delta_angle - 90))
        );

        // Create projection
        projection_y.x = Math.floor(
          center_x +
            distance_center_projection_y *
              Math.cos(this.parent.utils.radians(-angle90 - 90))
        );
        projection_y.y = Math.floor(
          center_y +
            distance_center_projection_y *
              Math.sin(this.parent.utils.radians(-angle90 - 90))
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
    },
  };

  images = {
    parent: undefined,

    howManyImages: 0,
    imagesUrls: [],
    images: [],

    createDomElements() {
      this.imagesUrls.forEach((url) => {
        let img = document.createElement("img");
        img.src = url;
        img.setAttribute("draggable", "false");

        this.images.push({
          imgItself: img,
          imgConfig: this.getConfigObject(),
        });
      });
    },

    getConfigObject() {
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
    },

    getRandomPosition(imgConfig) {
      let left = this.parent.utils.rnd(
        this.parent.container.size.width - imgConfig.width
      );
      let top = this.parent.utils.rnd(
        this.parent.container.size.height - imgConfig.height
      );

      return { left: left, top: top };
    },

    getRandomRotation() {
      return this.parent.utils.rnd(365);
    },

    getSize(img) {
      return {
        height: img.width,
        width: img.height,
      };
    },

    async preload() {
      for (let img of this.images) {
        const image = new Image();
        const preloadImage = (src) =>
          new Promise((r) => {
            image.onload = r;
            image.onerror = r;
            image.src = src;
          });

        // Preload an image
        await preloadImage(img.imgItself.src);
        let imgSize = this.getSize(image);
        img.imgConfig.height = imgSize.height;
        img.imgConfig.width = imgSize.width;
      }
    },

    setStyle(img) {
      if (img.imgConfig.isVisible) {
        img.imgItself.style.cssText = `
        left: ${img.imgConfig.corners[0].x}px;
        position: absolute;
        top: ${img.imgConfig.corners[0].y}px;
        user-select: none;
        z-index: 0;
      `;

        if (this.parent.config.rotation) {
          img.imgItself.style.transform = `rotate(${img.imgConfig.rotation}deg)`;
        }
      }
    },

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

      if (this.parent.config.rotation) {
        imgConfig.rotation = this.getRandomRotation();
      }
    },

    setPositionNotTouchingAnyone(imgConfig) {
      let tryCount = 0;
      let randomPosition = this.getRandomPosition(imgConfig);
      this.setPosition(imgConfig, randomPosition);
      this.parent.geometry.setProjections(imgConfig);

      while (this.touchesAnyone(imgConfig) && tryCount < 10) {
        let randomPosition = this.getRandomPosition(imgConfig);
        this.setPosition(imgConfig, randomPosition);
        this.parent.geometry.setProjections(imgConfig);
        tryCount++;
      }
      if (tryCount >= 10) {
        imgConfig.isVisible = false;
        imgConfig.corners = [];
        imgConfig.rotation = undefined;
      }
    },

    touchesAnyone(imgConfig) {
      let touch = false;
      for (let otherImg of this.images) {
        if (imgConfig == otherImg.imgConfig) {
          continue;
        }
        if (otherImg.imgConfig.corners.length > 0) {
          touch = this.geometry.isCollision(imgConfig, otherImg.imgConfig);
          if (touch) {
            break;
          }
        }
      }
      return touch;
    },
  };

  utils = {
    degrees(radians) {
      return (radians * 180) / Math.PI;
    },

    radians(degrees) {
      return (degrees * Math.PI) / 180;
    },

    // random number in scope: [0,a)
    rnd(a) {
      return Math.floor(Math.random() * a);
    },

    shuffleArray(array) {
      let result = array.map((x) => x);
      for (let i = result.length - 1; i > 0; i--) {
        let j = this.rnd(i + 1);
        let temp = result[i];
        result[i] = result[j];
        result[j] = temp;
      }

      return result;
    },
  };

  async preload() {
    await this.images.preload();
  }

  setParent() {
    // pass the link to the parent instance
    this.container.parent = this;
    this.controls.parent = this;
    this.config.parent = this;
    this.errors.parent = this;
    this.images.parent = this;
    this.utils.parent = this;
  }

  show() {
    if (!this.errors.errorState) {
      for (let img of this.images.images) {
        if (this.config.dontTouch) {
          this.images.setPositionNotTouchingAnyone(img.imgConfig);
        } else {
          let randomPosition = this.images.getRandomPosition(img.imgConfig);
          this.images.setPosition(img.imgConfig, randomPosition);
        }
        if (img.imgConfig.isVisible) {
          this.images.setStyle(img);
          this.container.dom.appendChild(img.imgItself);
        }
      }
    } else {
      this.errors.logErrorMessages();
    }
  }
}
