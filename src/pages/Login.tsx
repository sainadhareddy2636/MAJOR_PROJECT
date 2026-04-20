import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/lib/auth";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = (location.state as { from?: string } | null)?.from || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Missing details",
        description: "Enter both email and password to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await loginUser(email.trim(), password);
    setIsSubmitting(false);

    if (!result.ok) {
      toast({
        title: "Login failed",
        description: result.message ?? "Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Login successful",
      description: "Welcome back. Redirecting to recommendations...",
    });
    setTimeout(() => navigate(redirectTo), 600);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-lg">
          <Card className="p-8 bg-background shadow-medium border-border">
            <div className="space-y-3 mb-8 text-center">
              <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
              <p className="text-muted-foreground">
                Use your email to access your PosePerfect account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-wellness hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Create an account
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
