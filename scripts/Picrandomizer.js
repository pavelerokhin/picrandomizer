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
    // this.randomizerAllowedStates = [
    //   { repetition: false, rotation: false, dontTouch: false },
    //   { repetition: true, rotation: false, dontTouch: false },
    //   { repetition: false, rotation: true, dontTouch: false },
    //   { repetition: true, rotation: true, dontTouch: false },
    //   { repetition: false, rotation: false, dontTouch: true },
    //   { repetition: true, rotation: false, dontTouch: true },
    //   { repetition: false, rotation: true, dontTouch: true },
    //   { repetition: true, rotation: true, dontTouch: true },
    // ];

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

      let imgConfig;
      if (this.dontTouch) {
        imgConfig = this.getImgDontTouchConfig(img);
      } else {
        imgConfig = this.getImgNaturalConfig(img);
      }
      this.imgs.push({
        imgItself: img,
        imgConfig: imgConfig,
        isVisible: true,
      });
    });

    this.setImgsStyle();
  }

  init() {
    if (!this.errorState) {
      for (let i of this.imgs) {
        this.container.appendChild(i.img);
      }
      window.addEventListener("resize", this.handlerResize.bind(this));
    } else {
      console.error(
        "Due to errors, it's impossible to initialize Picrandomizer"
      );
    }
  }

  initImgDontTouchConfig(img) {
    let coordinates = {
      x1: undefined,
      y1: undefined,
      x2: undefined,
      y2: undefined,
    };
    let radius = Math.max(img.naturalHeight / 2, img.naturalWidth / 2);
    let center = {
      x0: undefined, // will be x1 + radius when ricalulated
      y0: undefined, // will be y1 + radius when ricalulated
    };

    return {
      center: center,
      coordinates: coordinates,
      height: img.naturalHeight,
      radius: radius,
      width: img.naturalWidth,
    };
  }

  dontTouchCriteria(imgConfig) {
    let touch = false;
    for (let otherImg of this.imgs) {
      if (otherImg.imgConfig.coordinates.x0) {
        touch =
          elqideanDistance(
            otherImg.imgConfig.center.x0,
            imgConfig.center.x0,
            otherImg.imgConfig.center.y0,
            mgConfig.center.y0
          ) <
          otherImg.imgConfig.radius + imgConfig.radius;
        if (touch) {
          break;
        }
      }
    }
    return touch;
  }

  elqideanDistance(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  handlerResize() {
    this.containerSize = this.getContainerSize(this.container);
    this.setImgsStyle();
  }

  getImgNaturalConfig(img) {
    return {
      height: img.naturalHeight,
      width: img.naturalWidth,
    };
  }

  getRandomDontTouchPosition(imgConfig) {
    let tryCount = 0;
    let randomPosition = this.getRandomPosition(img.imgConfig);

    while (!this.dontTouchCriteria(imgConfig) || tryCount < 10) {
      randomPosition = this.getRandomPosition(img.imgConfig);
      img.imgConfig.coordinates.x1 = randomPosition.left;
      img.imgConfig.coordinates.y1 = randomPosition.top;
      img.imgConfig.coordinates.x2 = randomPosition.left + img.imgConfig.width;
      img.imgConfig.coordinates.y2 = randomPosition.top + img.imgConfig.height;
      img.imgConfig.center.x0 =
        img.imgConfig.coordinates.x1 + img.imgConfig.radius;
      img.imgConfig.center.y0 =
        img.imgConfig.coordinates.y1 + img.imgConfig.radius;

      tryCount++;
    }
    if (tryCount >= 10) {
      img.isVisible = false;
      img.imgConfig.coordinates.x1 = undefined;
      img.imgConfig.coordinates.y1 = undefined;
      img.imgConfig.coordinates.x2 = undefined;
      img.imgConfig.coordinates.y2 = undefined;
      img.imgConfig.center.x0 = undefined;
      img.imgConfig.center.y0 = undefined;
    }
  }

  getRandomPosition(imgConfig) {
    let left = this.rnd(this.containerSize.offsetWidth - imgConfig.width, 0);
    let top = this.rnd(this.containerSize.offsetHeight - imgConfig.height, 0);

    return { left: left, top: top };
  }

  getRandomRotation() {
    return this.rnd(364, 0) + "deg";
  }

  getContainerSize(container) {
    return {
      clientWidth: container.clientWidth,
      clientHeight: container.clientHeight,
      offsetWidth: container.offsetWidth,
      offsetHeight: container.offsetHeight,
    };
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

  setCoordinates(imgConfig, newCoordinates) {
    imgConfig.coordinates.x1 = newCoordinates.left;
    imgConfig.coordinates.y1 = newCoordinates.top;
    imgConfig.coordinates.x2 = newCoordinates.left + imgConfig.width;
    imgConfig.coordinates.y2 = newCoordinates.left + imgConfig.height;

    imgConfig.center.x0 = imgConfig.coordinates.x1 + imgConfig.radius;
    imgConfig.center.y0 = imgConfig.coordinates.y1 + imgConfig.radius;
  }

  setImgStyle(img) {
    if (img.isVisible) {
      let randomPosition = this.getRandomPosition(img.imgConfig);

      img.imgItself.style.cssText = `
      left: ${randomPosition.left}px;
      position: absolute;
      top: ${randomPosition.top}px;
      user-select: none;
      z-index: 0;
    `;

      if (this.rotation) {
        img.imgItself.style.transform = `rotate(${this.getRandomRotation()})`;
      }
    }
  }

  setImgsStyle() {
    for (let img of this.imgs) {
      this.setImgStyle(img);
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
}
