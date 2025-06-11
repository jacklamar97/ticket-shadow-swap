
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTicket } from '@/hooks/useTickets';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const PostTicketModal = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    event_title: '',
    artist: '',
    venue: '',
    city: '',
    date: '',
    time: '',
    section: '',
    row: '',
    seat: '',
    ticket_type: 'General Admission',
    price: '',
    paypal: '',
    venmo: '',
    cashapp: '',
  });

  const createTicket = useCreateTicket();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentMethods = [];
    const paymentHandles: Record<string, string> = {};
    
    if (formData.paypal) {
      paymentMethods.push('paypal');
      paymentHandles.paypal = formData.paypal;
    }
    if (formData.venmo) {
      paymentMethods.push('venmo');
      paymentHandles.venmo = formData.venmo;
    }
    if (formData.cashapp) {
      paymentMethods.push('cashapp');
      paymentHandles.cashapp = formData.cashapp;
    }

    try {
      await createTicket.mutateAsync({
        event_title: formData.event_title,
        artist: formData.artist,
        venue: formData.venue,
        city: formData.city,
        date: formData.date,
        time: formData.time,
        section: formData.section,
        row: formData.row,
        seat: formData.seat,
        ticket_type: formData.ticket_type,
        price: parseFloat(formData.price),
        payment_methods: paymentMethods,
        payment_handles: paymentHandles,
      });

      toast({
        title: "Success",
        description: "Ticket posted successfully!",
      });

      setOpen(false);
      setFormData({
        event_title: '',
        artist: '',
        venue: '',
        city: '',
        date: '',
        time: '',
        section: '',
        row: '',
        seat: '',
        ticket_type: 'General Admission',
        price: '',
        paypal: '',
        venmo: '',
        cashapp: '',
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
          <Plus className="h-4 w-4 mr-2" />
          Post Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event_title">Event Title</Label>
              <Input
                id="event_title"
                value={formData.event_title}
                onChange={(e) => setFormData({...formData, event_title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                value={formData.artist}
                onChange={(e) => setFormData({...formData, artist: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => setFormData({...formData, venue: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={formData.section}
                onChange={(e) => setFormData({...formData, section: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="row">Row</Label>
              <Input
                id="row"
                value={formData.row}
                onChange={(e) => setFormData({...formData, row: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="seat">Seat</Label>
              <Input
                id="seat"
                value={formData.seat}
                onChange={(e) => setFormData({...formData, seat: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ticket_type">Ticket Type</Label>
              <Input
                id="ticket_type"
                value={formData.ticket_type}
                onChange={(e) => setFormData({...formData, ticket_type: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Payment Methods (at least one required)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="paypal">PayPal</Label>
                <Input
                  id="paypal"
                  placeholder="email@example.com"
                  value={formData.paypal}
                  onChange={(e) => setFormData({...formData, paypal: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="venmo">Venmo</Label>
                <Input
                  id="venmo"
                  placeholder="@username"
                  value={formData.venmo}
                  onChange={(e) => setFormData({...formData, venmo: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cashapp">Cash App</Label>
                <Input
                  id="cashapp"
                  placeholder="$username"
                  value={formData.cashapp}
                  onChange={(e) => setFormData({...formData, cashapp: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={createTicket.isPending}
          >
            {createTicket.isPending ? "Posting..." : "Post Ticket"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostTicketModal;
