class Picrandomizer {
  constructor(imgUrls, wrapperId) {
    this.wrapper = document.getElementById(wrapperId);
    this.wrapperSize = this.getWrapperSize(this.wrapper);

    this.imgUrls = imgUrls;
    this.imgs = [];

    this.shuffleArray(this.imgUrls);

    this.imgUrls.forEach((url, i) => {
      let img = document.createElement("img");
      img.src = url;
      img.setAttribute("draggable", "false");

      let imgSize = this.getImgNaturalSize(img);
      this.imgs.push({ img: img, imgSize: imgSize });

      this.setImgStyle(this.imgs[i]);
    });
  }

  init() {
    for (let i of this.imgs) {
      this.wrapper.appendChild(i.img);
    }
  }

  getImgNaturalSize(img) {
    return {
      height: img.naturalHeight,
      width: img.naturalWidth,
    };
  }

  getRandomPosition(imgSize) {
    let left = this.rnd(this.wrapperSize.offsetWidth - imgSize.width, 0) + "px";
    let top =
      this.rnd(this.wrapperSize.offsetHeight - imgSize.height, 0) + "px";

    return { left: left, top: top };
  }

  getRandomRotation() {
    return this.rnd(364, 0) + "deg";
  }

  getWrapperSize(wrapper) {
    return {
      clientWidth: wrapper.clientWidth,
      clientHeight: wrapper.clientHeight,
      offsetWidth: wrapper.offsetWidth,
      offsetHeight: wrapper.offsetHeight,
    };
  }

  rnd(a, b) {
    return Math.floor(Math.random() * a) + b;
  }

  setWrapperStyle() {
    this.wrapper.style.cssText = `
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
		transform: rotate(${this.getRandomRotation()});
		user-select: none;
		z-index: 0;
	`;
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
