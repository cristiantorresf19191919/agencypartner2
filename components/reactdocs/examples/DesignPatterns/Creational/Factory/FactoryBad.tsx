// ❌ The Bad Way (Direct Instantiation)
// Components directly create instances, making them tightly coupled

import React from "react";

// ❌ Problem: Components directly instantiate classes
class Button {
  render() {
    return <button>Button</button>;
  }
}

class IconButton {
  render() {
    return <button>🔘 Icon Button</button>;
  }
}

class LinkButton {
  render() {
    return <a>Link Button</a>;
  }
}

// ❌ Components need to know which class to instantiate
const ComponentA = () => {
  const button = new Button(); // Tightly coupled
  return button.render();
};

const ComponentB = () => {
  const button = new IconButton(); // Different component, different logic
  return button.render();
};

// ❌ If we want to change button type, we have to modify the component
const DynamicComponent = ({ type }: { type: string }) => {
  // ❌ Lots of if/else logic
  if (type === "button") {
    return new Button().render();
  } else if (type === "icon") {
    return new IconButton().render();
  } else if (type === "link") {
    return new LinkButton().render();
  }
  return null;
};

