/**
 * HTML/CSS Interview Challenges
 * 40 practical challenges testing HTML and CSS skills
 */

export type HtmlCssCategory = "Layout" | "Flexbox" | "Grid" | "Responsive" | "Styling" | "Forms" | "Animation" | "Accessibility";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface HtmlCssChallenge {
  id: string;
  challengeNumber: number;
  title: string;
  category: HtmlCssCategory;
  difficulty: Difficulty;
  description: string;
  requirements: string[];
  starterHtml: string;
  starterCss: string;
  solutionHtml: string;
  solutionCss: string;
  hints: string[];
  testCriteria: string[];
}

export const HTML_CSS_CHALLENGES: HtmlCssChallenge[] = [
  // ============ Layout (1-5) ============
  {
    id: "hc-1-center-div",
    challengeNumber: 1,
    title: "Center a Div",
    category: "Layout",
    difficulty: "Easy",
    description: "Center a div both horizontally and vertically within its parent container using CSS.",
    requirements: [
      "Center the .box element horizontally and vertically inside .container",
      "The .container should be 400px × 300px",
      "The .box should be 100px × 100px with a blue background"
    ],
    starterHtml: `<div class="container">
  <div class="box"></div>
</div>`,
    starterCss: `.container {
  width: 400px;
  height: 300px;
  border: 2px solid #333;
  /* Add your centering styles here */
}

.box {
  width: 100px;
  height: 100px;
  background: #3b82f6;
}`,
    solutionHtml: `<div class="container">
  <div class="box"></div>
</div>`,
    solutionCss: `.container {
  width: 400px;
  height: 300px;
  border: 2px solid #333;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  width: 100px;
  height: 100px;
  background: #3b82f6;
}`,
    hints: [
      "Flexbox makes centering easy with just a few properties",
      "Use display: flex on the container",
      "justify-content centers horizontally, align-items centers vertically"
    ],
    testCriteria: [
      "Container uses display: flex",
      "Box is centered both horizontally and vertically",
      "Container dimensions are correct"
    ]
  },
  {
    id: "hc-2-sticky-footer",
    challengeNumber: 2,
    title: "Sticky Footer",
    category: "Layout",
    difficulty: "Easy",
    description: "Create a layout where the footer sticks to the bottom of the viewport when content is short, but moves down when content is long.",
    requirements: [
      "Footer should stay at viewport bottom when content is short",
      "Footer should push down naturally when content exceeds viewport",
      "Use flexbox for the layout"
    ],
    starterHtml: `<div class="page">
  <header>Header</header>
  <main>Main Content</main>
  <footer>Footer</footer>
</div>`,
    starterCss: `.page {
  /* Add styles to make footer stick to bottom */
}

header {
  padding: 20px;
  background: #1e293b;
  color: white;
}

main {
  padding: 20px;
}

footer {
  padding: 20px;
  background: #334155;
  color: white;
}`,
    solutionHtml: `<div class="page">
  <header>Header</header>
  <main>Main Content</main>
  <footer>Footer</footer>
</div>`,
    solutionCss: `.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  padding: 20px;
  background: #1e293b;
  color: white;
}

main {
  padding: 20px;
  flex: 1;
}

footer {
  padding: 20px;
  background: #334155;
  color: white;
}`,
    hints: [
      "Set min-height: 100vh on the page container",
      "Use flex-direction: column",
      "Give main flex: 1 to fill available space"
    ],
    testCriteria: [
      "Page container has min-height: 100vh",
      "Uses flexbox with column direction",
      "Main content grows to fill space"
    ]
  },
  {
    id: "hc-3-holy-grail-layout",
    challengeNumber: 3,
    title: "Holy Grail Layout",
    category: "Layout",
    difficulty: "Medium",
    description: "Create the classic 'Holy Grail' layout with header, footer, main content, and two sidebars.",
    requirements: [
      "Header and footer span full width",
      "Left sidebar: 200px, Right sidebar: 150px",
      "Main content fills remaining space",
      "Equal height columns"
    ],
    starterHtml: `<div class="layout">
  <header>Header</header>
  <div class="content-wrapper">
    <aside class="left-sidebar">Left</aside>
    <main>Main Content</main>
    <aside class="right-sidebar">Right</aside>
  </div>
  <footer>Footer</footer>
</div>`,
    starterCss: `.layout {
  /* Your styles here */
}

header, footer {
  padding: 20px;
  background: #1e293b;
  color: white;
}

.content-wrapper {
  /* Your styles here */
}

.left-sidebar {
  background: #dbeafe;
  /* width: 200px */
}

main {
  padding: 20px;
  background: #f1f5f9;
}

.right-sidebar {
  background: #dcfce7;
  /* width: 150px */
}`,
    solutionHtml: `<div class="layout">
  <header>Header</header>
  <div class="content-wrapper">
    <aside class="left-sidebar">Left</aside>
    <main>Main Content</main>
    <aside class="right-sidebar">Right</aside>
  </div>
  <footer>Footer</footer>
</div>`,
    solutionCss: `.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header, footer {
  padding: 20px;
  background: #1e293b;
  color: white;
}

.content-wrapper {
  flex: 1;
  display: flex;
}

.left-sidebar {
  width: 200px;
  padding: 20px;
  background: #dbeafe;
}

main {
  flex: 1;
  padding: 20px;
  background: #f1f5f9;
}

.right-sidebar {
  width: 150px;
  padding: 20px;
  background: #dcfce7;
}`,
    hints: [
      "Use nested flexbox: column for the layout, row for content-wrapper",
      "Fixed widths for sidebars, flex: 1 for main",
      "content-wrapper needs flex: 1 to fill vertical space"
    ],
    testCriteria: [
      "Uses nested flexbox correctly",
      "Sidebars have correct fixed widths",
      "Main content fills remaining space"
    ]
  },
  {
    id: "hc-4-aspect-ratio-box",
    challengeNumber: 4,
    title: "Aspect Ratio Box",
    category: "Layout",
    difficulty: "Medium",
    description: "Create a responsive box that maintains a 16:9 aspect ratio regardless of container width.",
    requirements: [
      "Box maintains 16:9 aspect ratio",
      "Works at any container width",
      "Content should be positioned absolutely inside"
    ],
    starterHtml: `<div class="container">
  <div class="aspect-box">
    <div class="content">16:9 Content</div>
  </div>
</div>`,
    starterCss: `.container {
  width: 100%;
  max-width: 800px;
}

.aspect-box {
  background: #3b82f6;
  /* Maintain 16:9 aspect ratio */
}

.content {
  /* Position content inside */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}`,
    solutionHtml: `<div class="container">
  <div class="aspect-box">
    <div class="content">16:9 Content</div>
  </div>
</div>`,
    solutionCss: `.container {
  width: 100%;
  max-width: 800px;
}

.aspect-box {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #3b82f6;
}

.content {
  position: absolute;
  inset: 0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}`,
    hints: [
      "Modern CSS has aspect-ratio property",
      "Alternative: padding-top percentage trick (56.25% for 16:9)",
      "Content needs position: absolute with parent as relative"
    ],
    testCriteria: [
      "Uses aspect-ratio or padding trick",
      "Maintains ratio at different widths",
      "Content is properly positioned"
    ]
  },
  {
    id: "hc-5-overlay-layout",
    challengeNumber: 5,
    title: "Image Overlay Layout",
    category: "Layout",
    difficulty: "Easy",
    description: "Create an image card with a gradient overlay and text positioned at the bottom.",
    requirements: [
      "Image fills the card completely",
      "Semi-transparent gradient overlay from transparent to dark",
      "Text positioned at the bottom of the card"
    ],
    starterHtml: `<div class="card">
  <img src="https://picsum.photos/400/300" alt="Sample">
  <div class="overlay">
    <h3>Card Title</h3>
    <p>Card description text</p>
  </div>
</div>`,
    starterCss: `.card {
  width: 400px;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  /* Position relative for overlay */
}

.card img {
  /* Fill the card */
}

.overlay {
  /* Position at bottom with gradient */
  color: white;
  padding: 20px;
}

.overlay h3 {
  margin: 0 0 8px;
}

.overlay p {
  margin: 0;
  opacity: 0.9;
}`,
    solutionHtml: `<div class="card">
  <img src="https://picsum.photos/400/300" alt="Sample">
  <div class="overlay">
    <h3>Card Title</h3>
    <p>Card description text</p>
  </div>
</div>`,
    solutionCss: `.card {
  position: relative;
  width: 400px;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  padding: 40px 20px 20px;
}

.overlay h3 {
  margin: 0 0 8px;
}

.overlay p {
  margin: 0;
  opacity: 0.9;
}`,
    hints: [
      "Card needs position: relative",
      "Image needs object-fit: cover to fill without distortion",
      "Overlay uses position: absolute with bottom: 0"
    ],
    testCriteria: [
      "Image fills card with object-fit: cover",
      "Overlay positioned at bottom",
      "Gradient overlay is applied"
    ]
  },

  // ============ Flexbox (6-10) ============
  {
    id: "hc-6-navbar-flexbox",
    challengeNumber: 6,
    title: "Navigation Bar with Flexbox",
    category: "Flexbox",
    difficulty: "Easy",
    description: "Create a navigation bar with logo on the left and menu items on the right using Flexbox.",
    requirements: [
      "Logo on the left side",
      "Navigation links on the right side",
      "Items vertically centered",
      "Proper spacing between nav items"
    ],
    starterHtml: `<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>`,
    starterCss: `.navbar {
  padding: 16px 24px;
  background: #1e293b;
  /* Add flexbox styles */
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  /* Add flexbox styles */
}

.nav-links li a {
  color: #94a3b8;
  text-decoration: none;
  padding: 8px 16px;
}

.nav-links li a:hover {
  color: white;
}`,
    solutionHtml: `<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>`,
    solutionCss: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #1e293b;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.nav-links {
  display: flex;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links li a {
  color: #94a3b8;
  text-decoration: none;
  padding: 8px 16px;
}

.nav-links li a:hover {
  color: white;
}`,
    hints: [
      "Use justify-content: space-between to push items apart",
      "align-items: center for vertical centering",
      "nav-links also needs display: flex"
    ],
    testCriteria: [
      "Navbar uses display: flex",
      "Logo and links are on opposite sides",
      "Items are vertically centered"
    ]
  },
  {
    id: "hc-7-card-row-flexbox",
    challengeNumber: 7,
    title: "Responsive Card Row",
    category: "Flexbox",
    difficulty: "Medium",
    description: "Create a row of cards that wraps responsively and has equal heights.",
    requirements: [
      "Cards wrap to next line when space is limited",
      "All cards in a row have equal height",
      "Consistent gap between cards",
      "Cards should have min-width of 250px"
    ],
    starterHtml: `<div class="card-container">
  <div class="card">
    <h3>Card 1</h3>
    <p>Short content</p>
  </div>
  <div class="card">
    <h3>Card 2</h3>
    <p>This card has much more content to demonstrate equal heights across all cards in the row.</p>
  </div>
  <div class="card">
    <h3>Card 3</h3>
    <p>Medium content here</p>
  </div>
</div>`,
    starterCss: `.card-container {
  /* Add flexbox styles for wrapping row */
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  /* Add flex properties */
}

.card h3 {
  margin: 0 0 12px;
  color: #1e293b;
}

.card p {
  margin: 0;
  color: #64748b;
}`,
    solutionHtml: `<div class="card-container">
  <div class="card">
    <h3>Card 1</h3>
    <p>Short content</p>
  </div>
  <div class="card">
    <h3>Card 2</h3>
    <p>This card has much more content to demonstrate equal heights across all cards in the row.</p>
  </div>
  <div class="card">
    <h3>Card 3</h3>
    <p>Medium content here</p>
  </div>
</div>`,
    solutionCss: `.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 250px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card h3 {
  margin: 0 0 12px;
  color: #1e293b;
}

.card p {
  margin: 0;
  color: #64748b;
}`,
    hints: [
      "flex-wrap: wrap allows cards to wrap",
      "flex: 1 1 250px sets grow, shrink, and basis",
      "gap provides consistent spacing"
    ],
    testCriteria: [
      "Container uses flex-wrap: wrap",
      "Cards have appropriate flex property",
      "Gap is applied between cards"
    ]
  },
  {
    id: "hc-8-input-group",
    challengeNumber: 8,
    title: "Input Group with Addon",
    category: "Flexbox",
    difficulty: "Easy",
    description: "Create an input group with a prefix icon and a suffix button.",
    requirements: [
      "Icon on the left side of input",
      "Button on the right side",
      "Input fills remaining space",
      "All elements same height and aligned"
    ],
    starterHtml: `<div class="input-group">
  <span class="prefix">@</span>
  <input type="text" placeholder="username">
  <button class="suffix">Search</button>
</div>`,
    starterCss: `.input-group {
  max-width: 400px;
  /* Add flexbox styles */
}

.prefix {
  padding: 12px 16px;
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
  border-right: none;
  color: #64748b;
}

input {
  padding: 12px;
  border: 1px solid #cbd5e1;
  font-size: 16px;
  outline: none;
  /* Fill remaining space */
}

input:focus {
  border-color: #3b82f6;
}

.suffix {
  padding: 12px 20px;
  background: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
  border-left: none;
  cursor: pointer;
}`,
    solutionHtml: `<div class="input-group">
  <span class="prefix">@</span>
  <input type="text" placeholder="username">
  <button class="suffix">Search</button>
</div>`,
    solutionCss: `.input-group {
  display: flex;
  max-width: 400px;
}

.prefix {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
  border-right: none;
  border-radius: 6px 0 0 6px;
  color: #64748b;
}

input {
  flex: 1;
  padding: 12px;
  border: 1px solid #cbd5e1;
  font-size: 16px;
  outline: none;
}

input:focus {
  border-color: #3b82f6;
}

.suffix {
  padding: 12px 20px;
  background: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
  border-left: none;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
}`,
    hints: [
      "Container needs display: flex",
      "Input needs flex: 1 to grow",
      "Use border-radius only on outer corners"
    ],
    testCriteria: [
      "Uses display: flex",
      "Input grows with flex: 1",
      "Elements are visually connected"
    ]
  },
  {
    id: "hc-9-media-object",
    challengeNumber: 9,
    title: "Media Object Pattern",
    category: "Flexbox",
    difficulty: "Easy",
    description: "Create the classic media object pattern with an image on the left and content on the right.",
    requirements: [
      "Image fixed size on the left",
      "Content fills remaining space",
      "Content should not wrap under image",
      "Proper spacing between image and content"
    ],
    starterHtml: `<div class="media">
  <img src="https://i.pravatar.cc/80" alt="Avatar" class="media-image">
  <div class="media-content">
    <h4>John Doe</h4>
    <p>This is a comment or description text that can be quite long and should wrap within its container without going under the image.</p>
  </div>
</div>`,
    starterCss: `.media {
  /* Add flexbox styles */
}

.media-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.media-content {
  /* Fill remaining space */
}

.media-content h4 {
  margin: 0 0 8px;
  color: #1e293b;
}

.media-content p {
  margin: 0;
  color: #64748b;
  line-height: 1.5;
}`,
    solutionHtml: `<div class="media">
  <img src="https://i.pravatar.cc/80" alt="Avatar" class="media-image">
  <div class="media-content">
    <h4>John Doe</h4>
    <p>This is a comment or description text that can be quite long and should wrap within its container without going under the image.</p>
  </div>
</div>`,
    solutionCss: `.media {
  display: flex;
  gap: 16px;
}

.media-image {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.media-content {
  flex: 1;
  min-width: 0;
}

.media-content h4 {
  margin: 0 0 8px;
  color: #1e293b;
}

.media-content p {
  margin: 0;
  color: #64748b;
  line-height: 1.5;
}`,
    hints: [
      "flex-shrink: 0 prevents image from shrinking",
      "min-width: 0 on content allows text to wrap",
      "gap provides spacing between elements"
    ],
    testCriteria: [
      "Uses display: flex",
      "Image doesn't shrink",
      "Content wraps properly"
    ]
  },
  {
    id: "hc-10-flex-order",
    challengeNumber: 10,
    title: "Reorder Elements with Flexbox",
    category: "Flexbox",
    difficulty: "Medium",
    description: "Use flexbox order property to reorder elements visually without changing HTML.",
    requirements: [
      "Display items in order: C, A, B (using order property)",
      "HTML order should remain A, B, C",
      "Items should be in a row"
    ],
    starterHtml: `<div class="flex-container">
  <div class="item item-a">A</div>
  <div class="item item-b">B</div>
  <div class="item item-c">C</div>
</div>`,
    starterCss: `.flex-container {
  display: flex;
  gap: 16px;
}

.item {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
  border-radius: 8px;
}

.item-a {
  background: #ef4444;
  /* Add order */
}

.item-b {
  background: #22c55e;
  /* Add order */
}

.item-c {
  background: #3b82f6;
  /* Add order */
}`,
    solutionHtml: `<div class="flex-container">
  <div class="item item-a">A</div>
  <div class="item item-b">B</div>
  <div class="item item-c">C</div>
</div>`,
    solutionCss: `.flex-container {
  display: flex;
  gap: 16px;
}

.item {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
  border-radius: 8px;
}

.item-a {
  background: #ef4444;
  order: 2;
}

.item-b {
  background: #22c55e;
  order: 3;
}

.item-c {
  background: #3b82f6;
  order: 1;
}`,
    hints: [
      "Default order value is 0",
      "Lower order values appear first",
      "Use order: 1, 2, 3 to set C, A, B order"
    ],
    testCriteria: [
      "Uses order property",
      "Visual order is C, A, B",
      "HTML remains unchanged"
    ]
  },

  // ============ Grid (11-15) ============
  {
    id: "hc-11-basic-grid",
    challengeNumber: 11,
    title: "Basic Grid Layout",
    category: "Grid",
    difficulty: "Easy",
    description: "Create a simple 3-column grid with equal width columns.",
    requirements: [
      "3 equal-width columns",
      "Consistent gap between items",
      "Items should have a minimum height"
    ],
    starterHtml: `<div class="grid-container">
  <div class="grid-item">1</div>
  <div class="grid-item">2</div>
  <div class="grid-item">3</div>
  <div class="grid-item">4</div>
  <div class="grid-item">5</div>
  <div class="grid-item">6</div>
</div>`,
    starterCss: `.grid-container {
  /* Add grid styles */
}

.grid-item {
  background: #3b82f6;
  color: white;
  padding: 20px;
  text-align: center;
  font-size: 24px;
  border-radius: 8px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}`,
    solutionHtml: `<div class="grid-container">
  <div class="grid-item">1</div>
  <div class="grid-item">2</div>
  <div class="grid-item">3</div>
  <div class="grid-item">4</div>
  <div class="grid-item">5</div>
  <div class="grid-item">6</div>
</div>`,
    solutionCss: `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.grid-item {
  background: #3b82f6;
  color: white;
  padding: 20px;
  text-align: center;
  font-size: 24px;
  border-radius: 8px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}`,
    hints: [
      "Use display: grid",
      "grid-template-columns: repeat(3, 1fr) creates 3 equal columns",
      "gap sets spacing between grid items"
    ],
    testCriteria: [
      "Uses display: grid",
      "Has 3 equal columns",
      "Gap is applied"
    ]
  },
  {
    id: "hc-12-grid-areas",
    challengeNumber: 12,
    title: "Grid Template Areas",
    category: "Grid",
    difficulty: "Medium",
    description: "Create a page layout using named grid template areas.",
    requirements: [
      "Header spans full width at top",
      "Sidebar on left, main content on right",
      "Footer spans full width at bottom",
      "Use grid-template-areas"
    ],
    starterHtml: `<div class="page-grid">
  <header>Header</header>
  <aside>Sidebar</aside>
  <main>Main Content</main>
  <footer>Footer</footer>
</div>`,
    starterCss: `.page-grid {
  min-height: 100vh;
  /* Add grid with template areas */
}

header {
  background: #1e293b;
  color: white;
  padding: 20px;
  /* Assign to grid area */
}

aside {
  background: #e2e8f0;
  padding: 20px;
  /* Assign to grid area */
}

main {
  background: #f8fafc;
  padding: 20px;
  /* Assign to grid area */
}

footer {
  background: #334155;
  color: white;
  padding: 20px;
  /* Assign to grid area */
}`,
    solutionHtml: `<div class="page-grid">
  <header>Header</header>
  <aside>Sidebar</aside>
  <main>Main Content</main>
  <footer>Footer</footer>
</div>`,
    solutionCss: `.page-grid {
  display: grid;
  min-height: 100vh;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
}

header {
  grid-area: header;
  background: #1e293b;
  color: white;
  padding: 20px;
}

aside {
  grid-area: sidebar;
  background: #e2e8f0;
  padding: 20px;
}

main {
  grid-area: main;
  background: #f8fafc;
  padding: 20px;
}

footer {
  grid-area: footer;
  background: #334155;
  color: white;
  padding: 20px;
}`,
    hints: [
      "Define areas with grid-template-areas",
      "Use grid-area on each element",
      "Repeated area names span multiple cells"
    ],
    testCriteria: [
      "Uses grid-template-areas",
      "Each element has grid-area assigned",
      "Layout matches requirements"
    ]
  },
  {
    id: "hc-13-responsive-grid",
    challengeNumber: 13,
    title: "Auto-fit Responsive Grid",
    category: "Grid",
    difficulty: "Medium",
    description: "Create a grid that automatically adjusts columns based on available space.",
    requirements: [
      "Cards are minimum 250px wide",
      "Columns auto-fit to available space",
      "No media queries needed",
      "Consistent gap between cards"
    ],
    starterHtml: `<div class="auto-grid">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
  <div class="card">Card 6</div>
</div>`,
    starterCss: `.auto-grid {
  /* Use auto-fit or auto-fill with minmax */
}

.card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  font-size: 18px;
  color: #1e293b;
}`,
    solutionHtml: `<div class="auto-grid">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
  <div class="card">Card 6</div>
</div>`,
    solutionCss: `.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
  font-size: 18px;
  color: #1e293b;
}`,
    hints: [
      "auto-fit collapses empty tracks",
      "minmax(250px, 1fr) sets min and max widths",
      "Combines repeat() with auto-fit and minmax()"
    ],
    testCriteria: [
      "Uses auto-fit or auto-fill",
      "Uses minmax() for column sizing",
      "Grid is responsive without media queries"
    ]
  },
  {
    id: "hc-14-grid-spanning",
    challengeNumber: 14,
    title: "Grid Item Spanning",
    category: "Grid",
    difficulty: "Medium",
    description: "Create a grid where some items span multiple rows or columns.",
    requirements: [
      "Featured item spans 2 columns and 2 rows",
      "Regular items are 1x1",
      "6 columns total",
      "Consistent gap"
    ],
    starterHtml: `<div class="spanning-grid">
  <div class="item featured">Featured</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
  <div class="item">7</div>
  <div class="item">8</div>
</div>`,
    starterCss: `.spanning-grid {
  display: grid;
  /* Add columns and gap */
}

.item {
  background: #3b82f6;
  color: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  min-height: 100px;
}

.featured {
  background: #8b5cf6;
  /* Span 2 columns and 2 rows */
}`,
    solutionHtml: `<div class="spanning-grid">
  <div class="item featured">Featured</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
  <div class="item">7</div>
  <div class="item">8</div>
</div>`,
    solutionCss: `.spanning-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.item {
  background: #3b82f6;
  color: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  min-height: 100px;
}

.featured {
  background: #8b5cf6;
  grid-column: span 2;
  grid-row: span 2;
}`,
    hints: [
      "grid-column: span 2 spans 2 columns",
      "grid-row: span 2 spans 2 rows",
      "Can also use grid-column: 1 / 3 syntax"
    ],
    testCriteria: [
      "Featured item spans 2 columns",
      "Featured item spans 2 rows",
      "Grid has 6 columns"
    ]
  },
  {
    id: "hc-15-grid-masonry-like",
    challengeNumber: 15,
    title: "Pinterest-style Grid",
    category: "Grid",
    difficulty: "Hard",
    description: "Create a masonry-like layout where items have varying heights.",
    requirements: [
      "3 columns",
      "Items have varying heights",
      "Dense packing to fill gaps",
      "Responsive to container width"
    ],
    starterHtml: `<div class="masonry-grid">
  <div class="item tall">1 - Tall</div>
  <div class="item">2</div>
  <div class="item medium">3 - Medium</div>
  <div class="item">4</div>
  <div class="item tall">5 - Tall</div>
  <div class="item">6</div>
  <div class="item medium">7 - Medium</div>
  <div class="item">8</div>
</div>`,
    starterCss: `.masonry-grid {
  /* Grid with auto rows */
}

.item {
  background: #3b82f6;
  color: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tall {
  /* Span multiple rows */
}

.medium {
  /* Span some rows */
}`,
    solutionHtml: `<div class="masonry-grid">
  <div class="item tall">1 - Tall</div>
  <div class="item">2</div>
  <div class="item medium">3 - Medium</div>
  <div class="item">4</div>
  <div class="item tall">5 - Tall</div>
  <div class="item">6</div>
  <div class="item medium">7 - Medium</div>
  <div class="item">8</div>
</div>`,
    solutionCss: `.masonry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 60px;
  grid-auto-flow: dense;
  gap: 16px;
}

.item {
  background: #3b82f6;
  color: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-row: span 2;
}

.tall {
  grid-row: span 4;
}

.medium {
  grid-row: span 3;
}`,
    hints: [
      "grid-auto-rows sets row height",
      "grid-auto-flow: dense fills gaps",
      "Use grid-row: span N for heights"
    ],
    testCriteria: [
      "Uses grid-auto-rows",
      "Uses grid-auto-flow: dense",
      "Items have varying heights"
    ]
  },

  // ============ Responsive (16-20) ============
  {
    id: "hc-16-mobile-first",
    challengeNumber: 16,
    title: "Mobile-First Card",
    category: "Responsive",
    difficulty: "Easy",
    description: "Create a card that stacks vertically on mobile and horizontally on larger screens.",
    requirements: [
      "Stack image on top of content on mobile",
      "Side-by-side layout on screens 768px+",
      "Image should maintain aspect ratio",
      "Use min-width media query (mobile-first)"
    ],
    starterHtml: `<div class="responsive-card">
  <img src="https://picsum.photos/400/300" alt="Card image">
  <div class="card-content">
    <h3>Card Title</h3>
    <p>This is the card description that should appear below the image on mobile and beside it on larger screens.</p>
    <button>Learn More</button>
  </div>
</div>`,
    starterCss: `.responsive-card {
  max-width: 800px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  /* Mobile-first: vertical stack */
}

.responsive-card img {
  width: 100%;
  height: auto;
}

.card-content {
  padding: 24px;
}

.card-content h3 {
  margin: 0 0 12px;
  color: #1e293b;
}

.card-content p {
  margin: 0 0 16px;
  color: #64748b;
}

.card-content button {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Add media query for larger screens */`,
    solutionHtml: `<div class="responsive-card">
  <img src="https://picsum.photos/400/300" alt="Card image">
  <div class="card-content">
    <h3>Card Title</h3>
    <p>This is the card description that should appear below the image on mobile and beside it on larger screens.</p>
    <button>Learn More</button>
  </div>
</div>`,
    solutionCss: `.responsive-card {
  max-width: 800px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.responsive-card img {
  width: 100%;
  height: auto;
}

.card-content {
  padding: 24px;
}

.card-content h3 {
  margin: 0 0 12px;
  color: #1e293b;
}

.card-content p {
  margin: 0 0 16px;
  color: #64748b;
}

.card-content button {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

@media (min-width: 768px) {
  .responsive-card {
    display: flex;
  }

  .responsive-card img {
    width: 40%;
    object-fit: cover;
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}`,
    hints: [
      "Mobile styles first, no media query",
      "Use @media (min-width: 768px) for tablet+",
      "Add display: flex to card in media query"
    ],
    testCriteria: [
      "Uses mobile-first approach",
      "Media query at 768px or similar",
      "Layout changes from vertical to horizontal"
    ]
  },
  {
    id: "hc-17-responsive-typography",
    challengeNumber: 17,
    title: "Fluid Typography",
    category: "Responsive",
    difficulty: "Medium",
    description: "Create typography that scales smoothly between screen sizes using clamp().",
    requirements: [
      "Heading scales from 24px to 48px",
      "Body text scales from 14px to 18px",
      "Use clamp() for fluid scaling",
      "No media queries needed"
    ],
    starterHtml: `<article class="article">
  <h1>Fluid Typography Example</h1>
  <p>This paragraph demonstrates fluid typography that scales smoothly between different viewport sizes without using media queries.</p>
  <p>The text should be readable on both mobile and desktop while maintaining proportional scaling.</p>
</article>`,
    starterCss: `.article {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  color: #1e293b;
  line-height: 1.2;
  margin-bottom: 24px;
  /* Use clamp for fluid sizing */
}

p {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 16px;
  /* Use clamp for fluid sizing */
}`,
    solutionHtml: `<article class="article">
  <h1>Fluid Typography Example</h1>
  <p>This paragraph demonstrates fluid typography that scales smoothly between different viewport sizes without using media queries.</p>
  <p>The text should be readable on both mobile and desktop while maintaining proportional scaling.</p>
</article>`,
    solutionCss: `.article {
  max-width: 800px;
  margin: 0 auto;
  padding: clamp(16px, 4vw, 48px);
}

h1 {
  font-size: clamp(24px, 5vw, 48px);
  color: #1e293b;
  line-height: 1.2;
  margin-bottom: 24px;
}

p {
  font-size: clamp(14px, 2vw, 18px);
  color: #475569;
  line-height: 1.6;
  margin-bottom: 16px;
}`,
    hints: [
      "clamp(min, preferred, max)",
      "Use vw units for preferred value",
      "Test at various viewport sizes"
    ],
    testCriteria: [
      "Uses clamp() for font-size",
      "Has appropriate min and max values",
      "Scales smoothly without jumps"
    ]
  },
  {
    id: "hc-18-responsive-images",
    challengeNumber: 18,
    title: "Responsive Image Gallery",
    category: "Responsive",
    difficulty: "Medium",
    description: "Create an image gallery that adapts to different screen sizes.",
    requirements: [
      "1 column on mobile (<640px)",
      "2 columns on tablet (640px-1024px)",
      "3 columns on desktop (1024px+)",
      "Images maintain aspect ratio"
    ],
    starterHtml: `<div class="gallery">
  <img src="https://picsum.photos/400/300?1" alt="Image 1">
  <img src="https://picsum.photos/400/300?2" alt="Image 2">
  <img src="https://picsum.photos/400/300?3" alt="Image 3">
  <img src="https://picsum.photos/400/300?4" alt="Image 4">
  <img src="https://picsum.photos/400/300?5" alt="Image 5">
  <img src="https://picsum.photos/400/300?6" alt="Image 6">
</div>`,
    starterCss: `.gallery {
  /* Add responsive grid */
}

.gallery img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
}

/* Add media queries */`,
    solutionHtml: `<div class="gallery">
  <img src="https://picsum.photos/400/300?1" alt="Image 1">
  <img src="https://picsum.photos/400/300?2" alt="Image 2">
  <img src="https://picsum.photos/400/300?3" alt="Image 3">
  <img src="https://picsum.photos/400/300?4" alt="Image 4">
  <img src="https://picsum.photos/400/300?5" alt="Image 5">
  <img src="https://picsum.photos/400/300?6" alt="Image 6">
</div>`,
    solutionCss: `.gallery {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.gallery img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
}

@media (min-width: 640px) {
  .gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .gallery {
    grid-template-columns: repeat(3, 1fr);
  }
}`,
    hints: [
      "Start with single column for mobile",
      "Add breakpoints at 640px and 1024px",
      "Change grid-template-columns at each breakpoint"
    ],
    testCriteria: [
      "Uses CSS Grid",
      "Has breakpoints at 640px and 1024px",
      "Column count changes correctly"
    ]
  },
  {
    id: "hc-19-container-queries",
    challengeNumber: 19,
    title: "Container Queries",
    category: "Responsive",
    difficulty: "Hard",
    description: "Use container queries to make a card component respond to its container width.",
    requirements: [
      "Card layout changes based on container width",
      "Vertical layout when container < 400px",
      "Horizontal layout when container >= 400px",
      "Use @container queries"
    ],
    starterHtml: `<div class="container narrow">
  <article class="card">
    <img src="https://picsum.photos/300/200" alt="Card">
    <div class="card-body">
      <h3>Container Query Card</h3>
      <p>This card responds to its container, not the viewport.</p>
    </div>
  </article>
</div>

<div class="container wide">
  <article class="card">
    <img src="https://picsum.photos/300/200" alt="Card">
    <div class="card-body">
      <h3>Container Query Card</h3>
      <p>This card responds to its container, not the viewport.</p>
    </div>
  </article>
</div>`,
    starterCss: `.container {
  /* Define as container */
  padding: 16px;
  margin-bottom: 24px;
  background: #f1f5f9;
  border-radius: 8px;
}

.narrow { width: 300px; }
.wide { width: 500px; }

.card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card img {
  width: 100%;
  height: auto;
}

.card-body {
  padding: 16px;
}

.card-body h3 {
  margin: 0 0 8px;
}

.card-body p {
  margin: 0;
  color: #64748b;
}

/* Add container query */`,
    solutionHtml: `<div class="container narrow">
  <article class="card">
    <img src="https://picsum.photos/300/200" alt="Card">
    <div class="card-body">
      <h3>Container Query Card</h3>
      <p>This card responds to its container, not the viewport.</p>
    </div>
  </article>
</div>

<div class="container wide">
  <article class="card">
    <img src="https://picsum.photos/300/200" alt="Card">
    <div class="card-body">
      <h3>Container Query Card</h3>
      <p>This card responds to its container, not the viewport.</p>
    </div>
  </article>
</div>`,
    solutionCss: `.container {
  container-type: inline-size;
  padding: 16px;
  margin-bottom: 24px;
  background: #f1f5f9;
  border-radius: 8px;
}

.narrow { width: 300px; }
.wide { width: 500px; }

.card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card img {
  width: 100%;
  height: auto;
}

.card-body {
  padding: 16px;
}

.card-body h3 {
  margin: 0 0 8px;
}

.card-body p {
  margin: 0;
  color: #64748b;
}

@container (min-width: 400px) {
  .card {
    display: flex;
  }

  .card img {
    width: 40%;
    object-fit: cover;
  }

  .card-body {
    flex: 1;
  }
}`,
    hints: [
      "Use container-type: inline-size on parent",
      "Use @container instead of @media",
      "Query is based on container, not viewport"
    ],
    testCriteria: [
      "Uses container-type",
      "Uses @container query",
      "Cards adapt to their containers"
    ]
  },
  {
    id: "hc-20-responsive-table",
    challengeNumber: 20,
    title: "Responsive Data Table",
    category: "Responsive",
    difficulty: "Hard",
    description: "Create a table that transforms into a card-like layout on mobile.",
    requirements: [
      "Normal table layout on desktop (768px+)",
      "Card-style layout on mobile",
      "Show column headers as labels on mobile",
      "Use data attributes for mobile labels"
    ],
    starterHtml: `<table class="responsive-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
      <th>Department</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Name">John Doe</td>
      <td data-label="Role">Developer</td>
      <td data-label="Department">Engineering</td>
      <td data-label="Status">Active</td>
    </tr>
    <tr>
      <td data-label="Name">Jane Smith</td>
      <td data-label="Role">Designer</td>
      <td data-label="Department">Design</td>
      <td data-label="Status">Active</td>
    </tr>
  </tbody>
</table>`,
    starterCss: `.responsive-table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
}

td {
  color: #1e293b;
}

/* Add mobile styles */`,
    solutionHtml: `<table class="responsive-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
      <th>Department</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Name">John Doe</td>
      <td data-label="Role">Developer</td>
      <td data-label="Department">Engineering</td>
      <td data-label="Status">Active</td>
    </tr>
    <tr>
      <td data-label="Name">Jane Smith</td>
      <td data-label="Role">Designer</td>
      <td data-label="Department">Design</td>
      <td data-label="Status">Active</td>
    </tr>
  </tbody>
</table>`,
    solutionCss: `.responsive-table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
}

td {
  color: #1e293b;
}

@media (max-width: 767px) {
  .responsive-table thead {
    display: none;
  }

  .responsive-table tr {
    display: block;
    margin-bottom: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px 0;
  }

  .responsive-table td {
    display: flex;
    justify-content: space-between;
    border: none;
    padding: 8px 16px;
  }

  .responsive-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #64748b;
  }
}`,
    hints: [
      "Hide thead on mobile",
      "Make tr display: block as cards",
      "Use ::before with attr() for labels"
    ],
    testCriteria: [
      "Table headers hidden on mobile",
      "Rows become card-like blocks",
      "Data labels shown via ::before"
    ]
  },

  // ============ Styling (21-25) ============
  {
    id: "hc-21-custom-checkbox",
    challengeNumber: 21,
    title: "Custom Checkbox",
    category: "Styling",
    difficulty: "Medium",
    description: "Create a custom styled checkbox without JavaScript.",
    requirements: [
      "Hide default checkbox visually",
      "Custom styled box with checkmark",
      "Proper focus and hover states",
      "Keep checkbox accessible"
    ],
    starterHtml: `<label class="checkbox-label">
  <input type="checkbox" class="checkbox-input">
  <span class="checkbox-custom"></span>
  <span class="checkbox-text">Accept terms and conditions</span>
</label>`,
    starterCss: `.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.checkbox-input {
  /* Hide visually but keep accessible */
}

.checkbox-custom {
  width: 24px;
  height: 24px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  /* Add checked state styles */
}

.checkbox-text {
  color: #334155;
}`,
    solutionHtml: `<label class="checkbox-label">
  <input type="checkbox" class="checkbox-input">
  <span class="checkbox-custom"></span>
  <span class="checkbox-text">Accept terms and conditions</span>
</label>`,
    solutionCss: `.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  position: relative;
  width: 24px;
  height: 24px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  transition: all 0.2s;
}

