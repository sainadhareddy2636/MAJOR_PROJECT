import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionEmail, logoutUser, syncSession } from "@/lib/auth";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    setSessionEmail(getSessionEmail());
    void syncSession().then((email) => setSessionEmail(email));

    const handleAuthChanged = () => {
      setSessionEmail(getSessionEmail());
    };

    window.addEventListener("poseperfect:auth-changed", handleAuthChanged);
    return () => {
      window.removeEventListener("poseperfect:auth-changed", handleAuthChanged);
    };
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setSessionEmail(null);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-wellness rounded-lg"></div>
            <span className="text-xl font-bold text-foreground">PosePerfect</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-medium"
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-medium"
            >
              Recommendations
            </NavLink>
            <NavLink
              to="/asanas"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-medium"
            >
              Asanas
            </NavLink>
            <NavLink
              to="/progress"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-medium"
            >
              Progress
            </NavLink>
            {sessionEmail ? (
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() => void handleLogout()}
              >
                Logout
              </Button>
            ) : (
              <Button
                className="bg-gradient-wellness hover:opacity-90 transition-opacity"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            <NavLink
              to="/"
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              activeClassName="text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              activeClassName="text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              Recommendations
            </NavLink>
            <NavLink
              to="/asanas"
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              activeClassName="text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              Asanas
            </NavLink>
            <NavLink
              to="/progress"
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              activeClassName="text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              Progress
            </NavLink>
            {sessionEmail ? (
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10"
                onClick={() => {
                  setIsOpen(false);
                  void handleLogout();
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                className="w-full bg-gradient-wellness hover:opacity-90 transition-opacity"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/register");
                }}
              >
                Get Started
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
