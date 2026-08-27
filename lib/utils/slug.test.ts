import { describe, expect, it } from "vitest";
import { createSlug } from "./slug";

describe("createSlug", () => {
  it("lowercases and hyphenates a simple name", () => {
    expect(createSlug("Ma Boutique")).toBe("ma-boutique");
  });

  it("strips accents", () => {
    expect(createSlug("Épicerie Générale")).toBe("epicerie-generale");
  });

  it("collapses non-alphanumeric characters into single hyphens", () => {
    expect(createSlug("Tissus & Co.  ---  Bazin")).toBe("tissus-co-bazin");
  });

  it("trims leading and trailing hyphens", () => {
    expect(createSlug("--Fillo Store--")).toBe("fillo-store");
  });

  it("falls back to a default slug when nothing alphanumeric remains", () => {
    expect(createSlug("!!!")).toBe("ma-boutique");
    expect(createSlug("")).toBe("ma-boutique");
  });
});
