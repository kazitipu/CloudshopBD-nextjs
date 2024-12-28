import {
  getAllProductRequests,
  getAllShipmentRequests,
  getAllUsers,
  updateProductRequest,
  updateShipmentRequest,
  getAllPaymentRequest,
  getAllPaymentRequestOrder,
  updatePaymentRequestStatus,
  updatePaymentRequestOrderStatus,
  makePayment,
  getCurrency,
  getAllOrders,
  getAllRooms,
  updateOrder,
  updateProduct,
  getAllProducts,
  deleteOrder,
  deleteProduct,
  readAllMessage,
  getAllBrands,
  uploadBrand,
  updateBrand,
  deleteBrand,
  getAllCoupons,
  uploadCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCategories,
  getAllCampaigns,
  getAllHomeScreenCategories,
  uploadCategory,
  updateCategory,
  deleteCategory,
  getAllBanners,
  uploadBanner,
  updateBanner,
  deleteBanner,
  getAllTags,
  uploadTag,
  updateTag,
  deleteTag,
  getAllAttributes,
  uploadAttribute,
  updateAttribute,
  deleteAttribute,
  getAllReviews,
  updateReview,
  deleteReview,
  getAllAttributeTerms,
  uploadAttributeTerm,
  updateAttributeTerm,
  deleteAttributeTerm,
  getSingleProduct,
  getAllTopCategories,
  getAllHomeScreenProducts,
  getAllLatestProducts,
  getAllHomeScreenBestSelling,
  getAllBestSelling,
  getSingleCategoryProducts,
  updateSingleProduct,
  addToCart,
  addToCart2,
  addToWishlist,
  addToWishlist2,
  removeFromWishlist,
  removeFromWishlist2,
  addToOrder,
} from "../firebase/firebase.utils";

export const setAllOrders = (ordersArray) => ({
  type: "SET_ALL_ORDERS",
  payload: ordersArray,
});

export const appendMessagesRedux = (messages) => ({
  type: "APPEND_MESSAGES",
  payload: messages,
});

export const setAllPayments = (paymentsArray) => ({
  type: "SET_ALL_PAYMENTS",
  payload: paymentsArray,
});
export const setAllAdmins = (adminsArray) => ({
  type: "SET_ALL_ADMINS",
  payload: adminsArray,
});

export const setCouponRedux = (coupon) => async (dispatch) => {
  dispatch({
    type: "SET_COUPON_REDUX",
    payload: coupon,
  });
};

export const setTotalRedux = (total) => async (dispatch) => {
  dispatch({
    type: "SET_TOTAL_REDUX",
    payload: total,
  });
};

export const setCurrentAdmin = (adminObj) => ({
  type: "SET_CURRENT_ADMIN",
  payload: adminObj,
});

export const setAllProducts = (productsArray) => ({
  type: "SET_ALL_PRODUCTS",
  payload: productsArray,
});

export const rechargeAdminredux = (adminIdArray, balance) => {
  return {
    type: "RECHARGE_ADMIN",
    payload: {
      adminIdArray,
      balance,
    },
  };
};

export const updateProfileImageRedux = (imgUrl) => {
  return {
    type: "UPDATE_PROFILE_IMAGE",
    payload: imgUrl,
  };
};

export const getAllUsersRedux = () => async (dispatch) => {
  const allUsers = await getAllUsers();
  dispatch({ type: "GET_ALL_USERS", payload: allUsers });
};
export const selectRoomRedux = (roomId) => async (dispatch) => {
  await readAllMessage(roomId);
  dispatch({
    type: "SELECT_ROOM",
    payload: roomId,
  });
};

export const getAllProductRequestsRedux = (status) => async (dispatch) => {
  const requestsArray = await getAllProductRequests(status);
  dispatch({ type: "GET_ALL_PRODUCT_REQUESTS", payload: requestsArray });
};

export const getAllShipmentRequestsRedux = (status) => async (dispatch) => {
  const requestsArray = await getAllShipmentRequests(status);
  dispatch({ type: "GET_ALL_SHIPMENT_REQUESTS", payload: requestsArray });
};

