import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter as startAfterFn,
  updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { algoliasearch } from "algoliasearch";

// this api key is different from search api. every api key is different
const searchClient = algoliasearch(
  "NILPZSAV6Q",
  "ed5fe19541c284e9330ce3130dc3c109"
);

var firebaseConfig = {
  apiKey: "AIzaSyAtfJVVFBS0GcYztN-bDzNJJtsxiKRuOm8",
  authDomain: "cloudshopbd-1aaae.firebaseapp.com",
  projectId: "cloudshopbd-1aaae",
  storageBucket: "cloudshopbd-1aaae.appspot.com",
  messagingSenderId: "65158771737",
  appId: "1:65158771737:web:c0cb0da3c178f1c6066688",
  measurementId: "G-10GPD8GP9X",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;
  if (userAuth.isAnonymous) return;

  console.log(additionalData);

  // Reference for admins collection
  const adminRef = doc(firestore, `admins/${userAuth.uid}`);
  const adminSnapShot = await getDoc(adminRef);

  if (adminSnapShot.exists()) return; // If user is an admin, no further action required

  // Reference for users collection
  const userRef = doc(firestore, `users/${userAuth.uid}`);
  const snapShot = await getDoc(userRef);

  if (!snapShot.exists()) {
    console.log(userAuth);
    const { email, displayName } = userAuth;
    const createdAt = new Date();

    try {
      console.log("Creating user document...");

      // Increment user count
      const userCount = await incrementUserCountByOne();

      // Create the user document in Firestore
      await setDoc(userRef, {
        userId: userCount < 10 ? `0${userCount}` : `${userCount}`,
        uid: userAuth.uid,
        id: userAuth.uid,
        email,
        createdAt,
        ...additionalData,
        ...(displayName ? { displayName } : {}),
        myWallet: 0,
        address: "",
        status: "Customer",
      });
    } catch (error) {
      console.error("Error creating user document:", error.message);
    }
  }
  return userRef;
};

const incrementUserCountByOne = async () => {
  const countRef = doc(firestore, `userCount/count`);

  // Fetch the current snapshot
  const snapShot = await getDoc(countRef);

  if (!snapShot.exists()) {
    // If the document doesn't exist, create it with initial user count
    try {
      await setDoc(countRef, {
        userCount: 1,
      });
    } catch (error) {
      alert(error.message);
    }
  } else {
    // If the document exists, increment the user count
    try {
      await updateDoc(countRef, {
        userCount: snapShot.data().userCount + 1,
      });
    } catch (error) {
      alert(error.message);
    }
  }
};
export const createAdminProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const adminRef = firestore.doc(`admins/${userAuth.uid}`);

  const snapShot = await adminRef.get();
  if (!snapShot.exists) {
    const { name, email } = userAuth;
    const createdAt = new Date();
    try {
      await adminRef.set({
        name,
        email,
        createdAt,
        pending_orders: [],
        balance: 0,
        used_balance: 0,
        successfully_delivered_orders: [],
        remaining_balance: 0,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating admin", error.message);
    }
  }
  return adminRef;
};
export const updateAllUser = async () => {
  const usersRef = firestore.collection("users");
  const users = await usersRef.get();

  users.forEach(async (doc) => {
    const userRef = firestore.doc(`users/${doc.id}`);
    const user = await userRef.get();
    // do any updates here
  });
};
export const uploadImage = async (file) => {
  const imageRef = storage.ref(`products/${file.name}`);

  await imageRef.put(file);
  var imgUrl = [];
  await imageRef.getDownloadURL().then((url) => {
    console.log(url);
    imgUrl.push(url);
  });
  // var uploadTask = imageRef.put(file)
  // uploadTask.on('state_changed',
  // (snapShot)=>{
  //   var progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
  //   // alert(`upload is ${progress}% done`)
  // },
  // (error)=>{
  //   alert(error)
  // },
  // ()=>{
  //   // alert('successfully uploaded the file')
  //   imageRef.getDownloadURL().then((url)=>{
  //     imgUrl.push(url)
  //     console.log(imgUrl[0])
  //   }).catch((error)=>alert(error))
  // })

  return imgUrl[0];
};

export const getAllDeviceTokens = async () => {
  const tokensCollectionRef = firestore.collection("deviceTokens");
  try {
    const tokens = await tokensCollectionRef.get();
    const tokensArray = [];
    tokens.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      tokensArray.push(doc.data().deviceToken[0]);
    });
    return tokensArray;
  } catch (error) {
    alert(error);
    return [];
  }
};

export const addToWishlist = async (wishlistObj, user) => {
  if (user && user.uid) {
    const wishlistRef = doc(firestore, `wishlists/${user.uid}`);
    try {
      const snapShot = await getDoc(wishlistRef);

      if (!snapShot.exists()) {
        // If the wishlist doesn't exist, create it
        await setDoc(wishlistRef, {
          wishlist: [wishlistObj],
        });
        const updatedSnapshot = await getDoc(wishlistRef);
        return updatedSnapshot.data().wishlist;
      } else {
        // If the wishlist exists, check if the item is already in the list
        const existingWishlist = snapShot.data().wishlist || [];
        const itemExists = existingWishlist.find(
          (wish) => wish.id === wishlistObj.id
        );

        if (itemExists) {
          // If the item already exists, return the wishlist as is
          return existingWishlist;
        } else {
          // Otherwise, update the wishlist with the new item
          const updatedWishlist = [...existingWishlist, wishlistObj];
          await updateDoc(wishlistRef, {
            wishlist: updatedWishlist,
          });
          const updatedSnapshot = await getDoc(wishlistRef);
          return updatedSnapshot.data().wishlist;
        }
      }
    } catch (error) {
      console.error("Error managing wishlist:", error.message);
      return [];
    }
  } else {
    return [];
  }
};

export const addToWishlist2 = (wishlistObj) => {
  let wishlist = {
    id: wishlistObj.id,
    name: wishlistObj.name,
    pictures: wishlistObj.pictures,
    pictures2: wishlistObj.pictures2,
    price: wishlistObj.price,
    salePrice: wishlistObj.salePrice,
  };

  // Retrieve the wishlist from localStorage or initialize as an empty array
  const currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Check if the item already exists in the wishlist
  const isAlreadyInWishlist = currentWishlist.some(
    (wish) => wish.id === wishlist.id
  );

  if (isAlreadyInWishlist) {
    // Return the current wishlist as no changes are needed
    return currentWishlist;
  } else {
    // Add the new item to the wishlist
    const updatedWishlist = [...currentWishlist, wishlist];

    // Save the updated wishlist back to localStorage
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    // Return the updated wishlist
    return updatedWishlist;
  }
};

export const removeFromWishlist = async (item, user) => {
  if (!user.uid) {
    return [];
  }
  const wishlistRef = firestore().doc(`wishlists/${user.uid}`);
  const snapShot = await wishlistRef.get();

  await wishlistRef.update({
    wishlist: snapShot.data().wishlist.filter((wishlistItem) => {
      if (wishlistItem.id == item.id) {
        return false;
      } else {
        return true;
      }
    }),
  });
  const updatedSnapshot = await wishlistRef.get();
  return updatedSnapshot.data().wishlist;
};
export const removeFromWishlist2 = (item) => {
  // Retrieve the current wishlist from localStorage
  const currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  // Filter out the item to be removed
  const updatedWishlist = currentWishlist.filter(
    (wishlistItem) => wishlistItem.id !== item.id
  );
  // Update the localStorage with the new wishlist
  localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  // Return the updated wishlist
  return updatedWishlist;
};

export const matchCoupon = async (number) => {
  const couponsRef = collection(firestore, "coupons");
  const q = query(couponsRef, where("name", "==", number));
  try {
    const querySnapshot = await getDocs(q);
    let coupon = null;

    querySnapshot.forEach((doc) => {
      // Assuming there is only one match, assign the first match to coupon
      if (!coupon) {
        coupon = doc.data();
      }
    });
    return coupon;
  } catch (error) {
    console.error("Error matching coupon:", error);
    return null;
  }
};

