import { RULE_SET } from './domain_rules';

export class SearchEngine {
  constructor(url, searchEngine) {
    this.domain = searchEngine.name;
    this.domain_rules = searchEngine.steps;
    this.selector = searchEngine.selector;
    this.url = url;

    if (this.domain === 'yahoo') {
      this.secondaryPage = searchEngine.secondary;
    } else {
      this.secondaryPage = null;
    }
  }

  stepThroughDOM(steps, tag) {
    let current_tag = tag;
    for (let step of steps) {
      switch (step) {
        case 'up':
          current_tag = current_tag.parentElement;
          break;
        case /down,\d+/:
          let index = step.split(',')[1];
          current_tag = current_tag.children[index];
          break;
        case 'next':
          current_tag = current_tag.nextElementSibling;
          break;
        case 'prev':
          current_tag = current_tag.previousElementSibling;
          break;
      }
    }
    return current_tag;
  }

  // navigateDOMToSource is for if the image source can be found without making
  // a request to another webpage like Google
  navigateDOMToSource(img_tag) {
    if (this.domain !== 'yahoo' && !img_tag.classList.contains(this.selector)) {
      return null;
    }

    let current_tag = this.stepThroughDOM(this.domain_rules, img_tag);
    return current_tag.href;
  }
}

export function identifyDomainInURL(url) {
  return RULE_SET.Rules.find((rule) => {
    return url.match(rule.regex);
  });
}