export const updateProductRequestRedux = (requestObj) => async (dispatch) => {
  const updatedRequest = await updateProductRequest(requestObj);
  dispatch({ type: "UPDATE_PRODUCT_REQUEST", payload: updatedRequest });
};
export const updateProductRedux = (productObj) => async (dispatch) => {
  const updatedProduct = await updateProduct(productObj);
  dispatch({ type: "UPDATE_PRODUCT", payload: updatedProduct });
};
export const deleteProductRedux = (id) => async (dispatch) => {
  await deleteProduct(id);
  dispatch({ type: "DELETE_PRODUCT", payload: id });
};
export const getAllProductsRedux = () => async (dispatch) => {
  const allProducts = await getAllProducts();
  dispatch({ type: "GET_ALL_PRODUCTS", payload: allProducts });
};
export const getSingleProductRedux = (id) => async (dispatch) => {
  const product = await getSingleProduct(id);
  dispatch({ type: "GET_SINGLE_PRODUCT", payload: product });
};
export const updateShipmentRequestRedux = (requestObj) => async (dispatch) => {
  const updatedRequest = await updateShipmentRequest(requestObj);
  dispatch({ type: "UPDATE_SHIPMENT_REQUEST", payload: updatedRequest });
};
export const setFreeShippingRedux = (value) => async (dispatch) => {
  dispatch({
    type: "SET_FREE_SHIPPING",
    payload: value,
  });
};
export const getAllPaymentRequestRedux = () => async (dispatch) => {
  const paymentRequestArray = await getAllPaymentRequest();
  dispatch({ type: "GET_ALL_PAYMENT_REQUEST", payload: paymentRequestArray });
};
export const getAllPaymentRequestOrderRedux = () => async (dispatch) => {
  const paymentRequestOrderArray = await getAllPaymentRequestOrder();
  dispatch({
    type: "GET_ALL_PAYMENT_REQUEST_ORDER",
    payload: paymentRequestOrderArray,
  });
};

export const updatePaymentRequestStatusRedux =
  (paymentRequestObj) => async (dispatch) => {
    const updatedPaymentRequestObj = await updatePaymentRequestStatus(
      paymentRequestObj
    );
    dispatch({
      type: "UPDATE_PAYMENT_REQUEST_STATUS",
      payload: updatedPaymentRequestObj,
    });
  };
export const updatePaymentRequestOrderStatusRedux =
  (paymentRequestObj) => async (dispatch) => {
    const updatedPaymentRequestObj = await updatePaymentRequestOrderStatus(
      paymentRequestObj
    );
    dispatch({
      type: "UPDATE_PAYMENT_REQUEST_ORDER_STATUS",
      payload: updatedPaymentRequestObj,
    });
  };

export const removeFromCartRedux = (item, currentUser) => async (dispatch) => {
  let cartData = [];
  if (currentUser && currentUser.uid) {
    cartData = await removeFromCart(item, currentUser);
  } else {
    // guest er khetre khali item ta pathay dibo niche local storage theke delete kore
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (item.selectedVariation) {
      // Remove the item with the matching productId and selectedVariation
      const updatedCart = currentCart.filter(
        (cart) =>
          !(
            cart.productId === item.productId &&
            cart.selectedVariation?.id === item.selectedVariation.id
          )
      );

      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      cartData = updatedCart;
    } else {
      // Remove the item with the matching productId
      const updatedCart = currentCart.filter(
        (cart) => cart.productId !== item.productId
      );

      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      cartData = updatedCart;
    }
  }
  dispatch({
    type: "REMOVE_FROM_CART",
    payload: cartData,
  });
};

export const incrementQuantityRedux = (item) => async (dispatch) => {
  dispatch({
    type: "INCREMENT_QUANTITY",
    payload: item,
  });
};
export const decrementQuantityRedux = (item) => async (dispatch) => {
  dispatch({
    type: "DECREMENT_QUANTITY",
    payload: item,
  });
};
export const setQuantityRedux = (item, quantity) => async (dispatch) => {
  dispatch({
    type: "SET_QUANTITY",
    payload: { item, quantity },
  });
};

export const makePaymentRedux =
  (total, invoicesToPay, currentUser, admin, parcelsArray, paymentMethod) =>
  async (dispatch) => {
    const updatedOrdersArray = await makePayment(
      total,
      invoicesToPay,
      currentUser,
      admin,
      parcelsArray,
      paymentMethod
    );
    dispatch({
      type: "UPDATE_MULTIPLE_ORDERS",
      payload: updatedOrdersArray,
    });
  };

