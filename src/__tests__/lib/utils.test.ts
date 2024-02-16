import * as utils from "@lib/utils";

describe("\n **utils", () => {
  describe("-> getStrAfter", () => {
    describe("when the second string is a substring of the first string", () => {
      const set = [
        ["hello world, how are you", 5] as const,
        ["hi there, how are you", 4] as const,
        ["Who is this? What is this? Why is this?", 10] as const,
      ];

      for (const data of set) {
        it("should return the string after the given string", () => {
          expect(
            utils.getStrAfter(data[0], data[0].slice(data[1], data[1] + 3))
          ).toBe(data[0].slice(data[1] + 3));
        });
      }
    });

    describe("when the second string is not a substring of the first string", () => {
      const set = [
        ["hello world, how are you", "null"] as const,
        ["hi there, how are you", "null"] as const,
        ["Who is this? What is this? Why is this?", "null"] as const,
      ];

      for (const data of set) {
        it("should return an empty string", () => {
          expect(utils.getStrAfter(data[0], data[1])).toBe("");
        });
      }
    });
  });
});
