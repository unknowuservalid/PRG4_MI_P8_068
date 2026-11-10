import { createContext, useContext, useState } from "react";

const TicketContext = createContext();

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState([]);

  const addTicket = (ticket) => {
    setTickets((previousTickets) => [
      ...previousTickets,
      {
        ...ticket,
        id: Date.now(),
        ticketNumber: `HD-${String(
          previousTickets.length + 1
        ).padStart(3, "0")}`,
        status: "Open",
        createdAt: new Date().toLocaleString("id-ID"),
      },
    ]);
  };

  const updateTicketStatus = (id, status) => {
    setTickets((previousTickets) =>
      previousTickets.map((ticket) =>
        ticket.id === id ? { ...ticket, status } : ticket
      )
    );
  };

  const clearTickets = () => {
    setTickets([]);
  };

  // --- TAMBAHAN UNTUK LATIHAN (F: Hapus 1 tiket) ---
  const deleteTicket = (id) => {
    setTickets((previousTickets) =>
      previousTickets.filter((ticket) => ticket.id !== id)
    );
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicketStatus,
        clearTickets,
        deleteTicket, // Panggil fungsi baru
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTicket() {
  return useContext(TicketContext);
}