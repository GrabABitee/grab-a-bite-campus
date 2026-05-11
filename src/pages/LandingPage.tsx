import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { useToast } from "@/components/ui/use-toast";

import { api } from "@/lib/api";

import { UtensilsCrossed } from "lucide-react";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {

  const navigate = useNavigate();

  const { toast } = useToast();

  const { setAuth } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  /*
  LOGIN
  */

  const handleLogin = async () => {

    if (!email || !password) {

      toast({
        title: "Missing fields",
        description:
          "Enter email and password",
        variant: "destructive",
      });

      return;
    }

    try {

      setIsLoading(true);

      /*
      LOGIN API
      */

      const authData =
        await api.login(
          email,
          password
        );

      console.log(
        "LOGIN DATA:",
        authData
      );

      /*
      SAVE AUTH
      */

      localStorage.setItem(
        "auth",
        JSON.stringify(authData)
      );

      /*
      UPDATE CONTEXT
      */

      setAuth(authData);

      /*
      GET CURRENT USER
      */

      const user =
        await api.getCurrentUser();

      console.log(
        "CURRENT USER:",
        user
      );

      toast({
        title:
          "Login Successful",
      });

      const isAdmin =
        user.roles.includes(
          "ADMIN"
        );

      const isCafeAdmin =
        user.roles.includes(
          "CAFETERIA_ADMIN"
        );

      /*
      ADMIN
      */

      if (isAdmin) {

        navigate("/admin/entry");

        return;
      }

      /*
      CAFETERIA ADMIN
      */

      if (
        isCafeAdmin &&
        user.cafeteriaId
      ) {

        navigate("/admin/entry");

        return;
      }

      /*
      STUDENT ONBOARDING
      */

      if (
        !user.collegeId ||
        !user.cafeteriaId
      ) {

        navigate("/onboarding");

        return;
      }

      /*
      STUDENT DASHBOARD
      */

      navigate("/dashboard");

    } catch (error) {

      console.error(error);

      toast({
        title: "Login Failed",
        description:
          "Invalid email or password",
        variant: "destructive",
      });

    } finally {

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">

      <Card className="w-full max-w-md shadow-xl">

        <CardHeader className="text-center space-y-4">

          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">

            <UtensilsCrossed className="h-8 w-8 text-white" />

          </div>

          <div>

            <CardTitle className="text-2xl">
              Welcome Back
            </CardTitle>

            <CardDescription>
              Sign in to continue to Grab A Bite
            </CardDescription>

          </div>

        </CardHeader>

        <CardContent className="space-y-5">

          <div className="space-y-2">

            <Label>Email</Label>

            <Input
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

          </div>

          <div className="space-y-2">

            <Label>Password</Label>

            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
            variant="food"
          >

            {isLoading
              ? "Signing In..."
              : "Sign In"}

          </Button>

        </CardContent>

      </Card>

    </div>
  );
}