export const uploadProduct = async (productObj) => {
  const productRef = firestore.doc(`products/${productObj.id}`);
  const snapShot = await productRef.get();
  delete productObj.file;
  const newProductObj = {
    ...productObj,
  };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
    } catch (error) {
      alert(error);
    }
  } else {
    if (productObj.edited) {
      await productRef.update({
        ...newProductObj,
      });
    } else {
      alert(
        "there is already a product with this given prodcut Id, please change the product Id and upload again"
      );
    }
  }
  const updatedSnapShot = await productRef.get();
  return updatedSnapShot.data();
};
export const uploadDisplayedVariation = async (variationObj) => {
  const productRef = firestore.doc(`variations/${variationObj.id}`);
  const snapShot = await productRef.get();

  const newVariationObj = {
    ...variationObj,
  };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newVariationObj,
      });
    } catch (error) {
      alert(error);
    }
  } else {
    await productRef.update({
      ...newVariationObj,
    });
  }
  const updatedSnapShot = await productRef.get();
  return updatedSnapShot.data();
};
export const uploadProductTax = async (productObj) => {
  const productRef = firestore.doc(`taxes/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj };
  if (!snapShot.exists) {
    try {
      productRef.set({
        ...newProductObj,
      });
    } catch (error) {
      alert(error);
    }
  } else {
    alert(
      "there is already a product with this given prodcut Id, please change the product Id and upload again"
    );
  }
};
export const uploadImageRechargeRequest = async (file) => {
  const imageRef = storage.ref(`rechargeRequests/${file.name}`);

  try {
    await imageRef.put(file);
    var imgUrl = [];
    await imageRef.getDownloadURL().then((url) => {
      console.log(url);
      imgUrl.push(url);
    });
    return imgUrl[0];
  } catch (error) {
    return null;
  }
};
export const uploadAliProduct = async (productObj) => {
  const productRef = firestore.doc(`aliproducts/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj };
  if (!snapShot.exists) {
    try {
      productRef.set({
        ...newProductObj,
      });
    } catch (error) {
      alert(error);
    }
  } else {
    alert(
      "this product is already added to your website. try adding different product"
    );
  }
};

export const getAllProducts = async () => {
  const productsCollectionRef = firestore.collection("products");
  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};
