import { fetchResourceString } from '../utility/helper';

const SidebarStyles = {
  backgroundColor: 'transparent',
  height: '100%',
  position: 'fixed',
  right: '0',
  top: '0',
  width: '400px',
  zIndex: '9000'
};

/**
 * TODO: Comments
 */
export default class Sidebar {
  constructor() {
    this.hostNode = null;
    this.shadowRoot = null;
    this.isShown = false;
    this.animation = null;
    this.wrapper = null;
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
    Object.keys(SidebarStyles).forEach((key) => {
      this.hostNode.style[key] = SidebarStyles[key];
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

  openSidebar() {
    this.wrapper.style.transition = "transform 1s ease-in-out";
    this.wrapper.style.transform = "translateX(0)";
    this.isShown = true;
  }
  
  closeSidebar() {
    this.wrapper.style.transform = "translateX(100%)";
    this.isShown = false;
  }
}
