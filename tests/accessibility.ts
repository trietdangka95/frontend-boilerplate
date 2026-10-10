import axe from "axe-core";

export async function getAccessibilityViolations(container: Element) {
  const results = await axe.run(container, {
    rules: {
      // JSDOM cannot calculate rendered contrast; the browser audit covers this rule.
      "color-contrast": { enabled: false },
    },
  });

  return results.violations.map(({ help, id, nodes }) => ({
    help,
    id,
    targets: nodes.map(({ target }) => target),
  }));
}
