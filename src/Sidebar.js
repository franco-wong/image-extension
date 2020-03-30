const SidebarStyles = {
  backgroundColor: 'transparent',
  height: '100%',
  position: 'fixed',
  right: '0',
  top: '0',
  width: '400px',
  zIndex: '9000'
};

const SidebarAnimation = {
  frames: [
    { transform: 'translateX(100%)' },
    { transform: 'translateX(0)' }
  ],
  timing: {
    duration: 500,
    fill: "both",
    easing: "ease-in-out"
  }
} 

/**
 * TODO: Comments
 */
export default class Sidebar {
  constructor() {
    this.hostNode = null;
    this.shadowRoot = null;
    this.isShown = false;
    this.animation = null;
  }

  init() {
    this.hostNode = document.createElement('div');
    this.shadowRoot = this.hostNode.attachShadow({ mode: 'open' });
    this.applyStyles();
    document.body.insertBefore(this.hostNode, document.body.firstChild);
    this.isShown = true;
  }

  applyStyles() {
    Object.keys(SidebarStyles).forEach((key) => {
      this.hostNode.style[key] = SidebarStyles[key];
    });

    // TODO: Make XHR request for the html and styles and inject into container
    const parent = document.createElement('div');
    parent.setAttribute("id", "image-test");

    const styles = document.createElement('style');
    styles.textContent = `
      #image-test {
        background-color: black;
        height: 100%;
      }
    `;
    this.shadowRoot.appendChild(styles);
    this.shadowRoot.appendChild(parent);
    this.animation = parent.animate(SidebarAnimation.frames, SidebarAnimation.timing);
  }

  closeSidebar() {
    this.animation.reverse();
    this.isShown = false;
  }
}
