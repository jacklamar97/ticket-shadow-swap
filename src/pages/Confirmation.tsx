
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, MapPin, Ticket, Home } from "lucide-react";
import { mockTickets } from "@/data/mockTickets";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Confirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const ticket = mockTickets.find(t => t.id === id);
  
  if (!ticket) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Ticket Not Found</h1>
            <Button onClick={() => navigate("/")}>Return Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="animate-scale-in text-center">
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl gradient-text">
                Contact Sent Successfully!
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-muted-foreground">
                <p className="mb-4">
                  Your contact information has been sent to the seller. They will reach out to you shortly 
                  to coordinate ticket delivery.
                </p>
                <p className="text-sm">
                  A confirmation email has been sent to your email address with all the details.
                </p>
              </div>

              {/* Ticket Summary */}
              <div className="bg-accent/50 rounded-lg p-4 space-y-3 text-left">
                <h3 className="font-semibold text-card-foreground mb-3">Ticket Summary:</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Ticket className="h-4 w-4 text-primary" />
                    <span className="font-medium">{ticket.eventTitle}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <span className="w-4" />
                    <span>{ticket.artist}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{ticket.venue}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{ticket.date} at {ticket.time}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <span className="w-4" />
                    <span>Section {ticket.section}, Row {ticket.row}, Seat {ticket.seat}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <span className="font-medium">Total Price:</span>
                    <span className="text-lg font-bold gradient-text">${ticket.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/")}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Browse More Tickets
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  Keep this confirmation for your records. The seller will contact you within 24 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Confirmation;
