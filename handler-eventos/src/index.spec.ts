import * as handlers from "./index";

describe("deve validar existencia dos handlers corretamente", () => {
  it(`handlers devem existir`, () => {
    expect(handlers.lerTopico).toBeDefined();
    expect(handlers.lerTopicos).toBeDefined();
    expect(handlers.publicarSns).toBeDefined();
  });
});
