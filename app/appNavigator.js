"use client";
import { useEffect, useState, useRef } from "react";
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
import { usePathname } from "next/navigation";
import NewsletterModal from "@/components/modals/NewsletterModal";
import ShareModal from "@/components/modals/ShareModal";
import ScrollTop from "@/components/common/ScrollTop";
import RtlToggle from "@/components/common/RtlToggle";
import store from "@/store";
import { Provider } from "react-redux";
import { auth, createUserProfileDocument } from "@/firebase/firebase.utils";
import {
  setGuestRedux,
  setCurrentUserRedux,
  setCartRedux,
  setReduxWishlist,
  setAdditionalDataRedux,
} from "@/actions";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { connect } from "react-redux";

const db = getFirestore();

const AppNavigator = ({
  children,
  additionalData,
  setGuestRedux,
  setCartRedux,
  setReduxWishlist,
  setCurrentUserRedux,
  setAdditionalDataRedux,
}) => {
  const additionalData2 = useRef(additionalData);
  useEffect(() => {
    if (additionalData && additionalData.displayName) {
      additionalData2.current = additionalData;
    }
  }, [additionalData]);

  // Empty dependency array means this effect runs once on mount and cleans up on unmount

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (userAuth) => {
      onAuthStateChanged2(userAuth);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  const onAuthStateChanged2 = async (user) => {
    console.log("onAuth state changed is getting called!");
    if (user) {
      const userRef = await createUserProfileDocument(
        user,
        additionalData2.current
      );

      if (userRef) {
        onSnapshot(userRef, (snapShot) => {
          setCurrentUserRedux({
            id: snapShot.id,
            ...snapShot.data(),
          });
          setAdditionalDataRedux({});
        });
        const cartRef = doc(db, `carts/${user.uid}`);
        onSnapshot(cartRef, (snapShot) => {
          if (snapShot.exists()) {
            setCartRedux(snapShot.data().cart);
          }
        });
        const wishlistRef = doc(db, `wishlists/${user.uid}`);
        onSnapshot(wishlistRef, (snapShot) => {
          if (snapShot.exists()) {
            setReduxWishlist(snapShot.data().wishlist);
          }
        });
      } else {
        // setCurrentUserRedux korar dorkar nai karon setGuestRedux e currentUser ke null kore dicche
        setGuestRedux();
        // get cart from local storage
        let cartData = JSON.parse(localStorage.getItem("cart")) || [];
        let wishlistData = JSON.parse(localStorage.getItem("wishlist"));
        setCartRedux(cartData);
        setReduxWishlist(wishlistData);
      }
    } else {
      // setCurrentUserRedux korar dorkar nai karon setGuestRedux e currentUser ke null kore dicche
      setGuestRedux();
      // get cart from local storage
      let cartData = JSON.parse(localStorage.getItem("cart")) || [];
      let wishlistData = JSON.parse(localStorage.getItem("wishlist"));
      setCartRedux(cartData);
      setReduxWishlist(wishlistData);
    }
  };

  return (
    <>
      <Context>
        <div id="wrapper">{children}</div>
        {/* <RtlToggle /> */}
        <HomesModal /> <QuickView />
        <QuickAdd />
        <ProductSidebar />
        <Compare />
        <ShopCart />
        <AskQuestion />
        <BlogSidebar />
        <ColorCompare />
        <DeliveryReturn />
        <FindSize />
        <Login />
        <UserProfile />
        <MobileMenu />
        <Register />
        <ResetPass />
        <SearchModal />
        <ToolbarBottom />
        <ToolbarShop />
        {/* <NewsletterModal /> */}
        <ShareModal />{" "}
      </Context>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    additionalData: state.users.additionalData,
  };
};
export default connect(mapStateToProps, {
  setCartRedux,
  setReduxWishlist,
  setCurrentUserRedux,
  setGuestRedux,
  setAdditionalDataRedux,
})(AppNavigator);
