"use  strict";

class Menu {
  constructor({
    menuContainerId,
    items,
    activeMenuItemClassname = "menu-item-active",
    menuItemClassname = "menu-item",
  }) {
    if (!menuContainerId) {
      console.error("no menu container specified");
      return;
    }

    this.menu = document.getElementById(menuContainerId);
    if (!this.menu) {
      console.error(
        "no menu container with id ${menuContainerId} found in DOM"
      );
      return;
    }

    if (!items) {
      console.error("no menu items specified");
      return;
    }

    this.activeMenuItemClassname = activeMenuItemClassname;
    this.menuItemClassname = menuItemClassname;
    this.items = this._initItems(items);

    this._appendItems();
  }

  _appendItems() {
    this.items.forEach((i) => {
      this.menu.appendChild(i.dom);
    });
  }

  _initItems(items) {
    let itemsConfig = [];

    items.forEach((item, order) => {
      if (!item.href || !item.caption) {
        console.warn(`necessary info missing for menu item #${order}`);
        return;
      }

      let type = this._tryHref(item.href);
      if (!type) {
        console.warn(
          `problem to associate href ${item.href} to the menu item #${order}`
        );
        return;
      }

      // configure DOM element of menu-item
      let itemDOM = document.createElement("a");
      let id = `menu-item-${order}`;
      itemDOM.classList.add(this.menuItemClassname);
      itemDOM.href = item.href;
      itemDOM.id = id;
      itemDOM.innerText = item.caption;
      if (order == 0) {
        itemDOM.classList.add(this.activeMenuItemClassname);
      }

      itemsConfig.push({
        dom: itemDOM,
        caption: item.caption,
        href: item.href,
        id: `menu-item-${order}`,
        type: type,
      });
    });

    return itemsConfig;
  }

  _toggleAtiveItem() {
    let activeId = 0;

    if (window.pageYOffset == 0) {
      // page top
      activeId = this.items[0].id;
    } else if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight
    ) {
      //page botom
      activeId = this.items[this.items.length - 1].id;
    } else {
      const upStandingSections = this.items.filter(
        (i) => i.type == "internal" && window.pageYOffset >= i.sectionY
      );
      activeId = upStandingSections[upStandingSections.length - 1].id;
    }

    this.items.forEach((i) => {
      if (i.id == activeId) {
        i.dom.classList.add(this.activeMenuItemClassname);
      } else {
        i.dom.classList.remove(this.activeMenuItemClassname);
      }
    });
  }

  _tryHref(href) {
    let sectionTry = document.getElementById(href.slice(1));
    if (sectionTry) {
      return "internal";
    } else if (href.startsWith("http") || href.startsWith("www")) {
      return "external";
    }
    return undefined;
  }

  init() {
    this._getSectionYs();

    window.addEventListener("resize", this._getSectionYs.bind(this));
    window.addEventListener("scroll", this._toggleAtiveItem.bind(this));
  }

  _getSectionYs() {
    for (let item of this.items) {
      if (item.type == "internal") {
        let section = document.querySelector(item.href);
        item["sectionY"] = section.offsetTop;
      }
    }
  }
}
