import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CartPage() {
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ================================= */
  /* PLACE ORDER */
  /* ================================= */
  const handlePlaceOrder = async () => {
    try {
      const user = await api.getCurrentUser();
  
      if (!user?.cafeteriaId) {
        alert("No cafeteria assigned");
        return;
      }
  
      const payload = {
        cafeteriaId: user.cafeteriaId,
  
        orderItems: cart.map((item: any) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      };
  
      console.log("ORDER PAYLOAD:", payload);
  
      await api.placeOrder(payload);
  
      clearCart();
  
      alert("Order placed successfully!");
  
      navigate("/student/orders");
  
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  /* ================================= */
  /* EMPTY CART */
  /* ================================= */

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">

        <div className="flex justify-center mb-4">
          <div className="bg-orange-100 p-5 rounded-full">
            <ShoppingBag className="h-10 w-10 text-orange-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3">
          Your Cart is Empty
        </h1>

        <p className="text-muted-foreground mb-8">
          Add delicious food items to continue 🍔
        </p>

        <Button
          onClick={() => navigate("/dashboard")}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Browse Menu
        </Button>

      </div>
    );
  }

  /* ================================= */
  /* MAIN CART */
  /* ================================= */

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">

      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Your Cart
        </h1>

        <p className="text-muted-foreground mt-2">
          Review your order before checkout
        </p>
      </div>

      {/* CART ITEMS */}

      <div className="space-y-4">

        {cart.map((item) => (

          <Card
            key={item.menuItemId}
            className="p-5 rounded-2xl border"
          >

            <div className="flex items-center justify-between">

              {/* LEFT */}

              <div className="flex items-center gap-4">

                <img
                  src={
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                  }
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />

                <div>

                  <h2 className="font-semibold text-lg">
                    {item.name}
                  </h2>

                  <p className="text-orange-500 font-bold text-lg">
                    ₹{item.price}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>

                </div>

              </div>

              {/* RIGHT */}

              <div className="flex items-center gap-3">

                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  onClick={() =>
                    removeFromCart(item.menuItemId)
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="font-semibold text-lg w-6 text-center">
                  {item.quantity}
                </span>

                <Button
                  size="icon"
                  className="rounded-full bg-orange-500 hover:bg-orange-600"
                  onClick={() =>
                    addToCart({
                      ...item,
                      quantity: 1,
                    })
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>

              </div>

            </div>

          </Card>
        ))}

      </div>

      {/* TOTAL */}

      <div className="mt-10 border-t pt-8">

        <div className="flex justify-between items-center text-2xl font-bold mb-6">

          <span>Total</span>

          <span className="text-orange-500">
            ₹{total}
          </span>

        </div>

        {/* BUTTONS */}

        <div className="space-y-3">

          <Button
            onClick={handlePlaceOrder}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg rounded-2xl"
          >
            Pay ₹{total} & Place Order
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-2xl"
            onClick={clearCart}
          >
            Clear Cart
          </Button>

        </div>

      </div>

    </div>
  );
}