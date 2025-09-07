import { useEffect } from 'react';

export function AccessibilityEnhancer() {
  useEffect(() => {
    // Skip links for keyboard navigation
    const addSkipLinks = () => {
      if (!document.querySelector('#skip-links')) {
        const skipLinks = document.createElement('div');
        skipLinks.id = 'skip-links';
        skipLinks.innerHTML = `
          <a 
            href="#main-content" 
            class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded focus:shadow-lg"
          >
            Skip to main content
          </a>
          <a 
            href="#navigation" 
            class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded focus:shadow-lg"
          >
            Skip to navigation
          </a>
        `;
        document.body.insertBefore(skipLinks, document.body.firstChild);
      }
    };

    // Enhanced focus management
    const enhanceFocusManagement = () => {
      // Add focus outline to interactive elements
      const style = document.createElement('style');
      style.textContent = `
        .js-focus-visible :focus:not(.focus-visible) {
          outline: none;
        }
        
        .js-focus-visible .focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        @media (prefers-contrast: high) {
          :root {
            --primary: #000000;
            --background: #ffffff;
            --foreground: #000000;
            --border: #000000;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Keyboard navigation enhancements
    const enhanceKeyboardNavigation = () => {
      document.addEventListener('keydown', (e) => {
        // Escape key to close modals/menus
        if (e.key === 'Escape') {
          const openSheets = document.querySelectorAll('[data-state="open"]');
          openSheets.forEach(sheet => {
            const closeButton = sheet.querySelector('[data-dismiss]');
            if (closeButton instanceof HTMLElement) {
              closeButton.click();
            }
          });
        }

        // Alt + / for search or help
        if (e.altKey && e.key === '/') {
          e.preventDefault();
          const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }

        // Ctrl + Home to go to top
        if (e.ctrlKey && e.key === 'Home') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    };

    // Screen reader announcements
    const addAriaLiveRegion = () => {
      if (!document.querySelector('#aria-live-region')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
      }
    };

    // Announce route changes
    const announceRouteChanges = () => {
      const announceRouteChange = (routeName: string) => {
        const liveRegion = document.querySelector('#aria-live-region');
        if (liveRegion) {
          liveRegion.textContent = `Navigated to ${routeName} page`;
        }
      };

      // Listen for route changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.target === document.head) {
            const titleElement = document.querySelector('title');
            if (titleElement) {
              const title = titleElement.textContent || '';
              if (title.includes('Resume Builder')) {
                announceRouteChange('Resume Builder');
              } else if (title.includes('Unsubscribe')) {
                announceRouteChange('Unsubscribe');
              } else {
                announceRouteChange('Home');
              }
            }
          }
        });
      });

      observer.observe(document.head, { childList: true, subtree: true });

      return () => observer.disconnect();
    };

    // Add ARIA landmarks
    const addAriaLandmarks = () => {
      setTimeout(() => {
        // Add main landmark
        const main = document.querySelector('main');
        if (main && !main.id) {
          main.id = 'main-content';
          main.setAttribute('role', 'main');
        }

        // Add navigation landmark
        const nav = document.querySelector('nav');
        if (nav && !nav.id) {
          nav.id = 'navigation';
          nav.setAttribute('role', 'navigation');
          nav.setAttribute('aria-label', 'Main navigation');
        }

        // Add footer landmark
        const footer = document.querySelector('footer');
        if (footer && !footer.getAttribute('role')) {
          footer.setAttribute('role', 'contentinfo');
        }

        // Add heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
          if (!heading.id) {
            heading.id = `heading-${index}`;
          }
        });
      }, 100);
    };

    // Initialize all enhancements
    addSkipLinks();
    enhanceFocusManagement();
    enhanceKeyboardNavigation();
    addAriaLiveRegion();
    const cleanupRouteAnnouncer = announceRouteChanges();
    addAriaLandmarks();

    // High contrast mode detection and handling
    const handleHighContrastMode = () => {
      const mediaQuery = window.matchMedia('(prefers-contrast: high)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add('high-contrast');
        } else {
          document.documentElement.classList.remove('high-contrast');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      handleChange(mediaQuery as any); // Initial check

      return () => mediaQuery.removeEventListener('change', handleChange);
    };

    const cleanupHighContrast = handleHighContrastMode();

    // Cleanup
    return () => {
      cleanupRouteAnnouncer();
      cleanupHighContrast();
    };
  }, []);

  return null; // This component doesn't render anything
}