export const getAllReviews = async () => {
  const productsCollectionRef = firestore
    .collection("products")
    .orderBy("reviews");
  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllProductsTax = async () => {
  const productsCollectionRef = firestore.collection("taxes");
  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllAliProducts = async () => {
  const aliProductsCollectionRef = firestore.collection("aliproducts");
  try {
    const products = await aliProductsCollectionRef.get();
    const aliProductsArray = [];
    products.forEach((doc) => {
      aliProductsArray.push(doc.data());
    });
    return aliProductsArray;
  } catch (error) {
    alert(error);
  }
};

export const deleteProduct = async (id) => {
  const productRef = firestore.doc(`products/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const deleteReview = async (productId, reviewId) => {
  const productRef = firestore.doc(`products/${productId}`);
  const product = await productRef.get();
  let updatedReviews = [];
  product.data().reviews.map((review) => {
    if (review.id != reviewId) {
      updatedReviews.push(review);
    }
  });
  try {
    await productRef.update({ ...product.data(), reviews: updatedReviews });
    const updatedProduct = await productRef.get();
    return updatedProduct.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteProductTax = async (id) => {
  const productRef = firestore.doc(`taxes/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const updateProductTax = async (productObj) => {
  const productRef = firestore.doc(`taxes/${productObj.id}`);
  try {
    await productRef.update({ ...productObj });
  } catch (error) {
    alert(error);
  }
};

export const getSingleProductTax = async (id) => {
  const productRef = firestore.doc(`taxes/${id}`);
  try {
    const product = await productRef.get();
    return product.data();
  } catch (error) {
    alert(error);
  }
};
export const getFreeShipping = async () => {
  const productRef = doc(firestore, "freeShipping/freeShipping");
  try {
    const productSnap = await getDoc(productRef); // Fetch the document
    if (productSnap.exists()) {
      return productSnap.data(); // Return document data
    } else {
      console.log("No such document exists!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching freeShipping document:", error);
    throw error; // Throw the error for further handling
  }
};

export const getSingleProduct = async (id) => {
  const productRef = doc(firestore, `products/${id}`);
  try {
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      return productSnap.data();
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error; // Optionally rethrow the error
  }
};

export const getDisplayedVariation = async (id) => {
  const productRef = firestore.doc(`variations/${id}`);
  try {
    const product = await productRef.get();
    return product.data();
  } catch (error) {
    alert(error);
  }
};

// get all users

export const getAllUsers = async () => {
  const usersCollectionRef = firestore.collection("users");
  try {
    const users = await usersCollectionRef.get();
    const usersArray = [];
    users.forEach((doc) => {
      usersArray.push({ uid: doc.id, ...doc.data() });
    });
    return usersArray;
  } catch (error) {
    alert(error);
  }
};

export const deleteUser = async (id) => {
  const productRef = firestore.doc(`users/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};

// Orders management (get all orders)

export const getAllOrders = async (userId) => {
  try {
    const orderCollectionRef = collection(firestore, "orders"); // Reference to the 'orders' collection
    const q = query(orderCollectionRef, where("userId", "==", userId)); // Query to filter orders by userId
    const querySnapshot = await getDocs(q); // Execute the query

    const ordersArray = [];
    querySnapshot.forEach((doc) => {
      ordersArray.push(doc.data());
    });
    return ordersArray;
  } catch (error) {
    console.error("Error getting orders: ", error);
    throw new Error("Failed to fetch orders");
  }
};

export const updateAllUsers = async () => {
  const collection = await firestore.collection("users").get();
  collection.forEach((doc) => {
    doc.ref.update({
      ...doc.data(),
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/globalbuybd-auth.appspot.com/o/users%2Fprofile.png?alt=media&token=810e25f1-8cd9-43b0-b49d-41f2236588cb",
    });
  });
};

export const deleteOrder = async (id) => {
  const orderRef = firestore.doc(`orders/${id}`);
  try {
    await orderRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const getSingleOrder = async (id) => {
  try {
    const orderRef = doc(firestore, "orders", id); // Reference to the specific document
    const orderSnapshot = await getDoc(orderRef); // Fetch the document
    if (orderSnapshot.exists()) {
      return orderSnapshot.data(); // Return the document data
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }
};
export const getSingleAnnouncement = async () => {
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];
  try {
    const announcementsCollectionRef = collection(firestore, "announcements");
    const homePageQuery = query(
      announcementsCollectionRef,
      where("visible", "==", true)
    );
    const announcements = await getDocs(homePageQuery);
    const announcementsArray = [];
    announcements.forEach((doc) => {
      announcementsArray.push(doc.data());
    });
    // will most probalby get single document so get the first one
    return announcementsArray[0];
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }
};

export const fetchAllProducts = async (chunks) => {
  const db = getFirestore(); // Initialize Firestore instance
  const promises = chunks.map((chunk) => {
    // Create a query for each chunk
    const q = query(collection(db, "products"), where("id", "in", chunk));

    // Fetch documents for the query
    return getDocs(q).then((querySnapshot) =>
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  });

  // Wait for all queries to resolve
  const results = await Promise.all(promises);

  // Flatten the array of arrays into a single array of documents
  return results.flat();
};

export const getSingleAttribute = async (id) => {
  const orderRef = firestore.doc(`attributes/${id}`);
  try {
    const order = await orderRef.get();
    return order.data();
  } catch (error) {
    alert(error);
  }
};

export const updateOrder = async (orderObj) => {
  const orderRef = doc(firestore, `orders/${orderObj.id}`);
  try {
    // Update the document
    await updateDoc(orderRef, { ...orderObj });

    // Fetch the updated document
    const updatedOrder = await getDoc(orderRef);

    return updatedOrder.exists() ? updatedOrder.data() : null;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error; // Re-throw the error for handling elsewhere if needed
  }
};

export const updateMultipleOrder = async (orderIdArray, status) => {
  orderIdArray.forEach(async (orderId) => {
    const orderRef = firestore.doc(`orders/${orderId}`);
    const order = await orderRef.get();
    const userId = await order.data().userId;
    const userRef = firestore.doc(`users/${userId}`);
    const user = await userRef.get();
    var exactOrder = user
      .data()
      .ordersArray.find((order) => order.orderId == orderId);
    exactOrder.status = status;
    var otherOrders = user
      .data()
      .ordersArray.filter((order) => order.orderId !== orderId);
    console.log(status);
    if (status == "delivered") {
      console.log(status);
      const adminsCollectionRef = firestore.collection("admins");
      const admins = await adminsCollectionRef.get();
      admins.forEach(async (doc) => {
        console.log(doc.data().pending_orders.includes(orderId));
        if (doc.data().pending_orders.includes(orderId)) {
          console.log(status);
          var adminRef = firestore.doc(`admins/${doc.id}`);
          var updatedPendingOrders = doc
            .data()
            .pending_orders.filter((order) => order !== orderId);
          var newly_used_balance = order.data().sum;
          var total_used_balance = doc.data().used_balance
            ? doc.data().used_balance + newly_used_balance
            : newly_used_balance;
          await adminRef.update({
            ...doc.data(),
            pending_orders: [...updatedPendingOrders],
            successfully_delivered_orders: doc.data()
              .successfully_delivered_orders
              ? [...doc.data().successfully_delivered_orders, orderId]
              : [orderId],
            used_balance: total_used_balance,
            remaining_balance:
              doc.data().balance - parseInt(total_used_balance),
          });
        }
      });
    }
    try {
      await userRef.update({ ordersArray: [exactOrder, ...otherOrders] });
      return await orderRef.update({ ...order.data(), status: status });
    } catch (error) {
      alert(error);
    }
  });
};

export const updateMultipleOrderwithOrderTo = async (
  orderIdArray,
  status,
  orderTo
) => {
  orderIdArray.forEach(async (orderId) => {
    const orderRef = firestore.doc(`orders/${orderId}`);
    const order = await orderRef.get();
    const userId = await order.data().userId;
    const userRef = firestore.doc(`users/${userId}`);
    const user = await userRef.get();
    var exactOrder = user
      .data()
      .ordersArray.find((order) => order.orderId == orderId);
    exactOrder.status = status;
    if (!exactOrder.orderTo) {
      exactOrder.orderTo = orderTo;
    }
    var otherOrders = user
      .data()
      .ordersArray.filter((order) => order.orderId !== orderId);
    try {
      if (!order.data().orderTo) {
        await orderRef.update({ ...order.data(), status, orderTo });
      } else {
        await orderRef.update({
          ...order.data(),
          orderTo: order.data().orderTo,
          status,
        });
        alert(
          `this ${orderId} order is already ordered to another supplier. check ordered products`
        );
      }
      await userRef.update({ ordersArray: [exactOrder, ...otherOrders] });
    } catch (error) {
      alert(error);
    }
  });
};

// paymet management
export const getAllPayments = async () => {
  const paymentsCollectionRef = firestore.collection("payments");
  try {
    const payments = await paymentsCollectionRef.get();
    const paymentsArray = [];
    payments.forEach((doc) => {
      paymentsArray.push({ uid: doc.id, ...doc.data() });
    });
    return paymentsArray;
  } catch (error) {
    alert(error);
  }
};

export const deletePayment = async (orderId) => {
  const paymentRef = firestore.doc(`payments/${orderId}`);
  try {
    await paymentRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const updatePaymentStatus = async (paymentObj) => {
  const paymentRef = firestore.doc(`payments/${paymentObj.orderId}`);
  const payment = await paymentRef.get();
  var actualPayment = payment
    .data()
    .payments.find((payment) => payment.paymentId == paymentObj.paymentId);
  const orderId = actualPayment.orderId;
  const orderRef = firestore.doc(`orders/${orderId}`);
  const order = await orderRef.get();
  const userId = await order.data().userId;
  const userRef = firestore.doc(`users/${userId}`);
  const user = await userRef.get();
  var exactPayment = user
    .data()
    .paymentsArray.find((payment) => payment.paymentId == paymentObj.paymentId);
  exactPayment.paymentStatus = paymentObj.paymentStatus;
  var otherPayments = user
    .data()
    .paymentsArray.filter(
      (payment) => payment.paymentId !== paymentObj.paymentId
    );

  await userRef.update({ paymentsArray: [exactPayment, ...otherPayments] });
  const updatedPaymentObj = payment
    .data()
    .payments.find((payment) => payment.paymentId == paymentObj.paymentId);
  updatedPaymentObj.paymentStatus = paymentObj.paymentStatus;
  const newPaymentsArray = payment
    .data()
    .payments.filter((payment) => payment.paymentId !== paymentObj.paymentId);
  try {
    await paymentRef.update({
      ...payment.data(),
      payments: [...newPaymentsArray, updatedPaymentObj],
    });
  } catch (error) {
    alert(error);
  }
};

export const updateOrderAmount = async (paymentObj) => {
  const orderRef = firestore.doc(`orders/${paymentObj.orderId}`);
  const order = await orderRef.get();
  const userId = await order.data().userId;
  const userRef = firestore.doc(`users/${userId}`);
  const user = await userRef.get();
  var exactOrder = user
    .data()
    .ordersArray.find((order) => order.orderId == paymentObj.orderId);
  exactOrder.status === "order_pending"
    ? (exactOrder.status = "payment_approved")
    : (exactOrder.status = exactOrder.status);
  exactOrder.paymentStatus.paid =
    parseInt(exactOrder.paymentStatus.paid) + parseInt(paymentObj.amount);
  exactOrder.paymentStatus.due =
    parseInt(exactOrder.paymentStatus.total) -
    parseInt(exactOrder.paymentStatus.paid);
  var otherOrders = user
    .data()
    .ordersArray.filter((order) => order.orderId !== paymentObj.orderId);
  await userRef.update({ ordersArray: [exactOrder, ...otherOrders] });
  try {
    const order = await orderRef.get();
    console.log(order.data());
    await orderRef.update({
      ...order.data(),
      status:
        order.data().status === "order_pending"
          ? "payment_approved"
          : order.data().status,
      paymentStatus: {
        ...order.data().paymentStatus,
        due:
          parseInt(order.data().paymentStatus.total) -
          (parseInt(order.data().paymentStatus.paid) +
            parseInt(paymentObj.amount)),
        paid:
          parseInt(order.data().paymentStatus.paid) +
          parseInt(paymentObj.amount),
      },
    });
  } catch (error) {
    alert(error);
  }
};

// distribute order to managers
export const orderProductsFromChina = async (orderIdArray, orderTo) => {
  const adminsCollectionRef = firestore.collection("admins");
  orderIdArray.forEach(async (orderId) => {
    const orderRef = firestore.doc(`orders/${orderId}`);
    try {
      const order = await orderRef.get();
      if (!order.data().orderTo) {
        try {
          const admins = await adminsCollectionRef.get();
          admins.forEach((doc) => {
            var adminRef = firestore.doc(`admins/${doc.id}`);
            if (doc.data().name == orderTo) {
              adminRef.update({
                ...doc.data(),
                pending_orders: [...doc.data().pending_orders, orderId],
              });
              return;
            }
          });
        } catch (error) {
          alert(error);
        }
      } else {
        console.log(
          `${orderId} is already ordered to another supplier.check ordered item`
        );
      }
    } catch (error) {
      console.log(error);
    }
  });
};

export const productToOrder = async (productsArray) => {
  productsArray.forEach((product) => {
    const productToOrderRef = firestore.doc(`productToOrder/${product.id}`);
    try {
      productToOrderRef.set(product);
    } catch (error) {
      alert(error);
    }
  });
};

// admins
export const getAllAdmins = async () => {
  const adminsCollectionRef = firestore.collection("admins");
  try {
    const admins = await adminsCollectionRef.get();
    const adminsArray = [];
    admins.forEach((doc) => {
      adminsArray.push({ adminId: doc.id, ...doc.data() });
    });
    return adminsArray;
  } catch (error) {
    alert(error);
  }
};

export const rechargeAdmin = async (adminIdArray, balance) => {
  adminIdArray.forEach(async (adminId) => {
    const adminRef = firestore.doc(`admins/${adminId}`);
    try {
      const admin = await adminRef.get();
      var total_balance = parseInt(admin.data().balance) + parseInt(balance);
      await adminRef.update({
        ...admin.data(),
        balance: admin.data().balance
          ? parseInt(admin.data().balance) + parseInt(balance)
          : parseInt(balance),
        remaining_balance: total_balance - parseInt(admin.data().used_balance),
      });
    } catch (error) {
      alert(error);
    }
  });
};

export const updateProfileImage = async (imgUrl, id) => {
  const adminRef = firestore.doc(`admins/${id}`);
  try {
    const admin = await adminRef.get();
    await adminRef.update({ ...admin.data(), image: imgUrl });
  } catch (error) {
    alert(error);
  }
};
export const setRmbPrice = async (taka) => {
  const currencyRef = firestore.doc(`Currency/taka`);
  let rmbRate;
  if (taka) {
    try {
      const currency = await currencyRef.get();
      if (currency.data()) {
        await currencyRef.update({ ...currency.data(), taka });
        rmbRate = taka;
        return rmbRate;
      } else {
        await currencyRef.set({ taka: taka });
        rmbRate = taka;
        return rmbRate;
      }
    } catch (error) {
      alert(error);
    }
  } else {
    try {
      const currency = await currencyRef.get();
      rmbRate = currency.data().taka;
      return rmbRate;
    } catch (error) {
      alert(error);
    }
  }
};

export const getAllProductRequests = async (status) => {
  const reqeustsCollectionRef = firestore
    .collection("bookingRequest")
    .where("status", "==", status);

  try {
    const requests = await reqeustsCollectionRef.get();
    const requestsArray = [];
    requests.forEach((doc) => {
      requestsArray.push(doc.data());
    });
    return requestsArray.sort((a, b) => b.time - a.time);
  } catch (error) {
    alert(error);
  }
};
export const getAllShipmentRequests = async (status) => {
  const reqeustsCollectionRef = firestore
    .collection("shipForMe")
    .where("status", "==", status);

  try {
    const requests = await reqeustsCollectionRef.get();
    const requestsArray = [];
    requests.forEach((doc) => {
      requestsArray.push(doc.data());
    });
    return requestsArray.sort((a, b) => b.time - a.time);
  } catch (error) {
    alert(error);
  }
};
export const updateProductRequest = async (requestObj) => {
  const reqeustRef = firestore.doc(`bookingRequest/${requestObj.bookingId}`);

  try {
    await reqeustRef.update({
      ...requestObj,
    });
    const request = await reqeustRef.get();
    return request.data();
  } catch (error) {
    alert(error);
  }
};
export const updateProduct = async (productObj) => {
  const productRef = firestore.doc(`aliproducts/${productObj.id}`);

  try {
    await productRef.update({
      ...productObj,
    });
    const product = await productRef.get();
    return product.data();
  } catch (error) {
    alert(error);
  }
};
export const updateReview = async (reviewObj) => {
  const productRef = firestore.doc(`products/${reviewObj.productId}`);
  const product = await productRef.get();

  try {
    await productRef.update({
      ...product.data(),
      reviews: product.data().reviews.map((review) => {
        if (review.id == reviewObj.id) {
          return reviewObj;
        } else {
          return review;
        }
      }),
    });
    const updatedProduct = await productRef.get();
    return updatedProduct.data();
  } catch (error) {
    alert(error);
  }
};
export const updateShipmentRequest = async (requestObj) => {
  const reqeustRef = firestore.doc(`shipForMe/${requestObj.bookingId}`);

  try {
    await reqeustRef.update({
      ...requestObj,
    });
    const request = await reqeustRef.get();
    return request.data();
  } catch (error) {
    alert(error);
  }
};

export const getAllPaymentRequest = async () => {
  const paymentRequestCollectionRef = firestore
    .collection("paymentRequest")
    .where("status", "==", "pending");

  try {
    const paymentRequest = await paymentRequestCollectionRef.get();
    const paymentRequestArray = [];
    paymentRequest.forEach((doc) => {
      paymentRequestArray.push(doc.data());
    });
    console.log(paymentRequestArray);
    return paymentRequestArray.sort((a, b) => b.time - a.time);
  } catch (error) {
    alert(error);
  }
};
export const getAllPaymentRequestOrder = async () => {
  const paymentRequestCollectionRef = firestore
    .collection("paymentRequestApi")
    .where("status", "==", "pending");

  try {
    const paymentRequest = await paymentRequestCollectionRef.get();
    const paymentRequestArray = [];
    paymentRequest.forEach((doc) => {
      paymentRequestArray.push(doc.data());
    });
    console.log(paymentRequestArray);
    return paymentRequestArray.sort((a, b) => b.time - a.time);
  } catch (error) {
    alert(error);
  }
};

export const updatePaymentRequestStatus = async (paymentRequestObj) => {
  console.log(paymentRequestObj);
  const paymentRequestRef = firestore.doc(
    `paymentRequest/${paymentRequestObj.paymentId}`
  );
  const snapshot = await paymentRequestRef.get();
  if (snapshot.exists) {
    try {
      paymentRequestObj.productRequestArray.forEach(async (productRequest) => {
        if (productRequest.shipFrom) {
          const bookingRequestRef = firestore.doc(
            `shipForMe/${productRequest.bookingId}`
          );
          const bookingRequest = await bookingRequestRef.get();
          await bookingRequestRef.update({
            paymentStatus: paymentRequestObj.status,
            status:
              paymentRequestObj.status === "paid"
                ? "Paid"
                : bookingRequest.data().status,
          });
        } else {
          const bookingRequestRef = firestore.doc(
            `bookingRequest/${productRequest.bookingId}`
          );
          const bookingRequest = await bookingRequestRef.get();
          await bookingRequestRef.update({
            paymentStatus: paymentRequestObj.status,
            status:
              paymentRequestObj.status === "paid"
                ? "Paid"
                : bookingRequest.data().status,
          });
        }
      });
      await paymentRequestRef.update({
        status: paymentRequestObj.status,
      });
      const updatedPaymentRequestObj = await paymentRequestRef.get();
      return updatedPaymentRequestObj.data();
    } catch (error) {
      alert(error);
    }
  } else {
    return null;
  }
};
export const updatePaymentRequestOrderStatus = async (paymentRequestObj) => {
  console.log(paymentRequestObj);
  const paymentRequestRef = firestore.doc(
    `paymentRequestApi/${paymentRequestObj.paymentId}`
  );
  const snapshot = await paymentRequestRef.get();
  if (snapshot.exists) {
    try {
      for (let i = 0; i < paymentRequestObj.pendingOrders.length; i++) {
        const element = paymentRequestObj.pendingOrders[i];
        const orderRef = firestore.doc(`ordersApi/${element.orderId}`);

        const order = await orderRef.get();
        await orderRef.update({
          orderStatus: paymentRequestObj.status,
          paymentStatus:
            paymentRequestObj.status == "approved"
              ? "paid"
              : paymentRequestObj.status,
        });
      }
      await paymentRequestRef.update({
        status: paymentRequestObj.status,
      });
      const updatedPaymentRequestObj = await paymentRequestRef.get();
      return updatedPaymentRequestObj.data();
    } catch (error) {
      alert(error);
      return null;
    }
  } else {
    return null;
  }
};

export const getAllOrdersApi = async (orderStatus) => {
  const ordersCollectionRef = firestore
    .collection("ordersApi")
    .where("orderStatus", "==", orderStatus);
  try {
    const orders = await ordersCollectionRef.get();
    const ordersArray = [];
    orders.forEach((doc) => {
      ordersArray.push(doc.data());
    });
    return ordersArray;
  } catch (error) {
    alert(error);
  }
};
export const getAllRooms = async () => {
  const roomsCollectionRef = firestore.collection("rooms");

  try {
    const rooms = await roomsCollectionRef.get();
    const roomsArray = [];
    rooms.forEach((doc) => {
      roomsArray.push(doc.data());
    });
    return roomsArray.sort((a, b) => b.time - a.time);
  } catch (error) {
    alert(error);
  }
};
export const readAllMessage = async (roomId) => {
  const roomRef = firestore.doc(`rooms/${roomId}`);
  const room = await roomRef.get();
  roomRef.update({
    messages: room.data().messages.map((message) => {
      if (message.user._id == roomId) {
        return { ...message, sent: true, received: true };
      } else {
        return message;
      }
    }),
    lastMessage: { ...room.data().lastMessage, sent: true, received: true },
  });
};

export const updateOrderApi = async (order) => {
  const orderRef = firestore.doc(`ordersApi/${order.orderId}`);
  const snapShot = await orderRef.get();
  if (snapShot.exists) {
    try {
      await orderRef.update({ ...order });
      const updatedOrder = await orderRef.get();
      return updatedOrder.data();
    } catch (error) {
      console.log("error creating orders", error.message);
      return;
    }
  } else {
    alert("No order was found to be updated");
  }
};

export const getCurrency = async () => {
  const currencyRef = firestore.doc("Currency/taka");
  try {
    const currency = await currencyRef.get();
    return currency.data();
  } catch (error) {
    alert(error);
  }
};

export const makePayment = async (
  total,
  invoicesToPay,
  currentUser,
  admin,
  parcelsArray,
  paymentMethod
) => {
  try {
    const res = await firestore.runTransaction(async (t) => {
      //first create a payment object
      const paymentObj = {
        paymentId: Math.floor(Math.random() * Date.now()),
        paidAt: new Date().toLocaleDateString("en-US").replaceAll("/", "-"),
        amount: total,
        paymentMethod,
        paidInvoice: [...invoicesToPay],
        approvedBy: admin.name,
      };

      // for transaction all reads should be done before all writes
      const paymentDayRef = firestore.doc(`paymentDays/${paymentObj.paidAt}`);
      const paymentDay = await t.get(paymentDayRef);
      const paymentHistoryRef = firestore.doc(
        `paymentHistory/${paymentObj.paymentId}`
      );
      const paymentHistory = await t.get(paymentHistoryRef);
      // updatating the status invoiceStatus=Paid in parcelArray in admin
      parcelsArray.forEach(async (parcel) => {
        const orderRef = firestore.doc(`orders/${parcel.parcelId}`);
        await t.update(orderRef, {
          ...parcel,
          invoiceStatus: "Paid",
        });
      });

      // make all writes
      // make a payment in paymentdays
      console.log(paymentDay.data());
      const day = getDay();
      if (!paymentDay.exists) {
        t.set(paymentDayRef, {
          date: paymentObj.paidAt,
          total: total,
          day,
        });
      } else {
        t.update(paymentDayRef, {
          total: paymentDay.data().total + total,
        });
      }
      console.log(paymentDay.data());

      // make a payment in paymentHistory

      console.log(paymentHistory.data());
      if (!paymentHistory.exists) {
        t.set(paymentHistoryRef, {
          Email: currentUser
            ? currentUser.email && currentUser.email
            : admin.email,
          Name: currentUser
            ? currentUser.displayName && currentUser.displayName
            : admin.name,
          Id: currentUser ? currentUser.userId : "admin",
          uid: currentUser ? currentUser.uid : admin.adminId,
          Mobile: currentUser
            ? currentUser.mobileNo
              ? currentUser.mobileNo
              : ""
            : admin.mobileNo,
          ...paymentObj,
          day,
        });
      } else {
        alert("Your paymentId already exist. please try again later.");
      }
      console.log(paymentHistory.data());

      const newArray = parcelsArray.map((parcel) => {
        return { ...parcel, invoiceStatus: "Paid" };
      });

      console.log(parcelsArray[0]);
      console.log(newArray[0]);
      return newArray;
    });
    return res;
  } catch (e) {
    console.log("Transaction failure:", e);
    alert("Transaction failure");
    return [];
  }
};

const getDay = () => {
  const t = new Date();
  const dayInDigit = t.getDay();
  let day;
  if (dayInDigit == 0) {
    day = "Sunday";
  }
  if (dayInDigit == 1) {
    day = "Monday";
  }
  if (dayInDigit == 2) {
    day = "Tuesday";
  }
  if (dayInDigit == 3) {
    day = "Wednesday";
  }
  if (dayInDigit == 4) {
    day = "Thursday";
  }
  if (dayInDigit == 5) {
    day = "Friday";
  }
  if (dayInDigit == 6) {
    day = "Saturday";
  }
  return day;
};

export const getMultipleOrders = async (parcelIdArray) => {
  const ordersArray = [];
  for (let i = 0; i < parcelIdArray.length; i++) {
    const orderRef = firestore.doc(`orders/${parcelIdArray[i]}`);
    const snapShot = await orderRef.get();
    ordersArray.push(snapShot.data());
  }
  return ordersArray;
};

export const getAllBrands = async () => {
  const productsCollectionRef = collection(firestore, "brands");
  const homePageQuery = query(
    productsCollectionRef,
    where("homeScreen", "==", true)
  );
  try {
    const products = await getDocs(homePageQuery);
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadBrand = async (productObj) => {
  const productRef = firestore.doc(`brands/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a brand with similar id");
  }
};
export const uploadfreeShipping = async (value) => {
  const productRef = firestore.doc(`freeShipping/freeShipping`);
  const snapShot = await productRef.get();

  if (!snapShot.exists) {
    try {
      await productRef.set({
        value: value,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    try {
      await productRef.update({
        value: value,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  }
};

export const updateBrand = async (productObj) => {
  const productRef = firestore.doc(`brands/${productObj.id}`);
  const product = await productRef.get();
  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const updatedSnapShot = await productRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteBrand = async (id, parentId) => {
  const productRef = firestore.doc(`brands/${id}`);
  const childBrandsRef = firestore
    .collection(`brands`)
    .where("parentBrand", "==", id);
  const childBrands = await childBrandsRef.get();
  try {
    childBrands.forEach(async (doc) => {
      const productRef = firestore.doc(`brands/${doc.data().id}`);
      await productRef.update({
        parentBrand: parentId,
      });
    });
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};
export const getAllCoupons = async () => {
  const productsCollectionRef = firestore.collection("coupons");

  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadCoupon = async (productObj) => {
  const productRef = firestore.doc(`coupons/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a coupon with similar id");
  }
};

export const updateCoupon = async (productObj) => {
  const productRef = firestore.doc(`coupons/${productObj.id}`);
  const product = await productRef.get();
  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const updatedSnapShot = await productRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteCoupon = async (id) => {
  const productRef = firestore.doc(`coupons/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const getAllCategories = async () => {
  const productsCollectionRef = collection(firestore, "categories");
  try {
    const products = await getDocs(productsCollectionRef);
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};
export const getAllCampaigns = async () => {
  const productsCollectionRef = collection(firestore, "campaigns");
  try {
    const products = await getDocs(productsCollectionRef);
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const getAllHomeScreenCategories = async () => {
  // Reference to the "categories" collection
  const categoriesCollectionRef = collection(firestore, "categories");

  // Query to filter documents where "homePage" is true
  const homePageQuery = query(
    categoriesCollectionRef,
    where("homePage", "==", true)
  );

  try {
    // Get documents matching the query
    const querySnapshot = await getDocs(homePageQuery);
    const categoriesArray = [];
    querySnapshot.forEach((doc) => {
      categoriesArray.push(doc.data());
    });
    return categoriesArray;
  } catch (error) {
    alert(error.message);
  }
};

export const getAllTopCategories = async () => {
  const categoriesCollectionRef = collection(firestore, "categories");
  const homePageQuery = query(
    categoriesCollectionRef,
    where("topCategory", "==", true)
  );

  try {
    // Get documents matching the query
    const querySnapshot = await getDocs(homePageQuery);
    const categoriesArray = [];
    querySnapshot.forEach((doc) => {
      categoriesArray.push(doc.data());
    });
    return categoriesArray;
  } catch (error) {
    alert(error.message);
  }
};
export const getAllHomeScreenProducts = async (categoryId) => {
  const productsCollectionRef = collection(firestore, "products");
  const homePageQuery = query(
    productsCollectionRef,
    where("checkedValues", "array-contains", categoryId),
    orderBy("id", "desc"),
    limit(10)
  );

  try {
    // Get documents matching the query
    const querySnapshot = await getDocs(homePageQuery);
    const productsArray = [];
    querySnapshot.forEach((doc) => {
      productsArray.push(doc.data());
    });
    console.log(productsArray);
    return productsArray;
  } catch (error) {
    alert(error.message);
  }
};
export const getAllHomeScreenBestSelling = async (categoryId) => {
  const productsCollectionRef = collection(firestore, "products");
  const homePageQuery = query(
    productsCollectionRef,
    where("checkedValues", "array-contains", categoryId),
    orderBy("id", "desc"),
    limit(3)
  );

  try {
    // Get documents matching the query
    const querySnapshot = await getDocs(homePageQuery);
    const productsArray = [];
    querySnapshot.forEach((doc) => {
      productsArray.push(doc.data());
    });
    console.log(productsArray);
    return productsArray;
  } catch (error) {
    alert(error.message);
  }
};
export const getAllBestSelling = async (categoryId) => {
  const productsCollectionRef = collection(firestore, "products");
  const homePageQuery = query(
    productsCollectionRef,
    where("checkedValues", "array-contains", categoryId),
    orderBy("id", "desc"),
    limit(10)
  );

  try {
    // Get documents matching the query
    const querySnapshot = await getDocs(homePageQuery);
    const productsArray = [];
    querySnapshot.forEach((doc) => {
      productsArray.push(doc.data());
    });
    console.log(productsArray);
    return productsArray;
  } catch (error) {
    alert(error.message);
  }
};

export const getSingleCategoryProducts = async (categories, startAfter) => {
  const productsCollectionRef = collection(firestore, "products");
  let productsQuery;
  console.log(startAfter);
  if (startAfter) {
    productsQuery = query(
      productsCollectionRef,
      where("checkedValues", "array-contains-any", categories),
      orderBy("id", "desc"),
      startAfter(startAfter),
      limit(20)
    );
  } else {
    productsQuery = query(
      productsCollectionRef,
      where("checkedValues", "array-contains-any", categories),
      orderBy("id", "desc"),
      limit(20)
    );
  }
  const querySnapshot = await getDocs(productsQuery);

  // Get the last document for pagination
  const lastProduct = querySnapshot.docs[querySnapshot.docs.length - 1];

  // Map through the documents and return the products array
  const productsArray = querySnapshot.docs.map((doc) => doc.data());
  console.log(productsArray);
  console.log(lastProduct);
  return { productsArray, lastProduct: JSON.stringify(lastProduct) };
};

export const updateSingleProduct = async (product) => {
  const productRef = doc(firestore, `products/${product.id}`);
  console.log(product);
  try {
    // Update the document with the provided product data
    await updateDoc(productRef, { ...product });

    // Fetch the updated document
    const productSnapshot = await getDoc(productRef);
    return productSnapshot.data();
  } catch (error) {
    alert(error.message);
    console.log(error);
  }
};

export const addToCart = async (cartObj, user) => {
  if (user && user.uid) {
    const cartRef = doc(firestore, `carts/${user.uid}`);
    const snapShot = await getDoc(cartRef);

    if (!snapShot.exists()) {
      try {
        await setDoc(cartRef, {
          cart: [cartObj],
        });
        const updatedSnapshot = await getDoc(cartRef);
        return updatedSnapshot.data().cart;
      } catch (error) {
        console.log("Error creating cartProduct:", error.message);
        return [];
      }
    } else {
      const currentCart = snapShot.data().cart;

      if (cartObj.selectedVariation) {
        const productIndex = currentCart.findIndex(
          (cart) => cart.productId === cartObj.productId
        );

        if (productIndex !== -1) {
          const variationIndex = currentCart.findIndex(
            (cart) =>
              cart.selectedVariation &&
              cart.selectedVariation.id === cartObj.selectedVariation.id
          );

          if (variationIndex !== -1) {
            await updateDoc(cartRef, {
              cart: currentCart.map((cart) => {
                if (
                  cart.selectedVariation.id === cartObj.selectedVariation.id
                ) {
                  return {
                    ...cart,
                    quantity:
                      parseInt(cart.quantity) + parseInt(cartObj.quantity),
                  };
                } else {
                  return cart;
                }
              }),
            });
          } else {
            await updateDoc(cartRef, {
              cart: [...currentCart, cartObj],
            });
          }
        } else {
          await updateDoc(cartRef, {
            cart: [...currentCart, cartObj],
          });
        }
      } else {
        const productIndex = currentCart.findIndex(
          (cart) => cart.productId === cartObj.productId
        );

        if (productIndex !== -1) {
          await updateDoc(cartRef, {
            cart: currentCart.map((cart) => {
              if (cart.productId === cartObj.productId) {
                return {
                  ...cart,
                  quantity:
                    parseInt(cart.quantity) + parseInt(cartObj.quantity),
                };
              } else {
                return cart;
              }
            }),
          });
        } else {
          await updateDoc(cartRef, {
            cart: [...currentCart, cartObj],
          });
        }
      }

      const updatedSnapshot = await getDoc(cartRef);
      return updatedSnapshot.data().cart;
    }
  } else {
    return [];
  }
};

export const addToCart2 = (cartObj) => {
  // Retrieve the cart data from localStorage
  const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cartObj.selectedVariation) {
    const productIndex = currentCart.findIndex(
      (cart) => cart.productId === cartObj.productId
    );

    if (productIndex !== -1) {
      const variationIndex = currentCart.findIndex(
        (cart) =>
          cart.selectedVariation &&
          cart.selectedVariation.id === cartObj.selectedVariation.id
      );

      if (variationIndex !== -1) {
        // Update the quantity for the existing variation
        const updatedCart = currentCart.map((cart) => {
          if (cart.selectedVariation.id === cartObj.selectedVariation.id) {
            return {
              ...cart,
              quantity: parseInt(cart.quantity) + parseInt(cartObj.quantity),
            };
          } else {
            return cart;
          }
        });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      } else {
        // Add a new variation of the product
        const updatedCart = [...currentCart, cartObj];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      }
    } else {
      // Add a new product with a variation
      const updatedCart = [...currentCart, cartObj];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    }
  } else {
    const productIndex = currentCart.findIndex(
      (cart) => cart.productId === cartObj.productId
    );

    if (productIndex !== -1) {
      // Update the quantity for the existing product
      const updatedCart = currentCart.map((cart) => {
        if (cart.productId === cartObj.productId) {
          return {
            ...cart,
            quantity: parseInt(cart.quantity) + parseInt(cartObj.quantity),
          };
        } else {
          return cart;
        }
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    } else {
      // Add a new product
      const updatedCart = [...currentCart, cartObj];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    }
  }
};

export const addToOrder = async (orderObj) => {
  if (orderObj.guest) {
    // empty the cart from local storage for guest
    const cart = JSON.parse(localStorage.getItem("cart"));

    // If the cart exists, clear it
    if (cart) {
      localStorage.setItem(`cart`, JSON.stringify([]));
    }
  } else {
    // empty the cart from user
    const cartRef = doc(firestore, `carts/${orderObj.currentUser.id}`);
    const cartSnap = await getDoc(cartRef);

    // First, empty the cart
    if (cartSnap.exists()) {
      await updateDoc(cartRef, {
        cart: [],
      });
    }
  }

  const orderRef = doc(firestore, `orders/${orderObj.id}`);
  const orderSnap = await getDoc(orderRef);

  // If order already exists, return null
  if (orderSnap.exists()) {
    return null;
  } else {
    await setDoc(orderRef, orderObj);
    const updatedSnapshot = await getDoc(orderRef);
    return updatedSnapshot.data();
  }
};

const updateUserAddressGuest = (currentUser, address) => {
  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem(`guest`));
  const addressList = userData?.address || [];

  try {
    let updatedAddressList;
    if (address.defaultShipping) {
      // If the new address is marked as default shipping
      updatedAddressList = addressList.some((addr) => addr.id === address.id)
        ? addressList.map((addr) => {
            if (addr.id === address.id) {
              return address;
            } else if (addr.defaultShipping) {
              return { ...addr, defaultShipping: false };
            } else {
              return addr;
            }
          })
        : [
            address,
            ...addressList.map((addr) =>
              addr.defaultShipping ? { ...addr, defaultShipping: false } : addr
            ),
          ];
    } else {
      // If the new address is not marked as default shipping
      updatedAddressList = addressList.some((addr) => addr.id === address.id)
        ? addressList.map((addr) => (addr.id === address.id ? address : addr))
        : [address, ...addressList];
    }

    // Update the user data in localStorage
    const updatedUserData = { ...userData, address: updatedAddressList };
    localStorage.setItem(`guest`, JSON.stringify(updatedUserData));

    return { ...updatedUserData, id: currentUser.uid };
  } catch (error) {
    alert(error);
    throw error;
  }
};

export const updateUserAddress = async (currentUser, address) => {
  // for guest save the address to localStorage
  if (currentUser.guest) {
    return updateUserAddressGuest(currentUser, address);
  }

  if (!currentUser.uid) {
    return null;
  }
  const userRef = firestore().doc(`users/${currentUser.uid}`);
  const snapShot = await userRef.get();
  console.log(snapShot.data());
  try {
    if (address.defaultShipping) {
      await userRef.update({
        address:
          snapShot.data().address && snapShot.data().address.length > 0
            ? snapShot.data().address.find((addr) => addr.id == address.id)
              ? [
                  ...snapShot.data().address.map((addr) => {
                    if (addr.id == address.id) {
                      return address;
                    } else {
                      if (addr.defaultShipping) {
                        return { ...addr, defaultShipping: false };
                      } else {
                        return addr;
                      }
                    }
                  }),
                ]
              : [
                  address,
                  ...snapShot.data().address.map((addr) => {
                    if (addr.defaultShipping) {
                      return { ...addr, defaultShipping: false };
                    } else {
                      return addr;
                    }
                  }),
                ]
            : [address],
      });
    } else {
      await userRef.update({
        address:
          snapShot.data().address && snapShot.data().address.length > 0
            ? snapShot.data().address.find((addr) => addr.id == address.id)
              ? [
                  ...snapShot.data().address.map((addr) => {
                    if (addr.id == address.id) {
                      return address;
                    } else {
                      return addr;
                    }
                  }),
                ]
              : [address, ...snapShot.data().address]
            : [address],
      });
    }
  } catch (error) {
    alert(error);
  }
  const updatedSnapShot = await userRef.get();
  return { ...updatedSnapShot.data(), id: updatedSnapShot.data().uid };
};

const updateShippingAddressGuest = (currentUser, address) => {
  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem(`guest`));

  if (!userData || !userData.address) {
    alert("User data or addresses not found in localStorage.");
    return null;
  }

  try {
    // Update the address list
    const updatedAddressList = userData.address.map((addr) => {
      if (addr.id === address.id) {
        return { ...addr, defaultShipping: true };
      } else {
        return { ...addr, defaultShipping: false };
      }
    });

    // Save the updated data back to localStorage
    const updatedUserData = { ...userData, address: updatedAddressList };
    localStorage.setItem(`guest`, JSON.stringify(updatedUserData));

    return { ...updatedUserData, id: currentUser.uid };
  } catch (error) {
    alert(error);
    throw error;
  }
};

export const updateShippingAddress = async (currentUser, address) => {
  if (currentUser.guest) {
    return updateShippingAddressGuest(currentUser, address);
  }
  if (!currentUser.uid) {
    return null;
  }
  const userRef = firestore().doc(`users/${currentUser.uid}`);
  const snapShot = await userRef.get();
  console.log(snapShot.data());
  try {
    await userRef.update({
      address: snapShot.data().address.map((addr) => {
        if (address.id == addr.id) {
          return { ...addr, defaultShipping: true };
        } else {
          return { ...addr, defaultShipping: false };
        }
      }),
    });
  } catch (error) {
    alert(error);
  }
  const updatedSnapShot = await userRef.get();
  return { ...updatedSnapShot.data(), id: updatedSnapShot.data().uid };
};

const deleteAddressGuest = (currentUser, address) => {
  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem(`guest`));

  if (!userData || !userData.address) {
    alert("User data or addresses not found in localStorage.");
    return null;
  }

  try {
    // Filter out the address with the matching id
    const updatedAddressList = userData.address.filter(
      (addr) => addr.id !== address.id
    );

    // Update the user data in localStorage
    const updatedUserData = { ...userData, address: updatedAddressList };
    localStorage.setItem(`guest`, JSON.stringify(updatedUserData));

    return { ...updatedUserData, id: currentUser.uid };
  } catch (error) {
    alert(error);
    throw error;
  }
};

export const deleteAddress = async (currentUser, address) => {
  if (currentUser.guest) {
    return deleteAddressGuest(currentUser, address);
  }
  if (!currentUser.uid) {
    return null;
  }
  const userRef = firestore().doc(`users/${currentUser.uid}`);
  const snapShot = await userRef.get();
  console.log(snapShot.data());
  try {
    await userRef.update({
      address: snapShot.data().address.filter((addr) => {
        if (address.id == addr.id) {
          return false;
        } else {
          return true;
        }
      }),
    });
  } catch (error) {
    alert(error);
  }
  const updatedSnapShot = await userRef.get();
  return { ...updatedSnapShot.data(), id: updatedSnapShot.data().uid };
};

export const updateUserGuest = async (currentUser) => {
  try {
    // Retrieve user data from local storage
    const guest = JSON.parse(localStorage.getItem("guest")) || {};
    // Update user data in local storage
    const updatedUser = {
      ...guest,
      ...currentUser,
    };
    // Save the updated users back to local storage
    localStorage.setItem("guest", JSON.stringify(updatedUser));

    return { ...updatedUser, id: currentUser.uid };
  } catch (error) {
    console.error("Error updating user in local storage:", error);
    throw error;
  }
};

export const updateUser = async (currentUser) => {
  if (currentUser.guest) {
    return updateUserGuest(currentUser);
  }
  if (!currentUser.uid) {
    return null;
  }

  const userRef = doc(firestore, `users/${currentUser.uid}`);
  try {
    // Fetch the current user document
    const snapShot = await getDoc(userRef);

    if (!snapShot.exists()) {
      console.error("User not found");
      return null;
    }

    console.log(snapShot.data());

    // Update the user document with merged data
    await updateDoc(userRef, {
      ...snapShot.data(),
      ...currentUser,
    });

    // Fetch the updated user document
    const updatedSnapShot = await getDoc(userRef);
    return { ...updatedSnapShot.data(), id: updatedSnapShot.id };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Re-throw the error for handling elsewhere if needed
  }
};

export const getAllLatestProducts = async (startAfter) => {
  try {
    const productsCollectionRef = collection(firestore, "products");
    let productsQuery;

    // Create the query based on whether `startAfter` exists
    if (startAfter) {
      productsQuery = query(
        productsCollectionRef,
        where("new", "==", true),
        orderBy("id", "desc"),
        startAfterFn(startAfter),
        limit(15)
      );
    } else {
      productsQuery = query(
        productsCollectionRef,
        where("new", "==", true),
        orderBy("id", "desc"),
        limit(15)
      );
    }

    // Fetch the products
    const querySnapshot = await getDocs(productsQuery);

    // Get the last document for pagination
    const lastProduct = querySnapshot.docs[querySnapshot.docs.length - 1];

    // Map through the documents and return the products array
    const productsArray = querySnapshot.docs.map((doc) => doc.data());
    console.log(productsArray);
    console.log(lastProduct);
    return { productsArray, lastProduct: JSON.stringify(lastProduct) };
  } catch (error) {
    console.error("Error fetching products:", error);
    alert(error);
  }
};

export const uploadCategory = async (productObj, homeCategoriesLength) => {
  const productRef = firestore.doc(`categories/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
      const updatedSnapShot = await productRef.get();
      if (productObj.homePosition) {
        const productsCollectionRef = firestore
          .collection("categories")
          .where("homePage", "==", true);
        const products = await productsCollectionRef.get();

        products.forEach(async (doc) => {
          const productRef2 = firestore.doc(`categories/${doc.data().id}`);
          const product2 = await productRef2.get();
          if (
            product2.data().homePosition >= productObj.homePosition &&
            product2.data().id != productObj.id
          ) {
            await productRef2.update({
              homePosition: Number(product2.data().homePosition) + 1,
            });
          }
        });
      }
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a category with similar id");
  }
};

export const updateCategory = async (productObj, homeCategoriesLength) => {
  const productRef = firestore.doc(`categories/${productObj.id}`);
  const product = await productRef.get();
  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const updatedSnapShot = await productRef.get();
    if (productObj.homePosition) {
      const productsCollectionRef = firestore
        .collection("categories")
        .where("homePage", "==", true);
      const products = await productsCollectionRef.get();

      products.forEach(async (doc) => {
        const productRef2 = firestore.doc(`categories/${doc.data().id}`);
        const product2 = await productRef2.get();
        if (product.data().homePosition) {
          // homePostion age thakle shekhetre only swap hobe oi duitar moddhe or

          if (
            product2.data().homePosition == productObj.homePosition &&
            product2.data().id != productObj.id
          ) {
            await productRef2.update({
              homePosition: product.data().homePosition,
            });
          }
        } else {
          if (
            product2.data().homePosition >= productObj.homePosition &&
            product2.data().id != productObj.id
          ) {
            await productRef2.update({
              homePosition: Number(product2.data().homePosition) + 1,
            });
          }
        }
      });
    }
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteCategory = async (productObj, parentId) => {
  const productRef = firestore.doc(`categories/${productObj.id}`);
  const childCategoriesRef = firestore
    .collection(`categories`)
    .where("parentCategory", "==", productObj.id);
  const childCategories = await childCategoriesRef.get();
  try {
    childCategories.forEach(async (doc) => {
      const productRef = firestore.doc(`categories/${doc.data().id}`);
      await productRef.update({
        parentCategory: parentId,
      });
    });
    await productRef.delete();
    if (productObj.homePosition) {
      const productsCollectionRef = firestore
        .collection("categories")
        .where("homePage", "==", true);
      const products = await productsCollectionRef.get();

      products.forEach(async (doc) => {
        const productRef2 = firestore.doc(`categories/${doc.data().id}`);
        const product2 = await productRef2.get();
        if (
          product2.data().homePosition >= productObj.homePosition &&
          product2.data().id != productObj.id
        ) {
          await productRef2.update({
            homePosition: Number(product2.data().homePosition) - 1,
          });
        }
      });
    }
  } catch (error) {
    alert(error);
  }
};
export const getAllBanners = async () => {
  const productsCollectionRef = collection(firestore, "banners");

  try {
    const products = await getDocs(productsCollectionRef);
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadBanner = async (productObj) => {
  const productRef = firestore.doc(`banners/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (productObj.secondBanner) {
    const collectionRef = firestore
      .collection(`banners`)
      .where("secondBanner", "==", true);
    const collection = await collectionRef.get();
    collection.forEach(async (doc) => {
      const bannerRef = firestore.doc(`banners/${doc.data().id}`);
      await bannerRef.update({
        secondBanner: false,
      });
    });
  }
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a category with similar id");
  }
};

export const updateBanner = async (productObj) => {
  const productRef = firestore.doc(`banners/${productObj.id}`);
  const product = await productRef.get();
  if (productObj.secondBanner) {
    const collectionRef = firestore
      .collection(`banners`)
      .where("secondBanner", "==", true);
    const collection = await collectionRef.get();
    collection.forEach(async (doc) => {
      const bannerRef = firestore.doc(`banners/${doc.data().id}`);
      await bannerRef.update({
        secondBanner: false,
      });
    });
  }
  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const updatedSnapShot = await productRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteBanner = async (id) => {
  const productRef = firestore.doc(`banners/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};

export const getAllTags = async () => {
  const productsCollectionRef = firestore.collection("tags");

  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadTag = async (productObj) => {
  const productRef = firestore.doc(`tags/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a tag with similar id");
  }
};

export const updateTag = async (productObj) => {
  const productRef = firestore.doc(`tags/${productObj.id}`);

  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const updatedSnapShot = await productRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteTag = async (id) => {
  const productRef = firestore.doc(`tags/${id}`);
  try {
    await productRef.delete();
  } catch (error) {
    alert(error);
  }
};
export const getAllAttributes = async () => {
  const productsCollectionRef = firestore.collection("attributes");
  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadAttribute = async (productObj) => {
  const productRef = firestore.doc(`attributes/${productObj.id}`);
  const snapShot = await productRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (!snapShot.exists) {
    try {
      await productRef.set({
        ...newProductObj,
        enableVisibility: true,
        enableVariations: true,
      });
      const updatedSnapShot = await productRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a attribute with similar id");
  }
};

export const updateAttribute = async (productObj) => {
  const productRef = firestore.doc(`attributes/${productObj.id}`);
  try {
    delete productObj.file;
    await productRef.update({ ...productObj });
    const updatedSnapShot = await productRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteAttribute = async (id) => {
  const attrRef = firestore.doc(`attributes/${id}`);
  const termsRef = firestore
    .collection(`attributeTerms`)
    .where("parentId", "==", id);
  const terms = await termsRef.get();
  try {
    await attrRef.delete();
    terms.forEach(async (doc) => {
      const termRef = firestore.doc(`attributes/${doc.data().id}`);
      await termRef.delete();
    });
  } catch (error) {
    alert(error);
  }
};

export const getAllAttributeTerms = async (id) => {
  const productsCollectionRef = firestore
    .collection("attributeTerms")
    .where("parentId", "==", id);
  try {
    const products = await productsCollectionRef.get();
    const productsArray = [];
    products.forEach((doc) => {
      productsArray.push(doc.data());
    });
    return productsArray;
  } catch (error) {
    alert(error);
  }
};

export const uploadAttributeTerm = async (productObj) => {
  const termRef = firestore.doc(`attributeTerms/${productObj.id}`);
  const attrRef = firestore.doc(`attributes/${productObj.parentId}`);
  const snapShot = await termRef.get();
  const attr = await attrRef.get();
  const newProductObj = { ...productObj, file: "" };
  if (!snapShot.exists) {
    try {
      await termRef.set({
        ...newProductObj,
      });
      await attrRef.update({
        terms: [...attr.data().terms, newProductObj],
      });
      const updatedSnapShot = await termRef.get();
      return updatedSnapShot.data();
    } catch (error) {
      alert(error);
    }
  } else {
    alert("there is already a terms with similar id");
  }
};

export const updateAttributeTerm = async (productObj) => {
  const termRef = firestore.doc(`attributeTerms/${productObj.id}`);
  const attrRef = firestore.doc(`attributes/${productObj.parentId}`);
  const attr = await attrRef.get();
  const newTerms = attr.data().terms.map((term) => {
    if (term.id == productObj.id) {
      return productObj;
    } else {
      return term;
    }
  });
  try {
    delete productObj.file;
    await termRef.update({ ...productObj });
    await attrRef.update({
      terms: newTerms,
    });
    const updatedSnapShot = await termRef.get();
    return updatedSnapShot.data();
  } catch (error) {
    alert(error);
  }
};

export const deleteAttributeTerm = async (id, parentId) => {
  const termRef = firestore.doc(`attributeTerms/${id}`);
  const attrRef = firestore.doc(`attributes/${parentId}`);
  const attr = await attrRef.get();
  const newTerms = attr.data().terms.filter((term) => term.id !== id);
  try {
    await termRef.delete();
    await attrRef.update({
      terms: newTerms,
    });
  } catch (error) {
    alert(error);
  }
};

// const fetchFirestoreData = async () => {
//   console.log("clicked");
//   const docs = [];
//   const querySnapshot = await getDocs(collection(firestore, "products"));
//   querySnapshot.forEach((doc) => {
//     docs.push({ id: doc.id, ...doc.data() });
//   });
//   return docs;
// };

// export const updateAlgoliaRecords = async () => {
//   const firestoreData = await fetchFirestoreData();
//   // Map Firestore data to Algolia-compatible format
//   const recordsToUpdate = firestoreData.map((doc) => ({
//     objectID: doc.id, // Algolia's unique identifier for records
//     name: doc.name,
//     selectedBrands: doc.selectedBrands,
//     selectedCategories: doc.selectedCategories,
//     selectedTags: doc.selectedTags,
//     price: doc.price,
//     pictures: doc.pictures, // Ensure imageField is included
//   }));
//   // Batch update Algolia records
//   try {
//     const response = await searchClient.saveObjects(
//       "products",
//       recordsToUpdate
//     );

//     console.log("Algolia records updated successfully:", response);
//   } catch (error) {
//     console.error("Error updating Algolia records:", error);
//   }
// };
