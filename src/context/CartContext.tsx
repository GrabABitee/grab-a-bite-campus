import {
  createContext,
  useContext,
  useState,
} from "react";

type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (
    item: CartItem
  ) => void;

  removeFromCart: (
    menuItemId: string
  ) => void;

  clearCart: () => void;
};

const CartContext =
  createContext<CartContextType | null>(
    null
  );

export const CartProvider = ({
  children,
}: any) => {

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const addToCart = (
    item: CartItem
  ) => {

    setCart((prev) => {

      const existing =
        prev.find(
          (i) =>
            i.menuItemId ===
            item.menuItemId
        );

      if (existing) {

        return prev.map((i) =>

          i.menuItemId ===
          item.menuItemId

            ? {
                ...i,
                quantity:
                  i.quantity +
                  item.quantity,
              }

            : i
        );
      }

      return [...prev, item];
    });
  };

  const removeFromCart = (
    menuItemId: string
  ) => {

    setCart((prev) =>
      prev.filter(
        (i) =>
          i.menuItemId !==
          menuItemId
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >

      {children}

    </CartContext.Provider>
  );
};

export const useCart = () => {

  const context =
    useContext(CartContext);

  if (!context) {

    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};