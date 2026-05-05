import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../Ui/button";
import { Menu, X, ChevronDown, FileText } from "lucide-react";
import neomLogo from "../../assets/Neom-logo.jpg";

const navLinks = [
  { label: "Home", path: "/", isHash: false },
  { label: "About", path: "/about", isHash: true, elementId: "about" },
  { label: "Products", path: "/products", isHash: false },
  { label: "Contact", path: "/contact", isHash: true, elementId: "contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const getHeaderHeight = useCallback(() => {
    return headerRef.current?.offsetHeight || 70; // Reduced fallback
  }, []);

  const scrollToElement = useCallback((elementId) => {
    const checkAndScroll = () => {
      const element = document.getElementById(elementId);
      if (element) {
        const headerHeight = getHeaderHeight();
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - 20;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        window.history.replaceState(null, "", `/#${elementId}`);
        return true;
      }
      return false;
    };

    if (checkAndScroll()) return;
    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
      attempts++;
      if (checkAndScroll() || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [getHeaderHeight]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setDesktopDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const handleNavClick = useCallback((e, link) => {
    e.preventDefault();
    setMobileOpen(false);
    setDesktopDropdownOpen(false);
    setMobileDropdownOpen(false);

    if (link.isHash) {
      if (location.pathname !== "/") {
        navigate(`/#${link.elementId}`);
        setTimeout(() => scrollToElement(link.elementId), 100);
      } else {
        scrollToElement(link.elementId);
      }
    } else {
      navigate(link.path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, navigate, scrollToElement]);

  const isActive = useCallback((link) => {
    if (link.isHash) {
      return location.pathname === "/" && location.hash === `#${link.elementId}`;
    } else if (link.path === "/") {
      return location.pathname === "/" && (!location.hash || location.hash === "#home");
    }
    return location.pathname === link.path;
  }, [location.pathname, location.hash]);

  const handleDownloadPDF = async () => {
    const pdfUrl = "/neom-profile.pdf";
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      if (blob.size === 0) throw new Error("PDF is empty");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Neom_Hospitality_Profile.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      const fallback = document.createElement("a");
      fallback.href = pdfUrl;
      fallback.target = "_blank";
      fallback.rel = "noopener noreferrer";
      document.body.appendChild(fallback);
      fallback.click();
      document.body.removeChild(fallback);
    } finally {
      setDesktopDropdownOpen(false);
      setMobileDropdownOpen(false);
    }
  };

  const drawerStyle = {
    top: mobileOpen ? `${getHeaderHeight()}px` : '0px',
  };

  return (
    <>
      <nav
        ref={headerRef}
        className={`
          fixed left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] 
          ${scrolled 
              ? `
                 top-2 md:top-3 lg:top-4 
    mx-auto 
    w-[95%] md:w-[92%] lg:w-[95%] lg:max-w-7xl 
    bg-white/85 backdrop-blur-xl 
shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15),0_25px_40px_-8px_rgba(0,132,209,0.8)]
    border border-white/60 
    rounded-[3rem] md:rounded-[3rem] lg:rounded-[3rem]
  ` 
  : "top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100"
          }
        `}
        aria-label="Main navigation"
      >
        <div className="mx-auto px-1 sm:px-3 lg:px-4">
          <div 
            className={`
              flex items-center justify-between transition-all duration-300 
              ${scrolled ? "lg:py-1 py-1" : "lg:py-2 py-1.5"}  // REDUCED HEIGHT HERE
            `}
          >
            
{/* Logo Area - Reduced image height */}
<Link 
  to="/" 
  className="flex items-center gap-3 md:gap-4 group flex-shrink-0 max-w-[85%] sm:max-w-[90%] lg:max-w-full p-1 transition-all duration-300"
>
  <img
    src={neomLogo}
    alt="NEOM Hospitality Supplies"
    className="transition-all duration-500 h-auto object-contain flex-shrink-0"
    style={{ height: scrolled ? "60px" : "80px" }} 
  />
<div className="flex flex-col leading-tight min-w-0 w-full justify-center">

  {/* Arabic */}
 <span
  className="
     font-[Cairo] text-gray-900 block
    text-sm sm:text-base md:text-lg lg:text-3xl
    font-semibold
    scale-x-105 sm:scale-100
    pl-1 lg:pl-0
  "
  style={{
    WebkitTextStroke: "0.3px black",
  }}
>
  نيوم لمستلزمات الضيافة ذ.م.م
</span>

  {/* English */}
  <span
    className={` uppercase font-semibold truncate block leading-tight
      ${scrolled ? "opacity-90" : "opacity-100"}
      text-xs sm:text-sm md:text-base lg:text-2xl`}
  >
    Neom Hospitality Supplies LLC
  </span>



</div>
</Link>

            {/* Desktop Navigation - buttons smaller */}
            <div className="hidden uppercase lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.isHash ? `/#${link.elementId}` : link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className="relative px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-600 hover:text-white hover:bg-[#0084D1]"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA Buttons - height reduced */}
            <div className="hidden uppercase  lg:flex items-center gap-2 xl:gap-3 ml-2">
              <div 
                className="relative"
                onMouseEnter={() => {
                  if (window.innerWidth >= 1024) {
                    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                    setDesktopDropdownOpen(true);
                  }
                }}
                onMouseLeave={() => {
                  if (window.innerWidth >= 1024) {
                    closeTimerRef.current = setTimeout(() => setDesktopDropdownOpen(false), 200);
                  }
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full h-8 px-3 border-blue-00 text-sky-700 uppercase hover:bg-sky-50 flex items-center gap-1 text-xs whitespace-nowrap"
                  onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
                >
                  Downloads <ChevronDown className="h-3 w-3" />
                </Button>
                
                {desktopDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white/95 backdrop-blur-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-white/50">
                    <div className="py-1">
                      <button 
                        onClick={handleDownloadPDF} 
                        className="block w-full focus:ring-20 text-left px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 transition-colors flex items-center"
                      >
                        <FileText className="w-4 h-4 mr-2 text-sky-600" /> 
                        Company Profile PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                size="sm"
                asChild 
                className="rounded-full  h-8 px-3 border-sky-600 text-sky-700 hover:bg-sky-50 text-xs whitespace-nowrap"
              >
                <Link to="/products">View Products</Link>
              </Button>
              <Button 
                size="sm"
                asChild 
                className="rounded-full h-8 px-3 bg-sky-600 hover:bg-sky-700 text-white text-xs whitespace-nowrap shadow-lg shadow-sky-200"
              >
                <a href="/#contact">Request Quote</a>
              </Button>
            </div>

            {/* Mobile Menu Button (size unchanged but fits smaller header) */}
            <button
              className="lg:hidden p-2 -mr-2 rounded-md text-gray-600 hover:text-sky-700 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer - adjust top position */}
      <div 
        className={`
          lg:hidden fixed bg-white/95 backdrop-blur-xl 
          shadow-2xl overflow-hidden z-40
          transition-all duration-300 ease-in-out
          border border-white/50
          ${mobileOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"}
          ${scrolled 
            ? "left-1/2 -translate-x-1/2 w-[95%] rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)]" 
            : "left-0 right-0 top-0 rounded-none"
          }
        `}
        style={drawerStyle}
      >
        <div className="container mx-auto px-4 sm:px-6 flex flex-col gap-1 py-4 overflow-y-auto max-h-[85vh]">
          <div className="flex flex-col gap-1 mb-2">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.isHash ? `/#${link.elementId}` : link.path}
                onClick={(e) => handleNavClick(e, link)}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 flex items-center uppercase justify-between ${
                  isActive(link) 
                    ? "bg-sky-50 text-sky-700 border border-sky-100" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-sky-700"
                }`}
              >
                {link.label}
                {isActive(link) && <div className="w-1.5 h-1.5 rounded-full bg-sky-600" />}
              </a>
            ))}
          </div>

          <div className="border-t border-gray-100 my-2 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMobileDropdownOpen(!mobileDropdownOpen);
              }}
              className="flex uppercase items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-expanded={mobileDropdownOpen}
            >
              <span>Downloads</span>
              <ChevronDown className={`h-5 uppercase w-5 transition-transform duration-200 ${mobileDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileDropdownOpen ? "max-h-40 mt-1 opacity-100" : "max-h-0 opacity-0"}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadPDF();
                }}
                className="block w-full focus:outline-none focus:ring-0 text-left px-8 py-3 rounded-xl text-sm text-gray-600 hover:bg-sky-50 hover:text-sky-700 transition-colors flex items-center"
              >
                <FileText className="w-4 h-4 mr-2 text-sky-500" /> 
                Company Profile PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              size="default" 
              asChild 
              className="rounded-xl uppercase border-sky-600 text-sky-700 h-11 text-sm font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              <Link to="/products">Products</Link>
            </Button>
            <Button 
              size="default" 
              asChild 
              className="rounded-xl uppercase bg-sky-600 hover:bg-sky-700 h-11 text-sm font-semibold shadow-lg shadow-sky-200"
              onClick={() => setMobileOpen(false)}
            >
              <a href="/#contact">Request Quote</a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;