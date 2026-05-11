import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface FoodItem {
  menuItemId: string;

  cafeteria?: {
    cafeteriaId: string;
  };

  name: string;
  description: string;
  price: number;

  imageUrl?: string;
  category?: string;
  rating?: number;
  isVeg?: boolean;
  isAvailable?: boolean;
  prepTime?: number;
}

interface FoodCardProps {
  item: FoodItem;
  className?: string;
}

export const FoodCard = ({
  item,
  className,
}: FoodCardProps) => {

  const {
    cart,
    addToCart,
    removeFromCart,
  } = useCart();

  const cartItem = cart.find(
    (c: any) =>
      c.menuItemId === item.menuItemId
  );

  const quantity = cartItem?.quantity || 0;

  return (

    <Card
      className={cn(
        "flex overflow-hidden transition-all duration-200 hover:shadow-md",
        !item.isAvailable && "opacity-60",
        className
      )}
    >

      {/* IMAGE */}

      <div className="relative w-24 h-24 flex-shrink-0">

        <img
          src={
            item.imageUrl ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400"
          }
          alt={item.name}
          className="w-full h-full object-cover"
        />

      </div>

      {/* CONTENT */}

      <CardContent className="p-3 flex-1 flex flex-col justify-between">

        <div className="space-y-1">

          <div className="flex items-start justify-between">

            <h3 className="font-medium text-sm text-foreground leading-tight line-clamp-1">
              {item.name}
            </h3>

            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">

              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />

              {item.rating || 4.5}

            </div>

          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center justify-between">

            <div className="text-base font-bold text-primary">
              ₹{item.price}
            </div>

            {item.prepTime && (
              <span className="text-xs text-muted-foreground">
                {item.prepTime}m
              </span>
            )}

          </div>

        </div>

        {/* ACTIONS */}

        <div className="flex items-center justify-between mt-2">

          {!item.isAvailable ? (

            <Button
              variant="ghost"
              size="sm"
              disabled
              className="text-xs"
            >
              Out of Stock
            </Button>

          ) : quantity === 0 ? (

            <Button
              variant="food"
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() =>
                addToCart({
                  menuItemId: item.menuItemId,

                  name: item.name,

                  price: item.price,

                  imageUrl: item.imageUrl,

                  quantity: 1,
                })
              }
            >

              <Plus className="h-3 w-3 mr-1" />

              Add

            </Button>

          ) : (

            <div className="flex items-center gap-2">

              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() =>
                  removeFromCart(item.menuItemId)
                }
              >
                <Minus className="h-3 w-3" />
              </Button>

              <span className="font-medium text-sm w-4 text-center">
                {quantity}
              </span>

              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() =>
                  addToCart({
                    menuItemId: item.menuItemId,


                    name: item.name,

                    price: item.price,

                    imageUrl: item.imageUrl,

                    quantity: 1,
                  })
                }
              >
                <Plus className="h-3 w-3" />
              </Button>

            </div>

          )}

          {quantity > 0 && (

            <div className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-lg">

              ₹{item.price * quantity}

            </div>

          )}

        </div>

      </CardContent>

    </Card>
  );
};