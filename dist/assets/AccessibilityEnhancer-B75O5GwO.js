import{r as h}from"./index-sjNF1scF.js";function g(){return h.useEffect(()=>{const r=()=>{if(!document.querySelector("#skip-links")){const e=document.createElement("div");e.id="skip-links",e.innerHTML=`
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
        `,document.body.insertBefore(e,document.body.firstChild)}},c=()=>{const e=document.createElement("style");e.textContent=`
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
      `,document.head.appendChild(e)},a=()=>{document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.querySelectorAll('[data-state="open"]').forEach(o=>{const n=o.querySelector("[data-dismiss]");n instanceof HTMLElement&&n.click()}),e.altKey&&e.key==="/"){e.preventDefault();const t=document.querySelector('input[type="search"]');t&&t.focus()}e.ctrlKey&&e.key==="Home"&&(e.preventDefault(),window.scrollTo({top:0,behavior:"smooth"}))})},u=()=>{if(!document.querySelector("#aria-live-region")){const e=document.createElement("div");e.id="aria-live-region",e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.className="sr-only",document.body.appendChild(e)}},d=()=>{const e=o=>{const n=document.querySelector("#aria-live-region");n&&(n.textContent=`Navigated to ${o} page`)},t=new MutationObserver(o=>{o.forEach(n=>{if(n.type==="childList"&&n.target===document.head){const i=document.querySelector("title");if(i){const s=i.textContent||"";s.includes("Resume Builder")?e("Resume Builder"):s.includes("Unsubscribe")?e("Unsubscribe"):e("Home")}}})});return t.observe(document.head,{childList:!0,subtree:!0}),()=>t.disconnect()},l=()=>{setTimeout(()=>{const e=document.querySelector("main");e&&!e.id&&(e.id="main-content",e.setAttribute("role","main"));const t=document.querySelector("nav");t&&!t.id&&(t.id="navigation",t.setAttribute("role","navigation"),t.setAttribute("aria-label","Main navigation"));const o=document.querySelector("footer");o&&!o.getAttribute("role")&&o.setAttribute("role","contentinfo"),document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((i,s)=>{i.id||(i.id=`heading-${s}`)})},100)};r(),c(),a(),u();const f=d();l();const m=(()=>{const e=window.matchMedia("(prefers-contrast: high)"),t=o=>{o.matches?document.documentElement.classList.add("high-contrast"):document.documentElement.classList.remove("high-contrast")};return e.addEventListener("change",t),t(e),()=>e.removeEventListener("change",t)})();return()=>{f(),m()}},[]),null}export{g as AccessibilityEnhancer};
