
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsList from "@/components/EventsList";

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Discover <span className="gradient-text">Live Events</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse upcoming concerts and events. Find tickets or list your own for events you can't attend.
            </p>
          </div>
          
          <EventsList />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
