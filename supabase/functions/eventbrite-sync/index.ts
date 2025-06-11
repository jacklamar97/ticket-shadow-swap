
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const eventbriteApiKey = Deno.env.get('EVENTBRITE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Fetch events from Eventbrite API
    const eventbriteResponse = await fetch(
      `https://www.eventbriteapi.com/v3/events/search/?categories=103&location.address=United States&expand=venue&token=${eventbriteApiKey}`
    );
    
    if (!eventbriteResponse.ok) {
      throw new Error(`Eventbrite API error: ${eventbriteResponse.status}`);
    }
    
    const eventbriteData = await eventbriteResponse.json();
    console.log(`Found ${eventbriteData.events?.length || 0} events from Eventbrite`);
    
    const processedEvents = [];
    
    if (eventbriteData.events) {
      for (const event of eventbriteData.events) {
        // Only process music events with valid data
        if (event.start?.local && event.name?.text && event.venue) {
          const eventDate = new Date(event.start.local);
          const eventTime = eventDate.toTimeString().slice(0, 5);
          
          const processedEvent = {
            external_id: event.id,
            event_title: event.name.text,
            artist: event.name.text.split(' - ')[0] || event.name.text,
            venue: event.venue.name || 'TBA',
            city: event.venue.address?.city || 'TBA',
            date: eventDate.toISOString().split('T')[0],
            time: eventTime,
            section: 'General',
            row: 'TBA',
            seat: 'TBA',
            ticket_type: 'General Admission',
            price: 0,
            payment_methods: [],
            payment_handles: {},
            is_available: false, // Mark as not available since these are just event listings
            user_id: '00000000-0000-0000-0000-000000000000', // System user
            source: 'eventbrite'
          };
          
          processedEvents.push(processedEvent);
        }
      }
    }
    
    // Insert events into database (or update if they exist)
    if (processedEvents.length > 0) {
      const { data, error } = await supabase
        .from('events')
        .upsert(processedEvents, { 
          onConflict: 'external_id',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log(`Successfully synced ${processedEvents.length} events`);
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      eventsProcessed: processedEvents.length,
      message: `Successfully synced ${processedEvents.length} events from Eventbrite`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in eventbrite-sync function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
