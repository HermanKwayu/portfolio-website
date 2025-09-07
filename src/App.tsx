import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Newsletter } from "./components/Newsletter";
import { Portfolio } from "./components/Portfolio";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { SEO } from "./components/SEO";
import { Analytics } from "./components/Analytics";
import { SitemapGenerator } from "./components/SitemapGenerator";
import { SEOOptimizer } from "./components/SEOOptimizer";
import { Unsubscribe } from "./components/Unsubscribe";

export default function App() {
  // Check for unsubscribe in URL - both path and parameters
  const urlParams = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname;
  
  // Debug logging for unsubscribe detection
  const hasUnsubscribeParam = urlParams.has('unsubscribe');
  const hasEmailAndId = urlParams.has('email') && urlParams.has('id');
  const pathIncludesUnsubscribe = pathname.includes('unsubscribe');
  
  // Log for debugging (remove in production)
  if (hasUnsubscribeParam || hasEmailAndId || pathIncludesUnsubscribe) {
    console.log('Unsubscribe detection:', {
      pathname,
      hasUnsubscribeParam,
      hasEmailAndId,
      pathIncludesUnsubscribe,
      searchParams: window.location.search
    });
  }
  
  const isUnsubscribeRequest = hasUnsubscribeParam || hasEmailAndId || pathIncludesUnsubscribe;

  if (isUnsubscribeRequest) {
    return (
      <div className="min-h-screen">
        <SEO />
        <Analytics />
        <Unsubscribe />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO />
      <Analytics />
      <SitemapGenerator />
      <SEOOptimizer />
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Newsletter />
        <Contact />
        <Portfolio />
        {/* Coming Soon - Adding client testimonials */}
        {/* <Testimonials /> */}
      </main>
      <Footer />
    </div>
  );
}