export const getCurrencyRedux = () => async (dispatch) => {
  const currency = await getCurrency();
  dispatch({ type: "GET_CURRENCY_REDUX", payload: currency });
};

export const addToCartRedux = (cartObj, currentUser) => async (dispatch) => {
  const cartData = await addToCart(cartObj, currentUser);
  dispatch({
    type: "ADD_TO_CART",
    payload: cartData,
  });
};

export const addToWishlistRedux =
  (wishlistObj, currentUser) => async (dispatch) => {
    let wishlist = [];
    if (currentUser && currentUser.uid) {
      wishlist = await addToWishlist(wishlistObj, currentUser);
    } else {
      // guest wishlist
      wishlist = await addToWishlist2(wishlistObj);
    }

    dispatch({
      type: "ADD_TO_WISHLIST",
      payload: wishlist,
    });
  };

export const removeFromWishlistRedux =
  (item, currentUser) => async (dispatch) => {
    let wishlist = [];
    if (currentUser && currentUser.uid) {
      wishlist = await removeFromWishlist(item, currentUser);
    } else {
      wishlist = await removeFromWishlist2(item);
    }

    dispatch({
      type: "REMOVE_FROM_WISHLIST",
      payload: wishlist,
    });
  };

export const setReduxWishlist = (wishlist) => async (dispatch) => {
  dispatch({
    type: "SET_REDUX_WISHLIST",
    payload: wishlist,
  });
};

// for guest cart
export const addToCartRedux2 = (cartObj) => async (dispatch) => {
  // for loacl storage saving and data retreving
  const cartData = addToCart2(cartObj);
  dispatch({
    type: "ADD_TO_CART",
    payload: cartData,
  });
};
export const setCartRedux = (cartData) => async (dispatch) => {
  // for loacl storage saving and data retreving
  dispatch({
    type: "SET_CART",
    payload: cartData,
  });
};

export const getAllOrdersRedux = (orderStatus) => async (dispatch) => {
  const ordersArray = await getAllOrders(orderStatus);
  dispatch({
    type: "GET_ALL_ORDERS",
    payload: ordersArray,
  });
};
export const getAllRoomsRedux = (rooms) => async (dispatch) => {
  // const rooms = await getAllRooms();
  dispatch({
    type: "GET_ALL_ROOMS",
    payload: rooms,
  });
};

export const updateOrderRedux = (order) => async (dispatch) => {
  const orderObj = await updateOrder(order);
  dispatch({
    type: "UPDATE_ORDER",
    payload: orderObj,
  });
};

export const getAllBrandsRedux = () => async (dispatch) => {
  const allBrands = await getAllBrands();
  dispatch({
    type: "GET_ALL_BRANDS",
    payload: allBrands,
  });
};

export const uploadBrandRedux = (brandObj) => async (dispatch) => {
  const uploadedBrandObj = await uploadBrand(brandObj);
  dispatch({
    type: "UPLOAD_BRAND",
    payload: uploadedBrandObj,
  });
};

export const updateBrandRedux = (brandObj) => async (dispatch) => {
  const updatedBrandObj = await updateBrand(brandObj);
  dispatch({
    type: "UPDATE_BRAND",
    payload: updatedBrandObj,
  });
};

export const deleteBrandRedux = (brandId, parentId) => async (dispatch) => {
  await deleteBrand(brandId, parentId);
  dispatch({
    type: "DELETE_BRAND",
    payload: { id: brandId, parentId: parentId },
  });
};
export const getAllCouponsRedux = () => async (dispatch) => {
  const allCoupons = await getAllCoupons();
  dispatch({
    type: "GET_ALL_COUPONS",
    payload: allCoupons,
  });
};

export const uploadCouponRedux = (couponObj) => async (dispatch) => {
  const uploadedCouponObj = await uploadCoupon(couponObj);
  dispatch({
    type: "UPLOAD_COUPON",
    payload: uploadedCouponObj,
  });
};

export const updateCouponRedux = (couponObj) => async (dispatch) => {
  const updatedCouponObj = await updateCoupon(couponObj);
  dispatch({
    type: "UPDATE_COUPON",
    payload: updatedCouponObj,
  });
};

