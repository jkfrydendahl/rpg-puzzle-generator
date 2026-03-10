import { describe, it, expect } from "vitest";
import { archetypes } from "../data/archetypes.js";
import { interfaces } from "../data/interfaces.js";
import { clueTypes } from "../data/clueTypes.js";
import { twists } from "../data/twists.js";
import { consequences } from "../data/consequences.js";
import { difficultyProfiles } from "../data/difficultyProfiles.js";

describe("seed data integrity", () => {
  it("all archetype interface references exist", () => {
    const interfaceIds = new Set(interfaces.map((i) => i.id));
    for (const arch of archetypes) {
      for (const iid of arch.compatibleInterfaceIds) {
        expect(interfaceIds.has(iid), `Archetype "${arch.id}" references missing interface "${iid}"`).toBe(true);
      }
    }
  });

  it("all archetype clue type references exist", () => {
    const clueIds = new Set(clueTypes.map((c) => c.id));
    for (const arch of archetypes) {
      for (const cid of arch.compatibleClueTypeIds) {
        expect(clueIds.has(cid), `Archetype "${arch.id}" references missing clue type "${cid}"`).toBe(true);
      }
    }
  });

  it("all archetype twist references exist", () => {
    const twistIds = new Set(twists.map((t) => t.id));
    for (const arch of archetypes) {
      for (const tid of arch.validTwistIds) {
        expect(twistIds.has(tid), `Archetype "${arch.id}" references missing twist "${tid}"`).toBe(true);
      }
    }
  });

  it("all archetype consequence references exist", () => {
    const consequenceIds = new Set(consequences.map((c) => c.id));
    for (const arch of archetypes) {
      for (const cid of arch.preferredConsequenceIds) {
        expect(consequenceIds.has(cid), `Archetype "${arch.id}" references missing consequence "${cid}"`).toBe(true);
      }
    }
  });

  it("interface archetype back-references are consistent", () => {
    const archetypeIds = new Set(archetypes.map((a) => a.id));
    for (const iface of interfaces) {
      for (const aid of iface.compatibleArchetypeIds) {
        expect(archetypeIds.has(aid), `Interface "${iface.id}" references missing archetype "${aid}"`).toBe(true);
      }
    }
  });

  it("clue type archetype back-references are consistent", () => {
    const archetypeIds = new Set(archetypes.map((a) => a.id));
    for (const clue of clueTypes) {
      for (const aid of clue.compatibleArchetypeIds) {
        expect(archetypeIds.has(aid), `Clue type "${clue.id}" references missing archetype "${aid}"`).toBe(true);
      }
    }
  });

  it("twist archetype back-references are consistent", () => {
    const archetypeIds = new Set(archetypes.map((a) => a.id));
    for (const twist of twists) {
      for (const aid of twist.compatibleArchetypeIds) {
        expect(archetypeIds.has(aid), `Twist "${twist.id}" references missing archetype "${aid}"`).toBe(true);
      }
    }
  });

  it("difficulty profiles cover all three levels", () => {
    const ids = difficultyProfiles.map((p) => p.id);
    expect(ids).toContain("easy");
    expect(ids).toContain("medium");
    expect(ids).toContain("hard");
  });

  it("consequence allowed difficulties reference valid profiles", () => {
    const validDifficulties = difficultyProfiles.map((p) => p.id as string);
    for (const c of consequences) {
      for (const d of c.allowedDifficulties) {
        expect(validDifficulties.includes(d), `Consequence "${c.id}" references invalid difficulty "${d}"`).toBe(true);
      }
    }
  });

  it("has at least 5 archetypes", () => {
    expect(archetypes.length).toBeGreaterThanOrEqual(5);
  });

  it("has at least 5 interfaces", () => {
    expect(interfaces.length).toBeGreaterThanOrEqual(5);
  });

  it("has at least 6 clue types", () => {
    expect(clueTypes.length).toBeGreaterThanOrEqual(6);
  });

  it("has at least 4 twists", () => {
    expect(twists.length).toBeGreaterThanOrEqual(4);
  });

  it("has at least 4 consequences", () => {
    expect(consequences.length).toBeGreaterThanOrEqual(4);
  });

  it("no duplicate IDs within any data set", () => {
    const checkUnique = (items: { id: string }[], name: string) => {
      const ids = items.map((i) => i.id);
      const unique = new Set(ids);
      expect(unique.size, `Duplicate IDs in ${name}`).toBe(ids.length);
    };

    checkUnique(archetypes, "archetypes");
    checkUnique(interfaces, "interfaces");
    checkUnique(clueTypes, "clueTypes");
    checkUnique(twists, "twists");
    checkUnique(consequences, "consequences");
  });
});
