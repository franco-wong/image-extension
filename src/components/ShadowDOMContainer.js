import { fetchResourceString } from '../utility/helper';

export default class ShadowDOMContainer {
  constructor(containerStyles) {
    this.hostNode = null;
    this.shadowRoot = null;
    this.wrapper = null;
    this.isShown = false;
    this.containerStyles = containerStyles
  }

  init() {
    this.hostNode = document.createElement('div');
    this.shadowRoot = this.hostNode.attachShadow({ mode: 'open' });
    this.injectMarkup();
    this.injectStyles();

    // Inject into the webpage
    document.body.insertBefore(this.hostNode, document.body.firstChild);
  }

  async injectStyles() {
    Object.keys(this.containerStyles).forEach((key) => {
      this.hostNode.style[key] = this.containerStyles[key];
    });

    const styles = document.createElement('style');
    styles.textContent = await fetchResourceString('css/sidebar.css');
    this.shadowRoot.appendChild(styles);
  }

  injectMarkup() {
    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('id', 'image-sidebar')
    this.shadowRoot.appendChild(this.wrapper);
  }
}