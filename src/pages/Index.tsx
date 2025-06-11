
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TicketCard from "@/components/TicketCard";
import FilterBar from "@/components/FilterBar";
import { mockTickets } from "@/data/mockTickets";

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = 
      ticket.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.venue.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = selectedCity === "All Cities" || ticket.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

  const handleGetTicket = (ticketId: string) => {
    navigate(`/transaction/${ticketId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your
            <span className="gradient-text"> Perfect Show</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect directly with trusted sellers to swap tickets for the hottest music events across the USA. 
            Safe, simple, and transparent.
          </p>
        </div>

        {/* Filters */}
        <FilterBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-card-foreground">
            Available Tickets
            <span className="text-lg text-muted-foreground ml-2">
              ({filteredTickets.length} found)
            </span>
          </h2>
        </div>

        {/* Ticket Grid */}
        {filteredTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                id={ticket.id}
                eventTitle={ticket.eventTitle}
                artist={ticket.artist}
                venue={ticket.venue}
                date={ticket.date}
                time={ticket.time}
                section={ticket.section}
                row={ticket.row}
                seat={ticket.seat}
                ticketType={ticket.ticketType}
                price={ticket.price}
                onGetTicket={handleGetTicket}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="gradient-border w-fit mx-auto mb-4">
              <div className="bg-background p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
