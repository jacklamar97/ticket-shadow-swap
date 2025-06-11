
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Ticket {
  id: string;
  event_title: string;
  artist: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  section: string;
  row: string;
  seat: string;
  ticket_type: string;
  price: number;
  payment_methods: string[];
  payment_handles: Record<string, string>;
  is_available: boolean;
  user_id: string;
}

export const useTickets = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Ticket[];
    },
  });
};

export const useUserTickets = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Ticket[];
    },
    enabled: !!user,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (ticketData: Omit<Ticket, 'id' | 'user_id' | 'is_available'>) => {
      if (!user) throw new Error('User must be logged in');

      const { data, error } = await supabase
        .from('tickets')
        .insert({
          ...ticketData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['user-tickets'] });
    },
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData: {
      ticket_id: string;
      buyer_email: string;
      buyer_message?: string;
      seller_id: string;
    }) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};
