/**
 * Steps:
 *    Allowable format
 *      -[]
 *    Allowable values
 *      -"up", "down", "next", "prev"
 * 
 * Selector:
 *    Allowable format
 *      -[]
 *    Allowable values
 *      -"(tag)"
 */

export const RULE_SET = {
  rule_set:
  `
  {
    "google":
    {
      "steps":    ["up", "up", "next"],
      "selector": ["a"]
    },
    "bing":
    {
      "steps":    ["up","up", next],
      "selector": ["div", "div", "a"]
    },
    "yahoo":
    {
      "steps":    ["up", "prev", "up"],
      "selector": ["div > a > href"]
    },
    "pinterest":
    {
      "steps":    ["next"],
      "selector": ["div > a"]
    }
  }
  `
};