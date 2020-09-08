import { RULE_SET } from './domain_rules';

export class SearchEngine {
  constructor(url, searchEngine){
    this.domain = searchEngine.name;
    this.domain_rules = searchEngine.steps;
    this.selector = searchEngine.selector;
    this.url = url;
    this.secondaryPage = this.domain === 'yahoo' ? searchEngine.secondary : null;
  }

  stepThroughDOM(steps, tag){
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

  // navigateDOMToSource is for if the image source can be found without making
  // a request to another webpage like Google
  navigateDOMToSource(img_tag){
    if (this.domain !== 'yahoo' && !(img_tag.classList.contains(this.selector))) return null;

    let current_tag = this.stepThroughDOM(this.domain_rules, img_tag);

    return current_tag.href;
  }

  // this function currently works for yahoo, where the image source can be found on a secondary page
  requestToSecondaryPageForImageSource(){
    return fetch(url)
    .then(response => response.text())
    .then(html => {
      let imageTitle = html.match(/this.secondary.titleRegex/)[0];
      let imageURL = html.match(/this.secondary.urlRegex/)[0];
      return { imageTitle, imageURL };
    });
  }
}

export function identifyDomainInURL(url){
  for(const domain of RULE_SET['RuleSet']){
    const result = url.match(domain['regex']);
    if(result){
      return domain;
    }
  }
}
