// Usage example component for sending registration confirmation
export const sendRegistrationEmail = async (registrationData: {
  name: string;
  email: string;
  college: string;
  phone: string;
  ticketType: string;
  registrationId: string;
  amount: number;
  workshopTrack?: string;
  teamMembers?: string[];
  eventDates: string;
  venue: string;
}) => {
  const response = await fetch('/api/email/registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registrationData)
  });
  
  return response.json();
};

// Example usage after successful registration:
/*
await sendRegistrationEmail({
  name: "John Doe",
  email: "john@example.com",
  college: "ANITS",
  phone: "+91 9876543210",
  ticketType: "Combo",
  registrationId: "SAM2025001",
  amount: 1500,
  workshopTrack: "AI & Machine Learning",
  teamMembers: ["John Doe", "Jane Smith"],
  eventDates: "August 6-9, 2025",
  venue: "ANITS Campus, Visakhapatnam"
});
*/