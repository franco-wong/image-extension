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

/**
 * google     => https://www.google.ca/search?q=snoopy&sxsrf=A...
 *            => /www\.google\.(ca|com)\/search\?.*tbm=isch/
 * 
 * yahoo      => https://ca.images.search.yahoo.com/search/ima...
 *            => /images\.search\.yahoo\.com\/search\/images/
 * 
 * pinterest  => https://www.pinterest.com/search/pins/?q=snoo...
 *            => /www\.pinterest\.ca\/search\/pins\/\?q=/
 * 
 * bing       => https://www.bing.com/images/search?q=snoopy&q...
 *            => /www\.bing\.com\/images\/search\?q=/
 */

export const RULE_SET = {
  RuleSet:
  [
    {
      'name':     "google",
      'regex':    /www\.google\.(ca|com)\/search\?.*tbm=isch/,
      "steps":    ["up", "up", "next"],
      "selector": [""]
    },
    {
      'name':     "bing",
      'regex':    /www\.bing\.com\/images\/search\?q=/,
      'steps':    [""],
      'selector': [""]
    },
    {
      'name':     "yahoo",
      'regex':    /images\.search\.yahoo\.com\/search\/images/,
      'steps':    [""],
      'selector': [""]
    },
    {
      'name':     "pinterest",
      'regex':    /www\.pinterest\.ca\/search\/pins\/\?q=/,
      'steps':    [""],
      'selector': [""]
    },
  ]
};