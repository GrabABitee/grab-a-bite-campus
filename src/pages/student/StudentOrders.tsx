import {
    Clock,
    CheckCircle,
    ChefHat,
    Package,
  } from "lucide-react";
  
  import {
    Card,
    CardContent,
  } from "@/components/ui/card";
  
  import { Badge } from "@/components/ui/badge";
  
  import {
    useEffect,
    useState,
  } from "react";
  
  import { api } from "@/lib/api";
  
  export default function StudentOrders() {
  
    const [orders, setOrders] = useState<any[]>([]);
  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
  
      loadOrders();
  
      const interval = setInterval(() => {
        loadOrders();
      }, 5000);
  
      return () => clearInterval(interval);
  
    }, []);
  
    const loadOrders = async () => {
  
      try {
  
        const data = await api.getOrders();
  
        setOrders(data);
  
      } catch (err) {
  
        console.error(err);
  
      } finally {
  
        setLoading(false);
      }
    };
  
    const getStatusColor = (
      status: string
    ) => {
  
      switch (status) {
  
        case "PENDING":
          return "bg-yellow-100 text-yellow-700";
  
        case "PREPARING":
          return "bg-blue-100 text-blue-700";
  
        case "READY":
          return "bg-green-100 text-green-700";
  
        case "COMPLETED":
          return "bg-gray-100 text-gray-700";
  
        default:
          return "bg-gray-100 text-gray-700";
      }
    };
  
    const getETA = (status: string) => {
  
      switch (status) {
  
        case "PENDING":
          return "15-20 mins";
  
        case "PREPARING":
          return "5-10 mins";
  
        case "READY":
          return "Ready now";
  
        case "COMPLETED":
          return "Delivered";
  
        default:
          return "--";
      }
    };
  
    if (loading) {
  
      return (
        <div className="p-6">
          Loading orders...
        </div>
      );
    }
  
    return (
  
      <div className="p-6 space-y-6">
  
        <div>
  
          <h1 className="text-3xl font-bold">
            My Orders
          </h1>
  
          <p className="text-muted-foreground">
            Track live cafeteria orders
          </p>
  
        </div>
  
        {orders.length === 0 ? (
  
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No orders placed yet.
            </CardContent>
          </Card>
  
        ) : (
  
          orders.map((order: any) => (
  
            <Card
              key={order.orderId}
              className="overflow-hidden"
            >
  
              <CardContent className="p-6 space-y-5">
  
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  
                  <div>
  
                    <div className="flex items-center gap-2 mb-2">
  
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
  
                      <span className="text-sm text-muted-foreground">
                        {order.cafeteriaName}
                      </span>
  
                    </div>
  
                    <h2 className="font-bold text-xl">
                      Pickup Code: {order.pickupCode}
                    </h2>
  
                  </div>
  
                  <div className="text-right">
  
                    <div className="text-2xl font-bold text-orange-500">
                      ₹{order.totalAmount}
                    </div>
  
                    <p className="text-sm text-muted-foreground">
                      Paid Successfully
                    </p>
  
                  </div>
  
                </div>
  
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  
                  <div className="bg-muted rounded-xl p-4 flex items-center gap-3">
  
                    <Clock className="h-5 w-5 text-orange-500" />
  
                    <div>
                      <p className="text-sm text-muted-foreground">
                        ETA
                      </p>
                      <p className="font-semibold">
                        {getETA(order.status)}
                      </p>
                    </div>
  
                  </div>
  
                  <div className="bg-muted rounded-xl p-4 flex items-center gap-3">
  
                    <ChefHat className="h-5 w-5 text-orange-500" />
  
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Cafeteria
                      </p>
                      <p className="font-semibold">
                        {order.cafeteriaName}
                      </p>
                    </div>
  
                  </div>
  
                  <div className="bg-muted rounded-xl p-4 flex items-center gap-3">
  
                    <Package className="h-5 w-5 text-orange-500" />
  
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Items
                      </p>
                      <p className="font-semibold">
                        {order.items?.length || 0}
                      </p>
                    </div>
  
                  </div>
  
                </div>
  
                <div className="space-y-3">
  
                  <h3 className="font-semibold text-lg">
                    Order Items
                  </h3>
  
                  {order.items?.map((item: any, index: number) => (
  
                    <div
                      key={index}
                      className="flex items-center justify-between border rounded-xl p-3"
                    >
  
                      <div className="flex items-center gap-3">
  
                        <img
                          src={item.imageUrl}
                          alt={item.itemName}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
  
                        <div>
                          <h4 className="font-medium">
                            {item.itemName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
  
                      </div>
  
                      <div className="font-semibold text-orange-500">
                        ₹{item.price}
                      </div>
  
                    </div>
  
                  ))}
  
                </div>
  
                {order.status === "READY" && (
  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
  
                    <CheckCircle className="h-6 w-6 text-green-600" />
  
                    <div>
                      <p className="font-semibold text-green-700">
                        Your order is ready for pickup!
                      </p>
                      <p className="text-sm text-green-600">
                        Show pickup code at counter.
                      </p>
                    </div>
  
                  </div>
  
                )}
  
              </CardContent>
  
            </Card>
  
          ))
  
        )}
  
      </div>
    );
  }