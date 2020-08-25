/**
 * Steps:
 *    Allowable format
 *      -[]
 *    Allowable values
 *      -"up", "down,[number]", "next", "prev"
 *      - if value === down, split.(",") to extract the i-th child
 * 
 * Selector:
 *    Allowable format
 *      -[]
 *    Allowable values
 *      -"(tag)"
 *      -if there are multiple div or a tags, the format to clarify 'a,2'
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
      'steps':    ["up", "up", "MakeRequest"],
      'selector': [""]
      // 
    },
    {
      'name':     "yahoo",
      'regex':    /images\.search\.yahoo\.com\/search\/images/,
      'steps':    ["up", "MakeRequest"],
      'selector': [""] 
      // Once we get the response from the request, use class="site" to get a tag containing img source
    },
  ]
};