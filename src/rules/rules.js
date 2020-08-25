import { RULE_SET } from './domain_rules';

export function identifyDomainInURL(url){
  let source_domain = "'Not a search engine'";

  for(let domain of RULE_SET['RuleSet']){
    let result = url.match(domain['regex']);
    if(result){
      source_domain = domain;
      break;
    }
  }
  return source_domain;
}

// navigateDOMToSource is for if the image source can be found without making
// a request to another webpage like Google
export function navigateDOMToSource(domain_rules, img_tag){
  const selector = domain_rules["selector"];

  let current_tag = stepThroughDOM(domain_rules["steps"], img_tag);

  for(let select of selector){
    if(!select) break;
    const split = select.split(',');
    let element = split[0];
    let childIndex = split[1];
    current_tag = current_tag.querySelectorAll(element)[childIndex];
  }

  return current_tag.href;
}

export function stepThroughDOM(steps, tag){
  let current_tag = tag;
  for(let step of steps){
    switch(step){
      case "up":
        current_tag = current_tag.parentElement;
        break;
      case /down,\d+/:
        let index = step.split(",")[1];
        current_tag = current_tag.children[index];
        break;
      case "next":
        current_tag = current_tag.nextElementSibling;
        break;
      case "prev":
        current_tag = current_tag.previousElementSibling;
        break;
      case "MakeRequest":
        return [requestToSecondaryPageForImageSource(current_tag.href), ""];
    }
  }
  return current_tag;
}

// this function currently works for yahoo, where the image source can be found on a secondary page
export function requestToSecondaryPageForImageSource(url){
  return fetch(url)
  .then(response => response.text())
  .then(html => html.replace(/[\s\n]+/g, '').match(/(?<=<ahref=").*(?="class="site")/)[0]);
}