export const deleteCouponRedux = (id) => async (dispatch) => {
  await deleteCoupon(id);
  dispatch({
    type: "DELETE_COUPON",
    payload: id,
  });
};
export const getAllCategoriesRedux = () => async (dispatch) => {
  const allCats = await getAllCategories();
  dispatch({
    type: "GET_ALL_CATEGORIES",
    payload: allCats,
  });
};
export const getAllCampaignsRedux = () => async (dispatch) => {
  const allCamps = await getAllCampaigns();
  dispatch({
    type: "GET_ALL_CAMPAIGNS",
    payload: allCamps,
  });
};
export const getAllLatestProductsRedux = (startAfter) => async (dispatch) => {
  const allProducts = await getAllLatestProducts(startAfter);
  dispatch({
    type: "GET_ALL_LATEST_PRODUCTS",
    payload: allProducts,
  });
};
export const getAllTopCategoriesRedux = () => async (dispatch) => {
  const allCats = await getAllTopCategories();
  dispatch({
    type: "GET_ALL_TOP_CATEGORIES",
    payload: allCats,
  });
};

export const getAllHomeScreenCategoriesRedux = () => async (dispatch) => {
  const allCats = await getAllHomeScreenCategories();
  dispatch({
    type: "GET_ALL_HOMESCREEN_CATEGORIES",
    payload: allCats,
  });
};

export const getAllHomeScreenProductsRedux =
  (categoryId) => async (dispatch) => {
    const allProducts = await getAllHomeScreenProducts(categoryId);
    dispatch({
      type: "GET_ALL_HOMESCREEN_PRODUCTS",
      payload: { categoryId: categoryId, products: allProducts },
    });
  };
export const getAllHomeScreenBestSellingRedux =
  (categoryId) => async (dispatch) => {
    const allProducts = await getAllHomeScreenBestSelling(categoryId);
    dispatch({
      type: "GET_ALL_HOMESCREEN_BEST_SELLING",
      payload: { categoryId: categoryId, products: allProducts },
    });
  };
export const getAllBestSellingRedux = (categoryId) => async (dispatch) => {
  const allProducts = await getAllBestSelling(categoryId);
  dispatch({
    type: "GET_ALL_BEST_SELLING",
    payload: { categoryId: categoryId, products: allProducts },
  });
};

export const uploadCategoryRedux =
  (categoryObj, homeCategoriesLength) => async (dispatch) => {
    const uploadedCategoryObj = await uploadCategory(
      categoryObj,
      homeCategoriesLength
    );
    dispatch({
      type: "UPLOAD_CATEGORY",
      payload: uploadedCategoryObj,
    });
  };

export const updateCategoryRedux =
  (categoryObj, homeCategoriesLength) => async (dispatch) => {
    const updatedCategoryObj = await updateCategory(
      categoryObj,
      homeCategoriesLength
    );
    dispatch({
      type: "UPDATE_CATEGORY",
      payload: updatedCategoryObj,
    });
  };

export const deleteCategoryRedux =
  (categoryObj, parentId) => async (dispatch) => {
    await deleteCategory(categoryObj, parentId);
    dispatch({
      type: "DELETE_CATEGORY",
      payload: { id: categoryObj.id, parentId: parentId },
    });
  };
export const getAllBannersRedux = () => async (dispatch) => {
  const allCats = await getAllBanners();
  dispatch({
    type: "GET_ALL_BANNERS",
    payload: allCats,
  });
};

export const uploadBannerRedux = (bannerObj) => async (dispatch) => {
  const uploadedBannerObj = await uploadBanner(bannerObj);
  dispatch({
    type: "UPLOAD_BANNER",
    payload: uploadedBannerObj,
  });
};

export const updateBannerRedux = (bannerObj) => async (dispatch) => {
  const updatedBannerObj = await updateBanner(bannerObj);
  dispatch({
    type: "UPDATE_BANNER",
    payload: updatedBannerObj,
  });
};

export const deleteBannerRedux = (bannerId) => async (dispatch) => {
  await deleteBanner(bannerId);
  dispatch({
    type: "DELETE_BANNER",
    payload: { id: bannerId },
  });
};

export const getAllTagsRedux = () => async (dispatch) => {
  const allTags = await getAllTags();
  dispatch({
    type: "GET_ALL_TAGS",
    payload: allTags,
  });
};

