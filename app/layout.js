"use client";
import { useEffect, useState, useRef, useTransition } from "react";
import "../public/scss/main.scss";
import "../public/icons/icofont/icofont.min.css";
import "photoswipe/dist/photoswipe.css";
import "rc-slider/assets/index.css";
import { Toaster } from "react-hot-toast";
import HomesModal from "@/components/modals/HomesModal";
import Context from "@/context/Context";
import QuickView from "@/components/modals/QuickView";
import ProductSidebar from "@/components/modals/ProductSidebar";
import QuickAdd from "@/components/modals/QuickAdd";
import Compare from "@/components/modals/Compare";
import ShopCart from "@/components/modals/ShopCart";
import AskQuestion from "@/components/modals/AskQuestion";
import BlogSidebar from "@/components/modals/BlogSidebar";
import ColorCompare from "@/components/modals/ColorCompare";
import DeliveryReturn from "@/components/modals/DeliveryReturn";
import FindSize from "@/components/modals/FindSize";
import Login from "@/components/modals/Login";
import MobileMenu from "@/components/modals/MobileMenu";
import Register from "@/components/modals/Register";
import ResetPass from "@/components/modals/ResetPass";
import SearchModal from "@/components/modals/SearchModal";
import ToolbarBottom from "@/components/modals/ToolbarBottom";
import ToolbarShop from "@/components/modals/ToolbarShop";
import UserProfile from "@/components/modals/UserProfile";
import { usePathname, useRouter } from "next/navigation";
import NewsletterModal from "@/components/modals/NewsletterModal";
import ShareModal from "@/components/modals/ShareModal";
import ScrollTop from "@/components/common/ScrollTop";
import RtlToggle from "@/components/common/RtlToggle";
import store from "@/store";
import { Provider } from "react-redux";
import { getFreeShipping, auth } from "@/firebase/firebase.utils";
import {
  setFreeShippingRedux,
  setGuestRedux,
  setCurrentUserRedux,
  setCartRedux,
  setReduxWishlist,
} from "@/actions";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector } from "react-redux";
import AppNavigator from "./appNavigator";

const RootLayout = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Import the script only on the client side
      import("bootstrap/dist/js/bootstrap.esm").then(() => {
        // Module is imported, you can access any exported functionality if
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (window.scrollY > 100) {
        header.classList.add("header-bg");
      } else {
        header.classList.remove("header-bg");
      }
    };

    window.addEventListener("scroll", handleScroll);
    let getFreeship = async () => {
      let data = await getFreeShipping();
      store.dispatch(setFreeShippingRedux(data.value));
    };
    getFreeship();
    // Cleanup function to remove event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  const [scrollDirection, setScrollDirection] = useState("up");
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Scroll to the top when navigating to a new route
    window.scrollTo(0, 0);

    setScrollDirection("up");
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 250) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setScrollDirection("down");
        } else {
          // Scrolling up
          setScrollDirection("up");
        }
      } else {
        // Below 250px
        setScrollDirection("down");
      }

      lastScrollY.current = currentScrollY;
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    // Close any open modal
    const bootstrap = require("bootstrap"); // dynamically import bootstrap
    const modalElements = document.querySelectorAll(".modal.show");
    modalElements.forEach((modal) => {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    });

    // Close any open offcanvas
    const offcanvasElements = document.querySelectorAll(".offcanvas.show");
    offcanvasElements.forEach((offcanvas) => {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    });
  }, [pathname]); // Runs every time the route changes

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      if (scrollDirection == "up") {
        header.style.top = "0px";
      } else {
        header.style.top = "-185px";
      }
    }
  }, [scrollDirection]);
  useEffect(() => {
    const { WOW } = require("wowjs");
    const wow = new WOW({
      mobile: false,
      live: false,
    });
    wow.init();
  }, [pathname]);

  useEffect(() => {
    const initializeDirection = () => {
      const direction = localStorage.getItem("direction");

      if (direction) {
        const parsedDirection = JSON.parse(direction);
        document.documentElement.dir = parsedDirection.dir;
        document.body.classList.add(parsedDirection.dir);
      } else {
        document.documentElement.dir = "ltr";
      }

      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.classList.add("disabled");
      }
    };

    initializeDirection();
  }, []); // Only runs once on component mount

  return (
    <html lang="en">
      <body className="preload-wrapper">
        <div className="preload preload-container" id="preloader">
          <div className="preload-logo">
            {/* <div className="spinner"></div> */}
          </div>
        </div>{" "}
        <Provider store={store}>
          <AppNavigator children={children} />
        </Provider>
        <ScrollTop />
        <Toaster
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            style: {
              background: "black",
              color: "white",
            },

            // Default options for specific types
          }}
        />
      </body>
    </html>
  );
};

export default RootLayout;
