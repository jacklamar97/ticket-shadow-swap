
export interface Ticket {
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
  city: string;
  paymentMethods: {
    paypal?: string;
    cashapp?: string;
    venmo?: string;
  };
}

export const mockTickets: Ticket[] = [
  {
    id: "1",
    eventTitle: "Midnight Dreams Tour",
    artist: "The Velvet Echoes",
    venue: "Madison Square Garden",
    date: "March 15, 2024",
    time: "8:00 PM",
    section: "A",
    row: "12",
    seat: "15-16",
    ticketType: "General Admission",
    price: 145,
    city: "New York, NY",
    paymentMethods: {
      paypal: "seller@email.com",
      venmo: "@seller123",
      cashapp: "$seller123"
    }
  },
  {
    id: "2",
    eventTitle: "Electric Nights Festival",
    artist: "Neon Pulse & Friends",
    venue: "Hollywood Bowl",
    date: "March 22, 2024",
    time: "7:30 PM",
    section: "VIP",
    row: "3",
    seat: "A1-A2",
    ticketType: "VIP Experience",
    price: 320,
    city: "Los Angeles, CA",
    paymentMethods: {
      paypal: "vipseller@gmail.com",
      cashapp: "$musiclover88"
    }
  },
  {
    id: "3",
    eventTitle: "Acoustic Sessions",
    artist: "Luna Martinez",
    venue: "The Fillmore",
    date: "March 18, 2024",
    time: "9:00 PM",
    section: "B",
    row: "8",
    seat: "23",
    ticketType: "General Admission",
    price: 85,
    city: "Chicago, IL",
    paymentMethods: {
      venmo: "@acousticfan",
      cashapp: "$luna_fan_2024"
    }
  },
  {
    id: "4",
    eventTitle: "Rock Revival",
    artist: "Thunder & Lightning",
    venue: "Red Rocks Amphitheatre",
    date: "April 5, 2024",
    time: "7:00 PM",
    section: "GA",
    row: "Standing",
    seat: "Floor",
    ticketType: "General Admission",
    price: 95,
    city: "Denver, CO",
    paymentMethods: {
      paypal: "rockfan@yahoo.com",
      venmo: "@thunderfan",
      cashapp: "$rocklover"
    }
  },
  {
    id: "5",
    eventTitle: "Jazz Under The Stars",
    artist: "Miles Ahead Quartet",
    venue: "Blue Note",
    date: "March 25, 2024",
    time: "10:30 PM",
    section: "C",
    row: "5",
    seat: "12",
    ticketType: "Premium Seating",
    price: 125,
    city: "New York, NY",
    paymentMethods: {
      paypal: "jazzlover@email.com",
      venmo: "@milesahead"
    }
  },
  {
    id: "6",
    eventTitle: "Pop Sensation World Tour",
    artist: "Starlight Symphony",
    venue: "Staples Center",
    date: "April 12, 2024",
    time: "8:00 PM",
    section: "Floor",
    row: "15",
    seat: "101-102",
    ticketType: "Floor Seats",
    price: 275,
    city: "Los Angeles, CA",
    paymentMethods: {
      paypal: "starlight@gmail.com",
      cashapp: "$popfan2024",
      venmo: "@starlightfan"
    }
  }
];