export const uploadTagRedux = (tagObj) => async (dispatch) => {
  const uploadedTagObj = await uploadTag(tagObj);
  dispatch({
    type: "UPLOAD_TAG",
    payload: uploadedTagObj,
  });
};

export const updateTagRedux = (tagObj) => async (dispatch) => {
  const updatedTagObj = await updateTag(tagObj);
  dispatch({
    type: "UPDATE_TAG",
    payload: updatedTagObj,
  });
};

export const deleteTagRedux = (tagId) => async (dispatch) => {
  await deleteTag(tagId);
  dispatch({
    type: "DELETE_TAG",
    payload: { id: tagId },
  });
};
export const getAllAttributesRedux = () => async (dispatch) => {
  const allAttributes = await getAllAttributes();
  dispatch({
    type: "GET_ALL_ATTRIBUTES",
    payload: allAttributes,
  });
};

export const uploadAttributeRedux = (attrObj) => async (dispatch) => {
  const uploadedAttributeObj = await uploadAttribute(attrObj);
  dispatch({
    type: "UPLOAD_ATTRIBUTE",
    payload: uploadedAttributeObj,
  });
};

export const updateAttributeRedux = (attrObj) => async (dispatch) => {
  const updatedAttrObj = await updateAttribute(attrObj);
  dispatch({
    type: "UPDATE_ATTRIBUTE",
    payload: updatedAttrObj,
  });
};

export const deleteAttributeRedux = (attrId) => async (dispatch) => {
  await deleteAttribute(attrId);
  dispatch({
    type: "DELETE_ATTRIBUTE",
    payload: { id: attrId },
  });
};
export const getAllReviewsRedux = () => async (dispatch) => {
  const allReviews = await getAllReviews();
  dispatch({
    type: "GET_ALL_REVIEWS",
    payload: allReviews,
  });
};

export const updateReviewRedux = (reviewObj) => async (dispatch) => {
  const updatedProductObj = await updateReview(reviewObj);
  dispatch({
    type: "UPDATE_REVIEW",
    payload: updatedProductObj,
  });
};

export const deleteReviewRedux = (productId, reviewId) => async (dispatch) => {
  const updatedProductObj = await deleteReview(productId, reviewId);
  dispatch({
    type: "UPDATE_REVIEW",
    payload: updatedProductObj,
  });
};
export const getAllAttributeTermsRedux = (id) => async (dispatch) => {
  const allAttributes = await getAllAttributeTerms(id);
  dispatch({
    type: "GET_ALL_ATTRIBUTE_TERMS",
    payload: allAttributes,
  });
};

export const uploadAttributeTermRedux = (attrObj) => async (dispatch) => {
  const uploadedAttributeObj = await uploadAttributeTerm(attrObj);
  dispatch({
    type: "UPLOAD_ATTRIBUTE_TERM",
    payload: uploadedAttributeObj,
  });
};

export const updateAttributeTermRedux = (attrObj) => async (dispatch) => {
  const updatedAttrObj = await updateAttributeTerm(attrObj);
  dispatch({
    type: "UPDATE_ATTRIBUTE_TERM",
    payload: updatedAttrObj,
  });
};

export const deleteAttributeTermRedux =
  (termId, parentId) => async (dispatch) => {
    await deleteAttributeTerm(termId, parentId);
    dispatch({
      type: "DELETE_ATTRIBUTE_TERM",
      payload: { id: termId, parentId },
    });
  };
export const getSingleCategoryProductsRedux =
  (categories, lastProduct) => async (dispatch) => {
    const allProducts = await getSingleCategoryProducts(
      categories,
      lastProduct
    );
    dispatch({
      type: "GET_ALL_SINGLE_CATEGORY_PRODUCTS",
      payload: allProducts,
    });
  };

export const updateSingleProductRedux = (productObj) => async (dispatch) => {
  const product = await updateSingleProduct(productObj);
  dispatch({
    type: "GET_SINGLE_PRODUCT",
    payload: product,
  });
};
export const addToOrderRedux = (orderObj) => async (dispatch) => {
  const order = await addToOrder(orderObj);
  dispatch({
    type: "ADD_TO_ORDER",
    payload: order,
  });
};