.checkbox-custom::after {
  content: '';
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-input:checked + .checkbox-custom {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-input:checked + .checkbox-custom::after {
  display: block;
}

.checkbox-input:focus + .checkbox-custom {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.checkbox-label:hover .checkbox-custom {
  border-color: #3b82f6;
}

.checkbox-text {
  color: #334155;
}`,
    hints: [
      "Use position: absolute and opacity: 0 to hide input",
      "Create checkmark with ::after and border trick",
      "Use :checked + selector for checked state"
    ],
    testCriteria: [
      "Default checkbox hidden but accessible",
      "Custom checkmark appears when checked",
      "Focus state is visible"
    ]
  },
  {
    id: "hc-22-gradient-button",
    challengeNumber: 22,
    title: "Gradient Button with Hover Effect",
    category: "Styling",
    difficulty: "Easy",
    description: "Create a button with a gradient background that shifts on hover.",
    requirements: [
      "Gradient background from blue to purple",
      "Smooth gradient shift on hover",
      "Rounded corners and padding",
      "Subtle shadow"
    ],
    starterHtml: `<button class="gradient-btn">Get Started</button>`,
    starterCss: `.gradient-btn {
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  /* Add gradient and hover effect */
}`,
    solutionHtml: `<button class="gradient-btn">Get Started</button>`,
    solutionCss: `.gradient-btn {
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  background-size: 200% 200%;
  background-position: 0% 50%;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.gradient-btn:hover {
  background-position: 100% 50%;
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
  transform: translateY(-2px);
}

.gradient-btn:active {
  transform: translateY(0);
}`,
    hints: [
      "Use background-size larger than 100%",
      "Animate background-position on hover",
      "Add transform for depth effect"
    ],
    testCriteria: [
      "Has gradient background",
      "Gradient shifts on hover",
      "Has shadow and hover effect"
    ]
  },
  {
    id: "hc-23-glassmorphism-card",
    challengeNumber: 23,
    title: "Glassmorphism Card",
    category: "Styling",
    difficulty: "Medium",
    description: "Create a card with the popular glassmorphism effect.",
    requirements: [
      "Semi-transparent background",
      "Backdrop blur effect",
      "Subtle border",
      "Works over a colorful background"
    ],
    starterHtml: `<div class="glass-container">
  <div class="glass-card">
    <h3>Glassmorphism</h3>
    <p>A modern, semi-transparent design style with blur effects.</p>
    <button>Learn More</button>
  </div>
</div>`,
    starterCss: `.glass-container {
  min-height: 300px;
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-card {
  padding: 32px;
  border-radius: 16px;
  max-width: 320px;
  /* Add glassmorphism styles */
}

.glass-card h3 {
  margin: 0 0 12px;
  color: white;
}

.glass-card p {
  margin: 0 0 20px;
  color: rgba(255,255,255,0.8);
}

.glass-card button {
  padding: 10px 24px;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.2);
  color: white;
  border-radius: 8px;
  cursor: pointer;
}`,
    solutionHtml: `<div class="glass-container">
  <div class="glass-card">
    <h3>Glassmorphism</h3>
    <p>A modern, semi-transparent design style with blur effects.</p>
    <button>Learn More</button>
  </div>
</div>`,
    solutionCss: `.glass-container {
  min-height: 300px;
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-card {
  padding: 32px;
  border-radius: 16px;
  max-width: 320px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-card h3 {
  margin: 0 0 12px;
  color: white;
}

.glass-card p {
  margin: 0 0 20px;
  color: rgba(255,255,255,0.8);
}

.glass-card button {
  padding: 10px 24px;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.2);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.glass-card button:hover {
  background: rgba(255,255,255,0.3);
}`,
    hints: [
      "Use rgba for semi-transparent background",
      "backdrop-filter: blur() creates the frost effect",
      "Add -webkit- prefix for Safari"
    ],
    testCriteria: [
      "Uses semi-transparent background",
      "Uses backdrop-filter blur",
      "Has subtle border"
    ]
  },
  {
    id: "hc-24-neumorphism-button",
    challengeNumber: 24,
    title: "Neumorphism Button",
    category: "Styling",
    difficulty: "Medium",
    description: "Create a soft UI (neumorphic) button with pressed state.",
    requirements: [
      "Soft shadow effect on light background",
      "Appears raised from surface",
      "Appears pressed on :active state",
      "Subtle, not harsh shadows"
    ],
    starterHtml: `<div class="neu-container">
  <button class="neu-button">Click Me</button>
</div>`,
    starterCss: `.neu-container {
  padding: 60px;
  background: #e0e5ec;
  display: flex;
  justify-content: center;
}

.neu-button {
  padding: 16px 40px;
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  border: none;
  border-radius: 12px;
  background: #e0e5ec;
  cursor: pointer;
  /* Add neumorphic shadows */
}`,
    solutionHtml: `<div class="neu-container">
  <button class="neu-button">Click Me</button>
</div>`,
    solutionCss: `.neu-container {
  padding: 60px;
  background: #e0e5ec;
  display: flex;
  justify-content: center;
}

.neu-button {
  padding: 16px 40px;
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  border: none;
  border-radius: 12px;
  background: #e0e5ec;
  cursor: pointer;
  box-shadow:
    8px 8px 16px #bebebe,
    -8px -8px 16px #ffffff;
  transition: all 0.2s ease;
}

.neu-button:hover {
  color: #3b82f6;
}

.neu-button:active {
  box-shadow:
    inset 4px 4px 8px #bebebe,
    inset -4px -4px 8px #ffffff;
}`,
    hints: [
      "Use two box-shadows: dark and light",
      "Dark shadow bottom-right, light top-left",
      "Use inset shadows for pressed state"
    ],
    testCriteria: [
      "Has dual box-shadows",
      "Background matches container",
      "Active state has inset shadows"
    ]
  },
  {
    id: "hc-25-text-effects",
    challengeNumber: 25,
    title: "CSS Text Effects",
    category: "Styling",
    difficulty: "Medium",
    description: "Create various text effects using CSS only.",
    requirements: [
      "Gradient text effect",
      "Text with stroke outline",
      "Text shadow for depth",
      "No images or SVG"
    ],
    starterHtml: `<div class="text-effects">
  <h1 class="gradient-text">Gradient Text</h1>
  <h1 class="stroke-text">Outlined</h1>
  <h1 class="shadow-text">3D Shadow</h1>
</div>`,
    starterCss: `.text-effects {
  padding: 40px;
  background: #1e293b;
  text-align: center;
}

.text-effects h1 {
  font-size: 48px;
  font-weight: 900;
  margin: 24px 0;
}

.gradient-text {
  /* Add gradient text effect */
}

.stroke-text {
  /* Add stroke outline effect */
}

.shadow-text {
  /* Add 3D shadow effect */
}`,
    solutionHtml: `<div class="text-effects">
  <h1 class="gradient-text">Gradient Text</h1>
  <h1 class="stroke-text">Outlined</h1>
  <h1 class="shadow-text">3D Shadow</h1>
</div>`,
    solutionCss: `.text-effects {
  padding: 40px;
  background: #1e293b;
  text-align: center;
}

.text-effects h1 {
  font-size: 48px;
  font-weight: 900;
  margin: 24px 0;
}

.gradient-text {
  background: linear-gradient(90deg, #f472b6, #818cf8, #22d3ee);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stroke-text {
  color: transparent;
  -webkit-text-stroke: 2px #22d3ee;
}

.shadow-text {
  color: #f8fafc;
  text-shadow:
    1px 1px 0 #3b82f6,
    2px 2px 0 #3b82f6,
    3px 3px 0 #3b82f6,
    4px 4px 0 #3b82f6,
    5px 5px 10px rgba(0,0,0,0.5);
}`,
    hints: [
      "Gradient text: background-clip: text",
      "Outline: -webkit-text-stroke",
      "3D: multiple offset text-shadows"
    ],
    testCriteria: [
      "Gradient text uses background-clip",
      "Stroke text is outlined",
      "Shadow creates 3D effect"
    ]
  },

  // ============ Forms (26-30) ============
  {
    id: "hc-26-floating-label",
    challengeNumber: 26,
    title: "Floating Label Input",
    category: "Forms",
    difficulty: "Medium",
    description: "Create an input with a label that floats up when focused or filled.",
    requirements: [
      "Label starts inside the input",
      "Label moves up when input is focused",
      "Label stays up when input has value",
      "Smooth animation"
    ],
    starterHtml: `<div class="float-group">
  <input type="text" id="name" class="float-input" placeholder=" " required>
  <label for="name" class="float-label">Your Name</label>
</div>`,
    starterCss: `.float-group {
  position: relative;
  margin: 24px 0;
}

.float-input {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  background: transparent;
  /* Add focus styles */
}

.float-label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
  /* Add transition and float styles */
}`,
    solutionHtml: `<div class="float-group">
  <input type="text" id="name" class="float-input" placeholder=" " required>
  <label for="name" class="float-label">Your Name</label>
</div>`,
    solutionCss: `.float-group {
  position: relative;
  margin: 24px 0;
}

.float-input {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  background: white;
  transition: border-color 0.2s;
}

.float-input:focus {
  border-color: #3b82f6;
}

.float-label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
  background: white;
  padding: 0 4px;
  transition: all 0.2s ease;
}

.float-input:focus + .float-label,
.float-input:not(:placeholder-shown) + .float-label {
  top: 0;
  font-size: 12px;
  color: #3b82f6;
}`,
    hints: [
      "Use placeholder=' ' (space) trick",
      ":placeholder-shown detects empty state",
      "Position label absolute and transition top"
    ],
    testCriteria: [
      "Label moves on focus",
      "Label stays up when filled",
      "Uses :placeholder-shown selector"
    ]
  },
  {
    id: "hc-27-toggle-switch",
    challengeNumber: 27,
    title: "Toggle Switch",
    category: "Forms",
    difficulty: "Medium",
    description: "Create a toggle switch (like iOS) using only CSS.",
    requirements: [
      "Sliding toggle animation",
      "Different colors for on/off states",
      "Accessible (works with keyboard)",
      "No JavaScript needed"
    ],
    starterHtml: `<label class="toggle">
  <input type="checkbox" class="toggle-input">
  <span class="toggle-slider"></span>
</label>`,
    starterCss: `.toggle {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 30px;
  cursor: pointer;
}

.toggle-input {
  /* Hide but keep accessible */
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: #cbd5e1;
  border-radius: 30px;
  /* Add transition and knob */
}`,
    solutionHtml: `<label class="toggle">
  <input type="checkbox" class="toggle-input">
  <span class="toggle-slider"></span>
</label>`,
    solutionCss: `.toggle {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 30px;
  cursor: pointer;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: #cbd5e1;
  border-radius: 30px;
  transition: background 0.3s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  left: 3px;
  top: 3px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.toggle-input:checked + .toggle-slider {
  background: #22c55e;
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(26px);
}

.toggle-input:focus + .toggle-slider {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
}`,
    hints: [
      "Create the knob with ::before",
      "Use transform to move the knob",
      "Background changes on :checked"
    ],
    testCriteria: [
      "Knob slides on toggle",
      "Background color changes",
      "Has focus indicator"
    ]
  },
  {
    id: "hc-28-validation-states",
    challengeNumber: 28,
    title: "Form Validation Styling",
    category: "Forms",
    difficulty: "Easy",
    description: "Style form inputs to show valid and invalid states.",
    requirements: [
      "Red border and icon for invalid",
      "Green border and icon for valid",
      "Use :valid and :invalid selectors",
      "Error message shown for invalid"
    ],
    starterHtml: `<div class="form-field">
  <label for="email">Email Address</label>
  <input type="email" id="email" placeholder="name@example.com" required>
  <span class="error-message">Please enter a valid email</span>
</div>`,
    starterCss: `.form-field {
  max-width: 320px;
}

.form-field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #334155;
}

.form-field input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  /* Add validation styles */
}

.error-message {
  display: none;
  margin-top: 8px;
  font-size: 14px;
  color: #ef4444;
}`,
    solutionHtml: `<div class="form-field">
  <label for="email">Email Address</label>
  <input type="email" id="email" placeholder="name@example.com" required>
  <span class="error-message">Please enter a valid email</span>
</div>`,
    solutionCss: `.form-field {
  max-width: 320px;
}

.form-field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #334155;
}

.form-field input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.form-field input:focus {
  border-color: #3b82f6;
}

.form-field input:valid {
  border-color: #22c55e;
}

.form-field input:invalid:not(:placeholder-shown) {
  border-color: #ef4444;
}

.form-field input:invalid:not(:placeholder-shown) + .error-message {
  display: block;
}

.error-message {
  display: none;
  margin-top: 8px;
  font-size: 14px;
  color: #ef4444;
}`,
    hints: [
      "Use :valid and :invalid pseudo-classes",
      ":placeholder-shown prevents styling empty fields",
      "Adjacent sibling selector shows error message"
    ],
    testCriteria: [
      "Uses :valid and :invalid",
      "Colors change based on validity",
      "Error message appears for invalid"
    ]
  },
  {
    id: "hc-29-custom-select",
    challengeNumber: 29,
    title: "Custom Select Dropdown Styling",
    category: "Forms",
    difficulty: "Medium",
    description: "Style a native select element with a custom appearance.",
    requirements: [
      "Custom arrow icon",
      "Remove native dropdown arrow",
      "Consistent styling across browsers",
      "Focus state visible"
    ],
    starterHtml: `<div class="select-wrapper">
  <select class="custom-select">
    <option value="">Select an option</option>
    <option value="1">Option One</option>
    <option value="2">Option Two</option>
    <option value="3">Option Three</option>
  </select>
</div>`,
    starterCss: `.select-wrapper {
  position: relative;
  width: 280px;
}

.custom-select {
  width: 100%;
  padding: 14px 48px 14px 16px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  /* Remove native arrow and add custom */
}`,
    solutionHtml: `<div class="select-wrapper">
  <select class="custom-select">
    <option value="">Select an option</option>
    <option value="1">Option One</option>
    <option value="2">Option Two</option>
    <option value="3">Option Three</option>
  </select>
</div>`,
    solutionCss: `.select-wrapper {
  position: relative;
  width: 280px;
}

.custom-select {
  width: 100%;
  padding: 14px 48px 14px 16px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  outline: none;
  transition: border-color 0.2s;
}

.select-wrapper::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #64748b;
  pointer-events: none;
}

.custom-select:focus {
  border-color: #3b82f6;
}

.custom-select:hover {
  border-color: #cbd5e1;
}`,
    hints: [
      "Use appearance: none to remove native arrow",
      "Add custom arrow with ::after on wrapper",
      "pointer-events: none on arrow"
    ],
    testCriteria: [
      "Uses appearance: none",
      "Has custom arrow",
      "Focus state is visible"
    ]
  },
  {
    id: "hc-30-range-slider",
    challengeNumber: 30,
    title: "Custom Range Slider",
    category: "Forms",
    difficulty: "Hard",
    description: "Style a range input with custom track and thumb.",
    requirements: [
      "Custom track color and height",
      "Custom thumb shape and color",
      "Works in Chrome, Firefox, Safari",
      "Focus state visible"
    ],
    starterHtml: `<div class="range-container">
  <input type="range" min="0" max="100" value="50" class="custom-range">
</div>`,
    starterCss: `.range-container {
  width: 300px;
  padding: 20px 0;
}

.custom-range {
  width: 100%;
  /* Reset and add custom styles */
}`,
    solutionHtml: `<div class="range-container">
  <input type="range" min="0" max="100" value="50" class="custom-range">
</div>`,
    solutionCss: `.range-container {
  width: 300px;
  padding: 20px 0;
}

.custom-range {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: #e2e8f0;
  border-radius: 4px;
  outline: none;
}

/* Track - Chrome/Safari */
.custom-range::-webkit-slider-runnable-track {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
}

/* Track - Firefox */
.custom-range::-moz-range-track {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
}

/* Thumb - Chrome/Safari */
.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -8px;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
  transition: transform 0.15s;
}

/* Thumb - Firefox */
.custom-range::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: #3b82f6;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
}

