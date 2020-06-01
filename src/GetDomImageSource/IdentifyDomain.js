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