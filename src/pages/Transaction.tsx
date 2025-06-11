
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Ticket, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCreateTransaction } from "@/hooks/useTickets";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Transaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerMessage, setBuyerMessage] = useState("");
  
  const { user } = useAuth();
  const createTransaction = useCreateTransaction();
  const { toast } = useToast();
  
  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .eq('is_available', true)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="mb-4">You need to be signed in to purchase tickets.</p>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !ticket) {
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

  const handlePaymentConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleSubmitTransaction = async () => {
    try {
      await createTransaction.mutateAsync({
        ticket_id: ticket.id,
        buyer_email: buyerEmail,
        buyer_message: buyerMessage,
        seller_id: ticket.user_id,
      });

      toast({
        title: "Success",
        description: "Your contact information has been sent to the seller!",
      });

      navigate(`/confirmation/${ticket.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const PaymentMethodBadge = ({ method, handle }: { method: string; handle: string }) => (
    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg border border-border/40">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-primary">
            {method.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-medium text-card-foreground">{method}</p>
          <p className="text-sm text-muted-foreground">{handle}</p>
        </div>
      </div>
    </div>
  );

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => setShowConfirmation(false)}
              className="mb-6 hover:bg-accent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="gradient-text">Confirm Your Purchase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Email Address</label>
                    <input 
                      type="email" 
                      placeholder="your@email.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full p-3 bg-background border border-border rounded-lg focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message to Seller (Optional)</label>
                    <textarea 
                      placeholder="Hi! I'm interested in your tickets for..."
                      rows={3}
                      value={buyerMessage}
                      onChange={(e) => setBuyerMessage(e.target.value)}
                      className="w-full p-3 bg-background border border-border rounded-lg focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmitTransaction}
                  disabled={!buyerEmail || createTransaction.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium"
                >
                  {createTransaction.isPending ? "Sending..." : "Send Contact Info to Seller"}
                </Button>
              </CardContent>
            </Card>
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
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6 hover:bg-accent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ticket Details */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl">{ticket.event_title}</CardTitle>
                <p className="gradient-text font-medium text-lg">{ticket.artist}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{ticket.venue}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{new Date(ticket.date).toLocaleDateString()} at {ticket.time}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Ticket className="h-4 w-4 text-primary" />
                  <span>
                    {ticket.section && `Section ${ticket.section}, `}
                    {ticket.row && `Row ${ticket.row}, `}
                    {ticket.seat && `Seat ${ticket.seat}`}
                  </span>
                </div>

                <div className="pt-4 border-t border-border/40">
                  <Badge variant="secondary" className="mb-2">{ticket.ticket_type}</Badge>
                  <div className="text-3xl font-bold gradient-text">${ticket.price}</div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <span>Payment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-card-foreground font-medium">
                    <strong>Important:</strong> Make payment directly to the seller using one of their accepted methods below. 
                    This platform does not handle funds or guarantee delivery.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-card-foreground">Seller's Payment Methods:</h3>
                  
                  {ticket.payment_handles?.paypal && (
                    <PaymentMethodBadge method="PayPal" handle={ticket.payment_handles.paypal} />
                  )}
                  
                  {ticket.payment_handles?.venmo && (
                    <PaymentMethodBadge method="Venmo" handle={ticket.payment_handles.venmo} />
                  )}
                  
                  {ticket.payment_handles?.cashapp && (
                    <PaymentMethodBadge method="Cash App" handle={ticket.payment_handles.cashapp} />
                  )}
                </div>

                <Button 
                  onClick={handlePaymentConfirmation}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-medium"
                >
                  I've Made the Payment
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Only click after you've sent payment to the seller
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Transaction;
