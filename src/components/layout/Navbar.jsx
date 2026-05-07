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
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  const getHeaderHeight = useCallback(() => {
    return headerRef.current?.offsetHeight || 72;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToElement = useCallback(
    (elementId) => {
      const element = document.getElementById(elementId);

      if (element) {
        const headerHeight = getHeaderHeight();

        const elementPosition =
          element.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: elementPosition - headerHeight - 20,
          behavior: "smooth",
        });
      }
    },
    [getHeaderHeight]
  );

  const handleNavClick = useCallback(
    (e, link) => {
      e.preventDefault();

      setMobileOpen(false);
      setMobileDropdownOpen(false);

      if (link.isHash) {
        if (location.pathname !== "/") {
          navigate(`/#${link.elementId}`);

          setTimeout(() => {
            scrollToElement(link.elementId);
          }, 100);
        } else {
          scrollToElement(link.elementId);
        }
      } else {
        navigate(link.path);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    },
    [location.pathname, navigate, scrollToElement]
  );

  const isActive = useCallback(
    (link) => {
      if (link.isHash) {
        return location.hash === `#${link.elementId}`;
      }

      return location.pathname === link.path;
    },
    [location.pathname, location.hash]
  );

  const handleDownloadPDF = async () => {
    const pdfUrl = "/neom-profile.pdf";

    try {
      const response = await fetch(pdfUrl);

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "Neom_Hospitality_Profile.pdf";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }

    setMobileDropdownOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      {/* HEADER */}
      <nav
        ref={headerRef}
        className={`fixed left-0 right-0 z-50 transition-all duration-300
        ${
          scrolled
            ? "top-2 mx-auto w-[95%] lg:max-w-7xl bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl"
            : "top-0 bg-white border-b border-gray-100"
        }`}
      >
        <div className="px-3 sm:px-5 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-300
            ${scrolled ? "py-2" : "py-3"}
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

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-2 uppercase">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.isHash ? `/#${link.elementId}` : link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${
                    isActive(link)
                      ? "bg-sky-600 text-white"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-700"
                  }
                `}
                >
                  {link.label}
                </a>
              ))}

              <Button
                variant="outline"
                className="rounded-full border-sky-600 text-sky-700"
                onClick={handleDownloadPDF}
              >
                Downloads
              </Button>

              <Button
                asChild
                className="rounded-full bg-sky-600 hover:bg-sky-700"
              >
                <a href="/#contact">Request Quote</a>
              </Button>
            </div>

            {/* MOBILE BUTTON */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-sky-50"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-6 h-6 text-sky-700" />
              ) : (
                <Menu className="w-6 h-6 text-sky-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE + TABLET DRAWER */}
      <div
        className={`lg:hidden fixed z-40 transition-all duration-300
        ${
          mobileOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }
      `}
        style={{
          top: `${getHeaderHeight() + 8}px`,
          left: "50%",
          transform: mobileOpen
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(-10px)",
          width: "94%",
          maxHeight: "calc(100vh - 100px)",
        }}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
          <div className="p-4 overflow-y-auto">
            {/* LINKS */}
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.isHash ? `/#${link.elementId}` : link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl uppercase text-sm font-semibold transition-all
                  ${
                    isActive(link)
                      ? "bg-sky-100 text-sky-700"
                      : "text-gray-700 hover:bg-sky-50 hover:text-sky-700"
                  }
                `}
                >
                  {link.label}

                  {isActive(link) && (
                    <div className="w-2 h-2 rounded-full bg-sky-600" />
                  )}
                </a>
              ))}
            </div>

            {/* DOWNLOADS */}
            <div className="border-t border-gray-100 mt-4 pt-4">
              <button
                onClick={() =>
                  setMobileDropdownOpen(!mobileDropdownOpen)
                }
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl uppercase text-sm font-semibold text-gray-700 hover:bg-sky-50"
              >
                Downloads

                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300
                  ${mobileDropdownOpen ? "rotate-180" : ""}
                `}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300
                ${
                  mobileDropdownOpen
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }
              `}
              >
                <button
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center gap-2 px-6 py-3 rounded-xl text-sm text-gray-600 hover:bg-sky-50 hover:text-sky-700"
                >
                  <FileText className="w-4 h-4" />
                  Company Profile PDF
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-gray-100">
              <Button
                variant="outline"
                asChild
                className="rounded-xl border-sky-600 text-sky-700 h-11 uppercase text-xs"
              >
                <Link to="/products">Products</Link>
              </Button>

              <Button
                asChild
                className="rounded-xl bg-sky-600 hover:bg-sky-700 h-11 uppercase text-xs"
              >
                <a href="/#contact">Request Quote</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;









