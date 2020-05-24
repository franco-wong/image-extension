export function detectDomainInURL(url){
  
  /**
   * google     => https://www.google.ca/search?q=snoopy&sxsrf=A...
   *            => /google.ca\/search\?/g
   * 
   * yahoo      => https://ca.images.search.yahoo.com/search/ima...
   *            => /images.search.yahoo.com\/search/g
   * 
   * pinterest  => https://www.pinterest.com/search/pins/?q=snoo...
   *            => /pinterest.com\/search/g
   * 
   * bing       => https://www.bing.com/images/search?q=snoopy&q...
   *            => /bing.com\/images\/search\?/g
   */

  const domains = {
    "google":     /www\.google\.(ca|com)\/search\?.*tbm=isch/,
    "yahoo":      /images\.search\.yahoo\.com\/search\/images/,
    "pinterest":  /www\.pinterest\.ca\/search\/pins\/\?q=/,
    "bing":       /www\.bing\.com\/images\/search\?q=/,
  };

  let source_domain = "'Not a search engine'";

  for(let domain in domains){
    let result = url.match(domains[domain]);
    if(result){
      source_domain = domain;
      break;
    }
  }

  return source_domain;
}