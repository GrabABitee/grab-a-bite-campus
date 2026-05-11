import {
    useEffect,
    useState
  } from "react";
  
  import { api } from "@/lib/api";
  
  import {
    Badge
  } from "@/components/ui/badge";
  
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
  } from "@/components/ui/card";
  
  import {
    Clock,
    Receipt
  } from "lucide-react";
  
  export default function Orders() {
  
    const [orders, setOrders] =
      useState<any[]>([]);
  
    useEffect(() => {
  
      loadOrders();
  
      const interval =
        setInterval(() => {
  
          loadOrders();
  
        }, 5000);
  
      return () =>
        clearInterval(interval);
  
    }, []);
  
    const loadOrders = async () => {
  
      try {
  
        const data =
          await api.get("/orders");
  
        setOrders(data);
  
      } catch (error) {
  
        console.log(error);
      }
    };
  
    const getStatusColor = (
      status: string
    ) => {
  
      switch (status) {
  
        case "PENDING":
          return "bg-gray-500";
  
        case "ACCEPTING":
          return "bg-blue-500";
  
        case "PREPARING":
          return "bg-yellow-500";
  
        case "READY_FOR_PICKUP":
          return "bg-green-500";
  
        case "COMPLETED":
          return "bg-purple-500";
  
        default:
          return "bg-red-500";
      }
    };
  
    return (
  
      <div className="space-y-4">
  
        <h1 className="text-3xl font-bold">
          My Orders
        </h1>
  
        {orders.map((order) => (
  
          <Card key={order.orderId}>
  
            <CardHeader>
  
              <div className="flex justify-between">
  
                <CardTitle>
                  Order #{order.pickupCode}
                </CardTitle>
  
                <Badge
                  className={
                    getStatusColor(
                      order.status
                    )
                  }
                >
                  {order.status}
                </Badge>
  
              </div>
  
            </CardHeader>
  
            <CardContent>
  
              <div className="space-y-2">
  
                {order.orderItems?.map(
                  (item: any) => (
  
                    <div
                      key={item.id}
                      className="flex justify-between"
                    >
  
                      <span>
                        {
                          item.menuItem?.name
                        }
                      </span>
  
                      <span>
                        x{item.quantity}
                      </span>
  
                    </div>
                  )
                )}
  
              </div>
  
              <div className="mt-4 flex justify-between">
  
                <div className="flex items-center gap-2">
  
                  <Clock className="h-4 w-4" />
  
                  <span>
                    {order.status}
                  </span>
  
                </div>
  
                <div className="font-bold">
  
                  ₹{order.totalAmount}
  
                </div>
  
              </div>
  
              {order.status ===
                "READY_FOR_PICKUP" && (
  
                <div className="mt-4 bg-green-100 p-4 rounded-xl">
  
                  <div className="flex items-center gap-2">
  
                    <Receipt className="h-4 w-4" />
  
                    <span className="font-bold">
                      Pickup Code
                    </span>
  
                  </div>
  
                  <p className="text-2xl font-bold">
  
                    {order.pickupCode}
  
                  </p>
  
                </div>
              )}
  
            </CardContent>
  
          </Card>
        ))}
  
      </div>
    );
  }