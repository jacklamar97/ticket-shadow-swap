
-- Create a profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a tickets table to store real ticket data
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  event_title TEXT NOT NULL,
  artist TEXT NOT NULL,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  section TEXT,
  row TEXT,
  seat TEXT,
  ticket_type TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  payment_methods JSONB DEFAULT '[]'::jsonb,
  payment_handles JSONB DEFAULT '{}'::jsonb,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a transactions table to track ticket exchanges
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES public.tickets(id) NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_message TEXT,
  seller_id UUID REFERENCES auth.users NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Tickets policies
CREATE POLICY "Anyone can view available tickets" 
  ON public.tickets 
  FOR SELECT 
  USING (is_available = true);

CREATE POLICY "Users can view their own tickets" 
  ON public.tickets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets" 
  ON public.tickets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" 
  ON public.tickets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tickets" 
  ON public.tickets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Sellers can view transactions for their tickets" 
  ON public.transactions 
  FOR SELECT 
  USING (auth.uid() = seller_id);

CREATE POLICY "Anyone can create transactions" 
  ON public.transactions 
  FOR INSERT 
  WITH CHECK (true);

-- Create a function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN new;
END;
$$;

-- Create a trigger to call the function when a new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
