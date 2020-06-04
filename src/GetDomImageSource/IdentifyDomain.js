import { RULE_SET } from './DomainRules';

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

export function navigateDOMToSource(domain_rules, img_tag){
  const steps = domain_rules["steps"];
  const selector = domain_rules["selector"];
  let current_tag = img_tag;
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
    }
  }
  for(let select of selector){
    if(!select) break;
    const split = select.split(',');
    let element = split[0];
    let childIndex = split[1];
    current_tag = current_tag.querySelectorAll(element)[childIndex];
  }

  return current_tag.href;
}