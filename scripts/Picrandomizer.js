class Picrandomizer {
  constructor({
    containerId,
    imgUrls,
    howManyPics = -1,
    repetition = false,
    rotation = true,
  }) {
    containerId = containerId.trim();
    if (howManyPics < 0) {
      howManyPics = imgUrls.length;
    }

    // tests
    if (containerId.length == 0) {
      console.info("no Picrandomizer's container has been set");
      return;
    }
    if (imgUrls.length == 0) {
      console.info("no Picrandomizer's images urls have been set");
      return;
    }
    if (howManyPics > imgUrls.length && !repetition) {
      console.info(
        `can't take ${howManyPics} from the pictures provided (${imgUrls.length} images) without repetition`
      );
      return;
    }

    this.container = document.getElementById(containerId);
    this.containerSize = this.getContainerSize(this.container);
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

    debugger;
    this.imgUrls.forEach((url) => {
      let img = document.createElement("img");
      img.src = url;
      img.setAttribute("draggable", "false");

      let imgSize = this.getImgNaturalSize(img);
      this.imgs.push({ img: img, imgSize: imgSize });
    });

    this.setImgsStyle();
  }

  init() {
    for (let i of this.imgs) {
      this.container.appendChild(i.img);
    }

    window.addEventListener("resize", this.handlerResize.bind(this));
  }

  handlerResize() {
    this.containerSize = this.getContainerSize(this.container);
    this.setImgsStyle();
  }

  getImgNaturalSize(img) {
    return {
      height: img.naturalHeight,
      width: img.naturalWidth,
    };
  }

  getRandomPosition(imgSize) {
    let left =
      this.rnd(this.containerSize.offsetWidth - imgSize.width, 0) + "px";
    let top =
      this.rnd(this.containerSize.offsetHeight - imgSize.height, 0) + "px";

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

  setImgStyle(imgSettings) {
    let randomPosition = this.getRandomPosition(imgSettings.imgSize);

    imgSettings.img.style.cssText = `
		left: ${randomPosition.left};
		position: absolute;
		top: ${randomPosition.top};
		user-select: none;
		z-index: 0;
  `;

    if (this.rotation) {
      imgSettings.img.style.transform = `rotate(${this.getRandomRotation()})`;
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
