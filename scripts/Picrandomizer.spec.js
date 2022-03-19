const Picrandomizer = require("./Picrandomizer.js");

const p = new Picrandomizer();

describe("Picrandomizer geometry subclass tests:", () => {
  beforeEach(() => {});

  test("should be defined", () => {
    expect(p.geometry).toBeDefined();
  });
});
