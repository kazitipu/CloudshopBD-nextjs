const INITIAL_STATE = {
  products: [],
  productObj: null,
  lastProduct: null,
  screenshots: [],
};

const setProductsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // case "GET_ALL_PRODUCTS":
    //   return { ...state, products: [...action.payload] };
    case "GET_ALL_SINGLE_CATEGORY_PRODUCTS":
      return {
        ...state,
        products: [...action.payload.productsArray],
        lastProduct: action.payload.lastProduct,
      };

    case "GET_SINGLE_PRODUCT":
      return { ...state, productObj: action.payload };
    case "GET_ALL_SCREENSHOT":
      return { ...state, screenshots: [...action.payload] };
    case "UPDATE_PRODUCT":
      const updatedProductsArray = state.products.map((product) => {
        if (product.id == action.payload.id) {
          return action.payload;
        } else {
          return product;
        }
      });
      return { ...state, products: [...updatedProductsArray] };
    case "DELETE_PRODUCT":
      const filteredProductsArray = state.products.filter(
        (product) => product.id !== action.payload
      );
      return { ...state, products: [...filteredProductsArray] };

    default:
      return { ...state };
  }
};
export default setProductsReducer;
