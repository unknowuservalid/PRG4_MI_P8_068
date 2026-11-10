import { useTicket } from "../context/TicketContext";

function TicketSummary() {
  const { tickets } = useTicket();

  // Daftar kategori yang mau ditampilkan (Instruksi G)
  const targetCategories = ["Hardware", "Software", "Network", "Account", "Security"];

  return (
    <div className="row g-3 mb-4">
      {/* Total Ticket Card */}
      <div className="col-md-2">
        <div className="card shadow-sm text-center border-primary">
          <div className="card-body p-2">
            <h6 className="text-muted mb-1">Total</h6>
            <h3 className="mb-0">{tickets.length}</h3>
          </div>
        </div>
      </div>

      {/* Looping Kategori */}
      {targetCategories.map((cat) => {
        const count = tickets.filter((t) => t.category === cat).length;
        return (
          <div className="col-md-2" key={cat}>
            <div className="card shadow-sm text-center">
              <div className="card-body p-2">
                <h6 className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>{cat}</h6>
                <h3 className="mb-0">{count}</h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TicketSummary;