.custom-range:hover::-webkit-slider-thumb {
  transform: scale(1.1);
}

.custom-range:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
}`,
    hints: [
      "Use vendor prefixes for cross-browser",
      "-webkit-slider-thumb and -moz-range-thumb",
      "Thumb needs margin-top to center on track"
    ],
    testCriteria: [
      "Custom track styling",
      "Custom thumb styling",
      "Uses vendor prefixes"
    ]
  },

  // Continue with Animation (31-35) and Accessibility (36-40)...
  // ============ Animation (31-35) ============
  {
    id: "hc-31-loading-spinner",
    challengeNumber: 31,
    title: "CSS Loading Spinner",
    category: "Animation",
    difficulty: "Easy",
    description: "Create a simple rotating loading spinner using CSS animations.",
    requirements: [
      "Circular shape with partial border",
      "Continuous rotation animation",
      "Smooth, consistent speed",
      "Customizable size and color"
    ],
    starterHtml: `<div class="spinner"></div>`,
    starterCss: `.spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  /* Add border and animation */
}`,
    solutionHtml: `<div class="spinner"></div>`,
    solutionCss: `.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}`,
    hints: [
      "Use border with one different color",
      "@keyframes with rotate transform",
      "animation: spin 1s linear infinite"
    ],
    testCriteria: [
      "Uses @keyframes",
      "Rotates continuously",
      "Has partial colored border"
    ]
  },
  {
    id: "hc-32-pulse-animation",
    challengeNumber: 32,
    title: "Pulsing Notification Dot",
    category: "Animation",
    difficulty: "Easy",
    description: "Create a notification dot with a pulsing animation effect.",
    requirements: [
      "Small colored dot",
      "Expanding ring animation",
      "Infinite loop",
      "Subtle, not distracting"
    ],
    starterHtml: `<div class="notification-dot"></div>`,
    starterCss: `.notification-dot {
  width: 12px;
  height: 12px;
  background: #ef4444;
  border-radius: 50%;
  position: relative;
  /* Add pulse animation */
}`,
    solutionHtml: `<div class="notification-dot"></div>`,
    solutionCss: `.notification-dot {
  width: 12px;
  height: 12px;
  background: #ef4444;
  border-radius: 50%;
  position: relative;
}

.notification-dot::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #ef4444;
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}`,
    hints: [
      "Use ::before for the expanding ring",
      "Animate scale and opacity",
      "Ring fades out as it expands"
    ],
    testCriteria: [
      "Has pulsing effect",
      "Uses ::before for animation",
      "Infinite animation loop"
    ]
  },
  {
    id: "hc-33-hover-card-animation",
    challengeNumber: 33,
    title: "Card Hover Animation",
    category: "Animation",
    difficulty: "Medium",
    description: "Create a card that lifts and reveals content on hover.",
    requirements: [
      "Card lifts up on hover",
      "Shadow increases on hover",
      "Hidden content slides up",
      "Smooth transitions"
    ],
    starterHtml: `<div class="animated-card">
  <img src="https://picsum.photos/300/200" alt="Card">
  <div class="card-info">
    <h3>Card Title</h3>
    <p>Description that appears on hover</p>
    <button>View More</button>
  </div>
</div>`,
    starterCss: `.animated-card {
  width: 300px;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  /* Add transition and hover styles */
}

.animated-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-info {
  padding: 20px;
  /* Initially hidden, slides up on hover */
}

.card-info h3 {
  margin: 0 0 8px;
}

.card-info p {
  margin: 0 0 12px;
  color: #64748b;
}

.card-info button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}`,
    solutionHtml: `<div class="animated-card">
  <img src="https://picsum.photos/300/200" alt="Card">
  <div class="card-info">
    <h3>Card Title</h3>
    <p>Description that appears on hover</p>
    <button>View More</button>
  </div>
</div>`,
    solutionCss: `.animated-card {
  position: relative;
  width: 300px;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.animated-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.animated-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s;
}

.animated-card:hover img {
  transform: scale(1.05);
}

.card-info {
  padding: 20px;
  transform: translateY(60px);
  opacity: 0;
  transition: transform 0.3s, opacity 0.3s;
}

.animated-card:hover .card-info {
  transform: translateY(0);
  opacity: 1;
}

.card-info h3 {
  margin: 0 0 8px;
}

.card-info p {
  margin: 0 0 12px;
  color: #64748b;
}

.card-info button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}`,
    hints: [
      "translateY(-8px) lifts the card",
      "Content starts with opacity: 0 and translateY",
      "Use transition on multiple properties"
    ],
    testCriteria: [
      "Card lifts on hover",
      "Shadow changes on hover",
      "Content animates in"
    ]
  },
  {
    id: "hc-34-skeleton-loading",
    challengeNumber: 34,
    title: "Skeleton Loading Animation",
    category: "Animation",
    difficulty: "Medium",
    description: "Create a skeleton loading placeholder with shimmer effect.",
    requirements: [
      "Gray placeholder shapes",
      "Shimmer/gradient animation",
      "Represents card content structure",
      "Smooth, subtle animation"
    ],
    starterHtml: `<div class="skeleton-card">
  <div class="skeleton-image"></div>
  <div class="skeleton-content">
    <div class="skeleton-title"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text short"></div>
  </div>
</div>`,
    starterCss: `.skeleton-card {
  width: 300px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.skeleton-image {
  height: 160px;
  background: #e2e8f0;
  /* Add shimmer animation */
}

.skeleton-content {
  padding: 16px;
}

.skeleton-title {
  height: 24px;
  width: 70%;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-text {
  height: 16px;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-text.short {
  width: 50%;
}`,
    solutionHtml: `<div class="skeleton-card">
  <div class="skeleton-image"></div>
  <div class="skeleton-content">
    <div class="skeleton-title"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text short"></div>
  </div>
</div>`,
    solutionCss: `.skeleton-card {
  width: 300px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.skeleton-image,
.skeleton-title,
.skeleton-text {
  background: linear-gradient(
    90deg,
    #e2e8f0 25%,
    #f1f5f9 50%,
    #e2e8f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-image {
  height: 160px;
}

.skeleton-content {
  padding: 16px;
}

.skeleton-title {
  height: 24px;
  width: 70%;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-text {
  height: 16px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-text.short {
  width: 50%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}`,
    hints: [
      "Use gradient with lighter color in middle",
      "Animate background-position",
      "background-size larger than element"
    ],
    testCriteria: [
      "Has shimmer animation",
      "Uses gradient background",
      "Represents content structure"
    ]
  },
  {
    id: "hc-35-typewriter-effect",
    challengeNumber: 35,
    title: "Typewriter Text Effect",
    category: "Animation",
    difficulty: "Hard",
    description: "Create a typewriter effect where text appears to be typed character by character.",
    requirements: [
      "Text reveals character by character",
      "Blinking cursor at the end",
      "Uses steps() for discrete animation",
      "CSS only, no JavaScript"
    ],
    starterHtml: `<h1 class="typewriter">Hello, World!</h1>`,
    starterCss: `.typewriter {
  font-family: monospace;
  font-size: 32px;
  /* Add typewriter animation */
}`,
    solutionHtml: `<h1 class="typewriter">Hello, World!</h1>`,
    solutionCss: `.typewriter {
  font-family: monospace;
  font-size: 32px;
  width: 0;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #333;
  animation:
    typing 2s steps(13) forwards,
    blink 0.7s step-end infinite;
}

@keyframes typing {
  to {
    width: 13ch;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}`,
    hints: [
      "Use width animation with steps()",
      "ch unit = width of character '0'",
      "border-right creates cursor"
    ],
    testCriteria: [
      "Uses steps() for typing effect",
      "Has blinking cursor",
      "Text reveals progressively"
    ]
  },

  // ============ Accessibility (36-40) ============
  {
    id: "hc-36-focus-visible",
    challengeNumber: 36,
    title: "Focus Visible Styles",
    category: "Accessibility",
    difficulty: "Easy",
    description: "Style focus states that only appear for keyboard navigation.",
    requirements: [
      "Clear focus indicator for keyboard users",
      "No focus ring on mouse click",
      "Use :focus-visible selector",
      "High contrast focus ring"
    ],
    starterHtml: `<div class="buttons">
  <button class="btn">Button 1</button>
  <button class="btn">Button 2</button>
  <a href="#" class="btn">Link Button</a>
</div>`,
    starterCss: `.buttons {
  display: flex;
  gap: 16px;
}

.btn {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  /* Add focus styles */
}

.btn:hover {
  background: #2563eb;
}`,
    solutionHtml: `<div class="buttons">
  <button class="btn">Button 1</button>
  <button class="btn">Button 2</button>
  <a href="#" class="btn">Link Button</a>
</div>`,
    solutionCss: `.buttons {
  display: flex;
  gap: 16px;
}

.btn {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  outline: none;
}

.btn:hover {
  background: #2563eb;
}

.btn:focus-visible {
  outline: 3px solid #1d4ed8;
  outline-offset: 2px;
}`,
    hints: [
      ":focus-visible only triggers for keyboard",
      "Use outline with offset for visibility",
      "Remove default outline with outline: none"
    ],
    testCriteria: [
      "Uses :focus-visible",
      "Has high contrast focus ring",
      "Focus appears on keyboard navigation"
    ]
  },
  {
    id: "hc-37-skip-link",
    challengeNumber: 37,
    title: "Skip to Content Link",
    category: "Accessibility",
    difficulty: "Easy",
    description: "Create a skip link that appears on focus for keyboard users.",
    requirements: [
      "Hidden by default",
      "Appears when focused",
      "Links to main content",
      "High visibility when shown"
    ],
    starterHtml: `<a href="#main-content" class="skip-link">Skip to main content</a>
<nav>Navigation links here...</nav>
<main id="main-content">
  <h1>Main Content</h1>
  <p>Page content goes here.</p>
</main>`,
    starterCss: `.skip-link {
  /* Hidden off-screen by default */
  /* Visible when focused */
}

nav {
  padding: 20px;
  background: #1e293b;
  color: white;
}

main {
  padding: 40px 20px;
}`,
    solutionHtml: `<a href="#main-content" class="skip-link">Skip to main content</a>
<nav>Navigation links here...</nav>
<main id="main-content">
  <h1>Main Content</h1>
  <p>Page content goes here.</p>
</main>`,
    solutionCss: `.skip-link {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: #1e293b;
  color: white;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 8px 8px;
  z-index: 1000;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
}

nav {
  padding: 20px;
  background: #1e293b;
  color: white;
}

main {
  padding: 40px 20px;
}`,
    hints: [
      "Position off-screen with negative top",
      "Move into view on :focus",
      "Use transform for centering"
    ],
    testCriteria: [
      "Hidden by default",
      "Appears on focus",
      "Links to main content"
    ]
  },
  {
    id: "hc-38-reduced-motion",
    challengeNumber: 38,
    title: "Respect Reduced Motion Preference",
    category: "Accessibility",
    difficulty: "Medium",
    description: "Create an animation that respects the user's reduced motion preference.",
    requirements: [
      "Animated element by default",
      "Animation disabled when prefers-reduced-motion",
      "Use @media query",
      "Instant state change instead of animation"
    ],
    starterHtml: `<button class="animated-btn">
  <span>Hover Me</span>
</button>`,
    starterCss: `.animated-btn {
  position: relative;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  background: #8b5cf6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
}

.animated-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.animated-btn:hover::before {
  width: 300px;
  height: 300px;
}

/* Add reduced motion styles */`,
    solutionHtml: `<button class="animated-btn">
  <span>Hover Me</span>
</button>`,
    solutionCss: `.animated-btn {
  position: relative;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  background: #8b5cf6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
}

.animated-btn span {
  position: relative;
  z-index: 1;
}

.animated-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.animated-btn:hover::before {
  width: 300px;
  height: 300px;
}

@media (prefers-reduced-motion: reduce) {
  .animated-btn::before {
    transition: none;
  }

  .animated-btn:hover::before {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}`,
    hints: [
      "Use @media (prefers-reduced-motion: reduce)",
      "Set transition: none for reduced motion",
      "Provide instant alternative"
    ],
    testCriteria: [
      "Uses prefers-reduced-motion query",
      "Disables animation when preferred",
      "Provides alternative visual feedback"
    ]
  },
  {
    id: "hc-39-color-contrast",
    challengeNumber: 39,
    title: "Accessible Color Contrast",
    category: "Accessibility",
    difficulty: "Easy",
    description: "Fix color contrast issues to meet WCAG AA standards.",
    requirements: [
      "Text must have 4.5:1 contrast ratio",
      "Large text needs 3:1 ratio",
      "Fix the low contrast colors",
      "Maintain visual appeal"
    ],
    starterHtml: `<div class="contrast-demo">
  <h1>Welcome to Our Site</h1>
  <p class="subtitle">Your journey starts here</p>
  <p class="body-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
  <a href="#" class="link">Learn more about us</a>
</div>`,
    starterCss: `.contrast-demo {
  padding: 40px;
  background: #f8fafc;
}

/* These colors have poor contrast - fix them */
h1 {
  color: #94a3b8; /* Too light for background */
  margin-bottom: 8px;
}

.subtitle {
  color: #cbd5e1; /* Too light */
  font-size: 18px;
  margin-bottom: 16px;
}

.body-text {
  color: #9ca3af; /* Too light */
  line-height: 1.6;
  margin-bottom: 16px;
}

.link {
  color: #93c5fd; /* Too light */
}`,
    solutionHtml: `<div class="contrast-demo">
  <h1>Welcome to Our Site</h1>
  <p class="subtitle">Your journey starts here</p>
  <p class="body-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
  <a href="#" class="link">Learn more about us</a>
</div>`,
    solutionCss: `.contrast-demo {
  padding: 40px;
  background: #f8fafc;
}

h1 {
  color: #1e293b; /* High contrast */
  margin-bottom: 8px;
}

.subtitle {
  color: #475569; /* Meets 4.5:1 */
  font-size: 18px;
  margin-bottom: 16px;
}

.body-text {
  color: #334155; /* Meets 4.5:1 */
  line-height: 1.6;
  margin-bottom: 16px;
}

.link {
  color: #1d4ed8; /* Meets 4.5:1 and looks like a link */
}

.link:hover {
  color: #1e40af;
}`,
    hints: [
      "Use contrast checker tools",
      "Darker colors on light backgrounds",
      "4.5:1 ratio for normal text"
    ],
    testCriteria: [
      "All text meets 4.5:1 ratio",
      "Colors are readable",
      "Visual hierarchy maintained"
    ]
  },
  {
    id: "hc-40-sr-only-class",
    challengeNumber: 40,
    title: "Screen Reader Only Content",
    category: "Accessibility",
    difficulty: "Easy",
    description: "Create a utility class for content visible only to screen readers.",
    requirements: [
      "Content hidden visually",
      "Content readable by screen readers",
      "Not using display: none or visibility: hidden",
      "Positioned off-screen"
    ],
    starterHtml: `<button class="icon-btn">
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
  <span class="sr-only">Open menu</span>
</button>

<div class="stats">
  <div class="stat">
    <span class="stat-number">1,234</span>
    <span class="sr-only">users registered</span>
  </div>
</div>`,
    starterCss: `.icon-btn {
  padding: 8px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.stats {
  margin-top: 20px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #1e293b;
}

/* Create the sr-only class */
.sr-only {
  /* Your styles here */
}`,
    solutionHtml: `<button class="icon-btn">
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
  <span class="sr-only">Open menu</span>
</button>

<div class="stats">
  <div class="stat">
    <span class="stat-number">1,234</span>
    <span class="sr-only">users registered</span>
  </div>
</div>`,
    solutionCss: `.icon-btn {
  padding: 8px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.stats {
  margin-top: 20px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #1e293b;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}`,
    hints: [
      "Don't use display: none (hides from SR too)",
      "Use clip and size tricks",
      "This is a common utility class pattern"
    ],
    testCriteria: [
      "Content visually hidden",
      "Uses position: absolute",
      "Uses clip or clip-path"
    ]
  }
];

// ============ Helper Functions ============

export function getHtmlCssChallengeById(id: string): HtmlCssChallenge | undefined {
  return HTML_CSS_CHALLENGES.find((c) => c.id === id);
}

export function getAllHtmlCssChallengeIds(): string[] {
  return HTML_CSS_CHALLENGES.map((c) => c.id);
}

export function getHtmlCssChallengesByCategory(category: HtmlCssCategory): HtmlCssChallenge[] {
  return HTML_CSS_CHALLENGES.filter((c) => c.category === category);
}

export function getHtmlCssChallengesByDifficulty(difficulty: Difficulty): HtmlCssChallenge[] {
  return HTML_CSS_CHALLENGES.filter((c) => c.difficulty === difficulty);
}

export function getAllHtmlCssCategories(): HtmlCssCategory[] {
  return ["Layout", "Flexbox", "Grid", "Responsive", "Styling", "Forms", "Animation", "Accessibility"];
}
