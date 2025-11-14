import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

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
              Dashboard
            </NavLink>
            <NavLink
              to="/asanas"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-medium"
            >
              Asanas
            </NavLink>
            <NavLink
              to="/session"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-medium"
            >
              Live Session
            </NavLink>
            <NavLink
              to="/progress"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary font-medium"
            >
              Progress
            </NavLink>
            <Button className="bg-gradient-wellness hover:opacity-90 transition-opacity">
              Get Started
            </Button>
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
              Dashboard
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
              to="/session"
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              activeClassName="text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              Live Session
            </NavLink>
            <NavLink
              to="/progress"
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              activeClassName="text-primary font-medium"
              onClick={() => setIsOpen(false)}
            >
              Progress
            </NavLink>
            <Button className="w-full bg-gradient-wellness hover:opacity-90 transition-opacity">
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
