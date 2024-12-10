import React, { useReducer, useContext } from 'react';

// Initialize the context
const CartContext = React.createContext();

// Define the default state
const initialState = {
  itemsById: {},
  allItems: [],
};

// Define reducer actions
const ADD_ITEM = 'ADD_ITEM';
const REMOVE_ITEM = 'REMOVE_ITEM';
const UPDATE_ITEM_QUANTITY = 'UPDATE_ITEM_QUANTITY';

// Define the reducer
const cartReducer = (state, action) => {
  const { payload } = action;
  switch (action.type) {
    case ADD_ITEM:
      const newState = {
        ...state,
        itemsById: {
          ...state.itemsById,
          [payload._id]: {
            ...payload,
            quantity: state.itemsById[payload._id]
              ? state.itemsById[payload._id].quantity + 1
              : 1,
          },
        },
        allItems: Array.from(new Set([...state.allItems, payload._id])),
      };
      return newState;

    case REMOVE_ITEM:
      const updatedState = {
        ...state,
        itemsById: Object.entries(state.itemsById)
          .filter(([key]) => key !== payload._id)
          .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
          }, {}),
        allItems: state.allItems.filter((itemId) => itemId !== payload._id),
      };
      return updatedState;

    case UPDATE_ITEM_QUANTITY:
      const currentItem = state.itemsById[payload._id];
      if (!currentItem) return state; // If the item doesn't exist, return the state unchanged

      const updatedItem = {
        ...currentItem,
        quantity: payload.quantity, // Directly set the new quantity
      };

      const updatedItemsById = {
        ...state.itemsById,
        [payload._id]: updatedItem,
      };

      return {
        ...state,
        itemsById: updatedItemsById,
      };

    default:
      return state;
  }
};

// Define the provider
const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: ADD_ITEM, payload: product });
  };

  const updateItemQuantity = (productId, quantityChange) => {
    const currentItem = state.itemsById[productId];
    if (!currentItem) return; // Prevent errors if the item doesn't exist

    const newQuantity = currentItem.quantity + quantityChange;

    // Ensure quantity can't go below 1
    if (newQuantity > 0) {
      dispatch({
        type: UPDATE_ITEM_QUANTITY,
        payload: { _id: productId, quantity: newQuantity },
      });
    }
  };

  const removeFromCart = (product) => {
    dispatch({ type: REMOVE_ITEM, payload: product });
  };

  const getCartItems = () => {
    return state.allItems.map((itemId) => state.itemsById[itemId]) ?? [];
  };

  const getCartTotal = () => {
    return getCartItems().reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: getCartItems(),
        addToCart,
        removeFromCart,
        getCartTotal,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { CartProvider, useCart };
