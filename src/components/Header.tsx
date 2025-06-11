
import { Button } from "@/components/ui/button";
import { Moon, Sun, Plus } from "lucide-react";
import { useState, useEffect } from "react";

const Header = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Set initial dark mode
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="gradient-border">
            <div className="bg-background px-3 py-1 rounded-lg">
              <span className="gradient-text text-xl font-bold">TicketSwap</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={toggleTheme}
            size="icon"
            className="border-border hover:bg-accent"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            <Plus className="h-4 w-4 mr-2" />
            Post Ticket
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
