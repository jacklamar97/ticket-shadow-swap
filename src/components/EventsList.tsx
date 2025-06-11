
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EventsList = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(20);

      if (error) throw error;
      return data;
    },
  });

  const syncEvents = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('eventbrite-sync');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: data.message || "Events synced successfully!",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sync events",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Upcoming Events</h2>
        <Button 
          onClick={syncEvents} 
          disabled={isSyncing}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Events'}</span>
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No events found. Click "Sync Events" to fetch the latest concerts from Eventbrite.</p>
            <Button onClick={syncEvents} disabled={isSyncing}>
              {isSyncing ? 'Syncing...' : 'Sync Events Now'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">{event.event_title}</CardTitle>
                <p className="text-sm text-muted-foreground">{event.artist}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{event.venue}, {event.city}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge variant="secondary">Eventbrite</Badge>
                  <Button size="sm" disabled>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;
