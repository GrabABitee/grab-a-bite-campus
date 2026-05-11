import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function AdminEntryPage() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">

        {/* SETUP MENU */}
        <Card className="cursor-pointer hover:shadow-xl transition">
          <CardContent className="p-8 text-center space-y-4">

            <h2 className="text-xl font-semibold">
              Setup Menu
            </h2>

            <p className="text-muted-foreground">
              Configure breakfast, lunch & dinner menu
            </p>

            <Button
              className="w-full"
              onClick={() => navigate("/admin/standard-menu")}
            >
              Start Setup
            </Button>

          </CardContent>
        </Card>

        {/* DASHBOARD */}
        <Card className="cursor-pointer hover:shadow-xl transition">
          <CardContent className="p-8 text-center space-y-4">

            <h2 className="text-xl font-semibold">
              Go to Dashboard
            </h2>

            <p className="text-muted-foreground">
              View orders, analytics & operations
            </p>

            <Button
              className="w-full"
              variant="secondary"
              onClick={() => navigate("/admin")}
            >
              Open Dashboard
            </Button>

          </CardContent>
        </Card>

      </div>

    </div>
  );
}