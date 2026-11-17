import { describe, expect, it } from "vitest";
import { flattenCourseLessons } from "../course.server";
import { calculateGrade } from "../quiz.server";

describe("calculateGrade", () => {
  it.each([
    [1, "A"],
    [0.9, "A"],
    [0.89, "B"],
    [0.8, "B"],
    [0.79, "C"],
    [0.7, "C"],
    [0.69, "D"],
    [0.6, "D"],
    [0.59, "F"],
    [0, "F"],
  ])("grades a score of %s as %s", (score, grade) => {
    expect(calculateGrade(score)).toBe(grade);
  });
});

describe("flattenCourseLessons", () => {
  it("lists lessons in module order, each tagged with its module", () => {
    const flat = flattenCourseLessons({
      modules: [
        {
          id: 1,
          title: "Foundations",
          lessons: [
            { id: 10, title: "Why", moduleId: 1 },
            { id: 11, title: "Tokens", moduleId: 1 },
          ],
        },
        { id: 2, title: "Empty", lessons: [] },
        {
          id: 3,
          title: "Components",
          lessons: [{ id: 30, title: "Buttons", moduleId: 3 }],
        },
      ],
    });

    expect(flat).toEqual([
      { id: 10, title: "Why", moduleId: 1, moduleTitle: "Foundations" },
      { id: 11, title: "Tokens", moduleId: 1, moduleTitle: "Foundations" },
      { id: 30, title: "Buttons", moduleId: 3, moduleTitle: "Components" },
    ]);
  });

  it("returns nothing for a course with no modules", () => {
    expect(flattenCourseLessons({ modules: [] })).toEqual([]);
  });
});
