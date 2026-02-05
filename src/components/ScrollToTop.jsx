import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop({ behavior = "smooth" }) {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  }, [location.pathname, behavior]);

  return null;
}

export default ScrollToTop;
