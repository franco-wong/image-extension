import ShadowDOMContainer from './ShadowDOMContainer';

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
 * Sidebar component with built-in logic and styles 
 */
export default class Sidebar extends ShadowDOMContainer {
  constructor() {
    super(SidebarStyles);
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
