import { fetchResourceString } from '../utility/helper';

/**
 * Base class meant for components to extend common functionality. Instances that will make use
 * of the Shadow DOM and inject markup with styles.
 */
export default class ShadowDOMContainer {
  constructor(containerStyles) {
    this.containerStyles = containerStyles
    this.hostNode = null;
    this.shadowRoot = null;
    this.container = null;
    this.isShown = false;
  }

  async init() {
    this.hostNode = document.createElement('div');
    this.shadowRoot = this.hostNode.attachShadow({ mode: 'open' });
    await this.injectStyles();
    await this.injectMarkup();
    document.body.insertBefore(this.hostNode, document.body.firstChild); // Inject webpage's DOM
  }

  async injectStyles() {
    Object.keys(this.containerStyles).forEach((key) => {
      this.hostNode.style[key] = this.containerStyles[key];
    });

    const styles = document.createElement('style');
    styles.textContent = await fetchResourceString('css/sidebar.css');
    this.shadowRoot.appendChild(styles);
  }

  async injectMarkup() {
    const parser = new DOMParser();
    const markupStr = await fetchResourceString('html/sidebar.html');
    const markup = parser.parseFromString(markupStr, 'text/html');
    this.container = markup.body.firstElementChild; // Keep reference of the container
    this.shadowRoot.appendChild(this.container);
  }
}