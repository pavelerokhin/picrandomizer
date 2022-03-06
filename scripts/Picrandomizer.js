class Picrandomizer {
  constructor(imgUrls, wrapperId) {
    this.wrapper = document.getElementById(wrapperId);
    this.wrapperSize = this.getWrapperSize(this.wrapper);

    this.imgUrls = imgUrls;
    this.imgs = [];

    this.shuffleArray(this.imgUrls);

    for (let url of this.imgUrls) {
      let img = document.createElement("img");
      img.src = url;

      let imgSize = this.getImgNaturalSize(img);
      let randomPosition = this.getRandomPosition(imgSize);

      img.style.cssText = `
					left: ${randomPosition.left};
					position: fixed;
					top: ${randomPosition.top};
					transform: rotate(${this.getRandomRotation()})
				`;

      this.imgs.push({ img: img, imgSize: imgSize });
    }
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

  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = this.rnd(i + 1, 0);
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
}
