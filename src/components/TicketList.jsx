import { useState } from "react";
import { useTicket } from "../context/TicketContext";

function TicketList() {
  const { tickets, updateTicketStatus, clearTickets, deleteTicket } = useTicket(); // Tambah deleteTicket

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState(""); // Baru (Instruksi E)

  const categories = [...new Set(tickets.map((ticket) => ticket.category))];

  // Filter Logic (Instruksi D & I)
  const filteredTickets = tickets.filter((ticket) => {
    const searchLower = search.toLowerCase();
    // Cari berdasarkan judul ATAU nama pelapor
    const matchSearch = 
      ticket.title.toLowerCase().includes(searchLower) || 
      ticket.name.toLowerCase().includes(searchLower);

    const matchCategory = categoryFilter === "" || ticket.category === categoryFilter;
    const matchStatus = statusFilter === "" || ticket.status === statusFilter;
    const matchPriority = priorityFilter === "" || ticket.priority === priorityFilter; // Baru

    return matchSearch && matchCategory && matchStatus && matchPriority;
  });

  // Badge Prioritas (Instruksi C: Critical dibedakan)
  const priorityBadge = (priority) => {
    switch (priority) {
      case "Critical": return "bg-dark"; // Warna hitam untuk Critical
      case "High": return "bg-danger";
      case "Medium": return "bg-warning text-dark";
      case "Low": return "bg-success";
      default: return "bg-secondary";
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case "Open": return "bg-danger";
      case "In Progress": return "bg-warning text-dark";
      case "Resolved": return "bg-success";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Ticket List</h5>
        {tickets.length > 0 && (
          <button type="button" className="btn btn-sm btn-danger" onClick={clearTickets}>
            Clear All
          </button>
        )}
      </div>

      <div className="card-body">
        {/* FILTER & SEARCH ROW */}
        <div className="row g-2 mb-3">
          <div className="col-md-3">
            <input type="text" className="form-control" placeholder="Cari judul / pelapor..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          {/* Filter Prioritas Baru (Instruksi E) */}
          <div className="col-md-3">
            <select className="form-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="">Semua Prioritas</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Semua Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="alert alert-info mb-0">Belum terdapat service request.</div>
        ) : filteredTickets.length === 0 ? (
          <div className="alert alert-warning mb-0">Ticket tidak ditemukan.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>No. Ticket</th>
                  <th>Masalah</th>
                  <th>Kategori</th>
                  <th>Prioritas</th>
                  <th>Status</th>
                  <th>Pelapor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td><strong>{ticket.ticketNumber}</strong></td>
                    <td>
                      <strong>{ticket.title}</strong>
                      <div className="small text-muted">{ticket.description}</div>
                      <div className="small text-muted mt-1">Lokasi: {ticket.location || '-'}</div> {/* Tampilkan Lokasi */}
                    </td>
                    <td>{ticket.category}</td>
                    <td>
                      <span className={`badge ${priorityBadge(ticket.priority)}`}>{ticket.priority}</span>
                    </td>
                    <td>
                      <span className={`badge ${statusBadge(ticket.status)}`}>{ticket.status}</span>
                    </td>
                    <td>
                      {ticket.name}
                      <div className="small text-muted">{ticket.email}</div>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        {/* Select Status (Instruksi H: Kunci kalau Resolved) */}
                        <select
                          className="form-select form-select-sm"
                          value={ticket.status}
                          onChange={(event) => updateTicketStatus(ticket.id, event.target.value)}
                          disabled={ticket.status === "Resolved"} // Kunci status
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>

                        {/* Tombol Delete (Instruksi F) */}
                        <button className="btn btn-sm btn-outline-danger" onClick={() => { if(window.confirm('Hapus tiket ini?')) deleteTicket(ticket.id); }}>
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketList;