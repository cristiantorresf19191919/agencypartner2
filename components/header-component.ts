class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
    this.initializeEventListeners();
  }

  private render(): void {
    if (!this.shadowRoot) {
      return;
    }
    
    this.shadowRoot.innerHTML = `
      <style>
        /* Reset styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Header Styles */
        .header {
          width: 100%;
          background-color: transparent;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .sticky-header-wrapper {
          position: sticky !important;
          top: 0 !important;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.98);
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 600;
          text-decoration: none;
          color: #333;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 1001;
        }

        .logo i {
          color: #a06af9;
          margin-right: 0.5rem;
          transition: all 0.3s ease;
        }

        .nav-links {
          display: flex;
          gap: 1.5rem;
          list-style: none;
        }

        .nav-links li a {
          color: #333;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
          font-size: 0.95rem;
        }

        .nav-links li a:hover {
          color: #a06af9;
        }

        .gradient-link {
          position: relative;
          font-weight: 600 !important;
          background: linear-gradient(45deg, #a06af9, #ff7eb3);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: all 0.3s ease;
        }

        .gradient-link:hover {
          background: linear-gradient(45deg, #8a4af3, #ff5c8a);
          -webkit-background-clip: text;
          background-clip: text;
        }

        /* Mobile menu toggle button */
        .mobile-menu-toggle {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          z-index: 1001;
        }

        .hamburger-line {
          display: block;
          width: 25px;
          height: 3px;
          background-color: #a06af9;
          margin: 5px 0;
          border-radius: 3px;
          transition: all 0.3s ease;
        }

        /* Header wave */
        .header-wave-container {
          width: 100%;
          height: 50px;
          overflow: hidden;
          position: absolute;
          bottom: -50px;
          left: 0;
        }

        /* Dark mode styles */
        :host-context(body.dark-mode) .sticky-header-wrapper {
          background: rgba(28, 28, 35, 0.97);
        }

        :host-context(body.dark-mode) .logo {
          color: #fff;
        }

        :host-context(body.dark-mode) .nav-links li a {
          color: #e0e0e0;
        }

        :host-context(body.dark-mode) .hamburger-line {
          background-color: #a06af9;
        }

        /* Mobile menu styles */
        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 0;
          background-color: rgba(28, 28, 35, 0.98);
          z-index: 1000;
          overflow: hidden;
          transition: height 0s 0.6s;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .mobile-menu-overlay.active {
          height: 100%;
          transition: height 0s 0s;
        }

        .mobile-menu-content {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .mobile-menu-overlay.active .mobile-menu-content {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
        }

        .mobile-menu-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: transparent;
          border: none;
          font-size: 1.5rem;
          color: #fff;
          cursor: pointer;
        }

        .mobile-menu-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .logo-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a06af9, #ff7eb3);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          box-shadow: 0 4px 20px rgba(160, 106, 249, 0.5);
        }

        .mobile-menu-title {
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .mobile-menu-title h2 {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .mobile-menu-nav {
          margin-top: 2rem;
        }

        .mobile-menu-nav-item {
          margin-bottom: 1rem;
        }

        .mobile-menu-nav-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          text-decoration: none;
          color: #fff;
          transition: all 0.3s ease;
        }

        .mobile-menu-nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .mobile-menu-nav-content {
          display: flex;
          align-items: center;
        }

        .mobile-menu-nav-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #a06af9, #ff7eb3);
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 1rem;
          font-size: 1.2rem;
          color: #fff;
        }

        .mobile-menu-nav-text {
          display: flex;
          flex-direction: column;
        }

        .mobile-menu-nav-text .title {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .mobile-menu-nav-text .description {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .mobile-menu-nav-arrow {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .mobile-menu-theme-switcher {
          margin-top: 2rem;
        }

        @keyframes path-anim-index {
          0% {
            d: path("M0,150 C172.4,113.1,344.8,76.1,500,75 C655.2,73.9,793.2,108.5,947,127 C1100.8,145.5,1270.4,147.7,1440,150L1440,151L0,151Z");
          }
          25% {
            d: path("M0,150 C123.3,119.5,246.7,88.9,431,77 C615.3,65.1,860.7,71.7,1039,87 C1217.3,102.3,1328.7,126.1,1440,150L1440,151L0,151Z");
          }
          50% {
            d: path("M0,150 C131.7,168.4,263.5,186.8,432,188 C600.5,189.2,805.9,173.2,980,164 C1154.1,154.8,1297.1,152.4,1440,150L1440,151L0,151Z");
          }
          75% {
            d: path("M0,150 C171.6,149.5,343.2,148.9,500,141 C656.8,133.1,798.8,117.7,953,118 C1107.2,118.3,1273.6,134.1,1440,150L1440,151L0,151Z");
          }
          100% {
            d: path("M0,150 C172.4,113.1,344.8,76.1,500,75 C655.2,73.9,793.2,108.5,947,127 C1100.8,145.5,1270.4,147.7,1440,150L1440,151L0,151Z");
          }
        }

        .path-anim-index {
          animation: path-anim-index 10s linear infinite;
        }

        /* Responsive styles */
        @media (max-width: 992px) {
          .nav-links {
            display: none;
          }
          .mobile-menu-toggle {
            display: block;
          }
        }
      </style>

      <header class="header sticky-header-wrapper">
        <nav class="nav">
          <a href="index.html" class="logo">
            <i class="fas fa-code"></i> Optimus<strong>Agency</strong>
          </a>
          <ul class="nav-links">
            <slot name="nav-links"></slot>
          </ul>
          <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Abrir menú móvil">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </nav>
        <div class="header-wave-container">
          <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 150" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wave-gradient-index" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="5%" stop-color="#8e44ad"></stop>
                <stop offset="95%" stop-color="#e91e63"></stop>
              </linearGradient>
            </defs>
            <path
              d="M0,150 C172.4,113.1,344.8,76.1,500,75 C655.2,73.9,793.2,108.5,947,127 C1100.8,145.5,1270.4,147.7,1440,150L1440,151L0,151Z"
              stroke="none" stroke-width="0" fill="url(#wave-gradient-index)" class="path-anim-index"></path>
          </svg>
        </div>
      </header>

      <!-- Mobile Menu Overlay -->
      <div class="mobile-menu-overlay" id="mobile-menu-overlay">
        <div class="mobile-menu-content">
          <!-- Close button -->
          <button class="mobile-menu-close" id="mobile-menu-close" aria-label="Cerrar menú">
            <i class="fas fa-times"></i>
          </button>

          <!-- Logo section -->
          <div class="mobile-menu-logo">
            <div class="logo-container">
              <i class="fas fa-code" style="font-size: 3.5rem; position: relative; z-index: 1;"></i>
            </div>
          </div>

          <!-- Menu title -->
          <div class="mobile-menu-title">
            <h2>OptimusAgency</h2>
          </div>

          <!-- Navigation items -->
          <nav class="mobile-menu-nav">
            <slot name="mobile-nav-items"></slot>
          </nav>
        </div>
      </div>
    `;
  }

  private initializeEventListeners(): void {
    const mobileMenuToggle = this.shadowRoot.querySelector('#mobile-menu-toggle') as HTMLButtonElement | null;
    const mobileMenuClose = this.shadowRoot.querySelector('#mobile-menu-close') as HTMLButtonElement | null;
    const mobileMenuOverlay = this.shadowRoot.querySelector('#mobile-menu-overlay') as HTMLDivElement | null;

    if (!mobileMenuToggle || !mobileMenuClose || !mobileMenuOverlay) return;

    // Function to open mobile menu with animation
    const openMobileMenu = (e: MouseEvent): void => {
      e.stopPropagation();
      
      // Get toggle button position for animation origin
      const rect = mobileMenuToggle.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      
      // Set display and animation origin
      mobileMenuOverlay.style.display = 'flex';
      mobileMenuOverlay.style.clipPath = `circle(0px at ${originX}px ${originY}px)`;
      
      // Trigger animation after a small delay
      setTimeout(() => {
        mobileMenuOverlay.style.clipPath = `circle(150% at ${originX}px ${originY}px)`;
        mobileMenuOverlay.classList.add('active');
        mobileMenuToggle.classList.add('active');
      }, 10);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    };
    
    // Function to close mobile menu with animation
    const closeMobileMenu = (): void => {
      const rect = mobileMenuToggle.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      
      // Reverse the animation
      mobileMenuOverlay.style.clipPath = `circle(0px at ${originX}px ${originY}px)`;
      mobileMenuOverlay.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      
      // Hide overlay after animation
      setTimeout(() => {
        mobileMenuOverlay.style.display = 'none';
        document.body.style.overflow = '';
      }, 600);
    };

    // Event listeners
    mobileMenuToggle.addEventListener('click', openMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking outside
    mobileMenuOverlay.addEventListener('click', (e: MouseEvent) => {
      if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    // Close menu when clicking on nav links
    this.shadowRoot.querySelectorAll('.mobile-menu-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }
}

// Define the web component
customElements.define('header-component', HeaderComponent);

