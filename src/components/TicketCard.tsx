
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Ticket } from "lucide-react";

interface TicketCardProps {
  id: string;
  eventTitle: string;
  artist: string;
  venue: string;
  date: string;
  time: string;
  section: string;
  row: string;
  seat: string;
  ticketType: string;
  price: number;
  onGetTicket: (id: string) => void;
}

const TicketCard = ({
  id,
  eventTitle,
  artist,
  venue,
  date,
  time,
  section,
  row,
  seat,
  ticketType,
  price,
  onGetTicket
}: TicketCardProps) => {
  return (
    <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 bg-card border-border/40 animate-fade-in">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Event Header */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-card-foreground leading-tight">
              {eventTitle}
            </h3>
            <p className="gradient-text font-medium">{artist}</p>
          </div>

          {/* Event Details */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{venue}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{date} at {time}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Ticket className="h-4 w-4 text-primary" />
              <span>
                {ticketType} • Section {section}, Row {row}, Seat {seat}
              </span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <div className="text-2xl font-bold text-card-foreground">
              ${price}
            </div>
            <Button 
              onClick={() => onGetTicket(id)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
            >
              Get This Ticket
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
