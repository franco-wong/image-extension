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
      'steps':    ["up", "up", "next"],
      'selector': ["Q4LuWd"]
      // only select image nodes that has the class name 'Q4LuWd'
      // OR
      // the top bar of images of the page has the class 'BcUvif'
      // the Related Search section (3 images) check to see if the image node has the class 'CBvv7vc'
    },
    {
      'name':     "bing",
      'regex':    /www\.bing\.com\/images\/search\?q=/,
      'steps':    ["up", "up"],
      'selector': ["mimg"],
      'secondary': {
        'titleRegex': '(?<=<a class="ptitle novid" title="View page" target="_blank" href=".*">).*(?=<\/a>)',
        'urlRegex': '(?<=<a class="ptitle novid" title="View page" target="_blank" href=").*(?=">.*<\/a>)'
      }
      // only select images that has the class name 'mimg'
      // 
    },
    {
      'name':     "yahoo",
      'regex':    /images\.search\.yahoo\.com\/search\/images/,
      'steps':    ["up"],
      'selector': [],
      'secondary': {
        'titleRegex': '(?<=<em class="title">).*(?=<\/em>)',
        'urlRegex': '(?<=<a href=").*(?=" class="site")'
      }
      // Once we get the response from the request, use class="site" to get a tag containing img source
      // check the node at the ["up", "up"] node has the class name 'ld'
      // OR
      // just select all images shown on the page
    },
  ]
};