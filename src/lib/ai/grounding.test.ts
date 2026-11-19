import { expect, it } from "vitest";
import { groundingPrompt, CLAUDE_MODEL } from "./grounding";
it("uses Claude and keeps the 70% versus 75% conflict unresolved", () => {
  expect(CLAUDE_MODEL).toBe("anthropic/claude-sonnet-5");
  const prompt = groundingPrompt();
  expect(prompt).toContain("70%");
  expect(prompt).toContain("75%");
  expect(prompt).toContain("لا تحسمه");
  expect(prompt).toContain("صفحة PDF 18");
});
