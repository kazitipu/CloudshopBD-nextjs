const initialState = {
  cartData: [],
  orders: [],
  freeShipping: 0,
  total: 0,
  coupon: null,
  orderNote: "",
};
const cartReducer = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cartData: payload,
      };
    case "SET_CART":
      return {
        ...state,
        cartData: payload,
      };
    case "SET_ORDER_NOTE":
      return {
        ...state,
        orderNote: payload,
      };
    case "ADD_TO_ORDER":
      return {
        ...state,
        orders: [payload, ...state.orders],
        cartData: [],
      };
    case "GET_SINGLE_ORDER":
      return {
        ...state,
        orders: [payload, ...state.orders],
      };
    case "GET_ALL_ORDERS":
      return {
        ...state,
        orders: payload,
      };

    case "UPDATE_ORDER":
      return {
        ...state,
        orders:
          state.orders.length > 0
            ? state.orders.map((order) => {
                if (order.id == action.payload.id) {
                  return action.payload;
                } else {
                  return order;
                }
              })
            : [action.payload],
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartData: payload,
      };
    case "SET_REDUX_CART":
      return {
        ...state,
        cartData: payload,
      };
    case "SET_TOTAL_REDUX":
      return {
        ...state,
        total: payload,
      };
    case "SET_COUPON_REDUX":
      return {
        ...state,
        coupon: payload,
      };
    case "SET_FREE_SHIPPING":
      return {
        ...state,
        freeShipping: payload,
      };
    case "INCREMENT_QUANTITY":
      return {
        ...state,
        cartData: state.cartData.map((cartItem) => {
          console.log(payload);
          console.log(payload.selectedVariation);

          console.log(payload.selectedVariation.id);
          if (payload.selectedVariation && payload.selectedVariation.id) {
            if (cartItem.selectedVariation) {
              if (
                cartItem.selectedVariation.id === payload.selectedVariation.id
              ) {
                console.log(cartItem);
                console.log(payload);
                return {
                  ...cartItem,
                  quantity: parseInt(cartItem.quantity) + 1,
                };
              } else {
                return cartItem;
              }
            } else {
              return cartItem;
            }
          } else {
            if (cartItem.productId == payload.productId) {
              return { ...cartItem, quantity: parseInt(cartItem.quantity) + 1 };
            } else {
              return cartItem;
            }
          }
        }),
      };
    case "DECREMENT_QUANTITY":
      return {
        ...state,
        cartData: state.cartData.map((cartItem) => {
          if (payload.selectedVariation && payload.selectedVariation.id) {
            if (
              cartItem.selectedVariation &&
              cartItem.selectedVariation.id == payload.selectedVariation.id
            ) {
              return {
                ...cartItem,
                quantity:
                  cartItem.quantity > 1 ? parseInt(cartItem.quantity) - 1 : 1,
              };
            } else {
              return cartItem;
            }
          } else {
            if (cartItem.productId == payload.productId) {
              return {
                ...cartItem,
                quantity:
                  cartItem.quantity > 1 ? parseInt(cartItem.quantity) - 1 : 1,
              };
            } else {
              return cartItem;
            }
          }
        }),
      };
    case "SET_QUANTITY":
      return {
        ...state,
        cartData: state.cartData.map((cartItem) => {
          if (
            payload.item.selectedVariation &&
            payload.item.selectedVariation.id
          ) {
            if (
              cartItem.selectedVariation &&
              cartItem.selectedVariation.id == payload.item.selectedVariation.id
            ) {
              return {
                ...cartItem,
                quantity:
                  payload.quantity && payload.quantity > 0
                    ? parseInt(payload.quantity)
                    : cartItem.quantity,
              };
            } else {
              return cartItem;
            }
          } else {
            if (cartItem.productId == payload.item.productId) {
              return {
                ...cartItem,
                quantity:
                  payload.quantity && payload.quantity > 0
                    ? parseInt(payload.quantity)
                    : cartItem.quantity,
              };
            } else {
              return cartItem;
            }
          }
        }),
      };
    default:
      return state;
  }
};

export default cartReducer;
