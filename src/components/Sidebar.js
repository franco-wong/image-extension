import ImageGallery from "../components/ImageGallery";

const SidebarStyles = {
  height: "100%",
  position: "fixed",
  right: "-400px",
  top: "0",
  width: "400px",
  zIndex: "9001",
  transition: "all 225ms ease-in-out 0ms",
};

/**
 * Sidebar component with built-in logic and styles
 */
export default class Sidebar {
  constructor(shadowDOMContainer) {
    this.shadowDOMContainer = shadowDOMContainer;
    this.imageGallery = new ImageGallery(shadowDOMContainer);
    this.isShown = false;
    this.inActiveElement = this.addInActiveBgElement();
  }

  /**
   * Initialize the markup, styles and other child components
   */
  async init(results) {
    await this.shadowDOMContainer.init(SidebarStyles);
    this.imageGallery.init(results);
  }

  /**
   * Dark background shade overlayed on the web page to add more focus to the sidebar
   */
  addInActiveBgElement() {
    const inActiveBgElement = document.createElement("div");

    inActiveBgElement.css({
      backgroundColor: "rgba(0, 0, 0)",
      bottom: "0",
      left: "0",
      opacity: "0",
      position: "fixed",
      right: "0",
      top: "0",
      transition: "all 225ms cubic-bezier(0.4, 0, 0.2, 1) 225ms",
      zIndex: "-1",
    });

    // Close the sidebar if the user clicks outside the sidebar's scope
    inActiveBgElement.addEventListener("click", () => {
      this.closeSidebar();
    });

    document.body.prepend(inActiveBgElement);

    return inActiveBgElement;
  }

  openSidebar() {
    this.isShown = true;
    // Open sidebar gallery
    this.shadowDOMContainer.hostNode.css({
      right: "0",
    });
    // Add a dark shadow to the webpage
    this.inActiveElement.css({
      opacity: "0.5",
      zIndex: "9000",
    });
  }

  closeSidebar() {
    this.isShown = false;
    // Close sidebar gallery
    this.shadowDOMContainer.hostNode.css({
      right: "-400px", // Width of the host node
    });
    // Remove webpage shadow
    this.inActiveElement.css({
      opacity: "0",
      zIndex: "-1",
    });
  }
}
