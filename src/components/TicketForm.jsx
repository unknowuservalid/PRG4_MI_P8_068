import { useEffect, useRef, useState } from "react";
import { useTicket } from "../context/TicketContext";

function TicketForm() {
    const { addTicket } = useTicket();
    const [categories, setCategories] = useState([]);

    // Tambah 'location' di state (Instruksi A)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        category: "",
        priority: "",
        location: "", // Baru
        title: "",
        description: "",
        incidentDate: "",
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const categoryRef = useRef(null);
    const priorityRef = useRef(null);
    const locationRef = useRef(null); // Baru
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const dateRef = useRef(null);

    useEffect(() => {
        fetch("/categories.json")
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error(error));
    }, []);

    const validateField = (name, value) => {
        let message = "";
        switch (name) {
            case "name":
                if (!value.trim()) message = "Nama pelapor harus diisi.";
                else if (value.trim().length < 3) message = "Nama minimal 3 karakter.";
                break;
            case "email":
                if (!value.trim()) message = "Email harus diisi.";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = "Format email tidak valid.";
                break;
            case "category":
                if (!value) message = "Kategori harus dipilih.";
                break;
            case "priority":
                if (!value) message = "Prioritas harus dipilih.";
                break;
            case "location": // Validasi Baru (Instruksi A)
                if (!value) message = "Lokasi kejadian harus dipilih.";
                break;
            case "title":
                if (!value.trim()) message = "Judul masalah harus diisi.";
                else if (value.trim().length < 10) message = "Judul minimal 10 karakter.";
                break;
            case "description":
                if (!value.trim()) message = "Deskripsi masalah harus diisi.";
                else if (value.trim().length < 20) message = "Deskripsi minimal 20 karakter.";
                break;
            case "incidentDate":
                if (!value) message = "Tanggal kejadian harus diisi.";
                else {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    selectedDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate > today) message = "Tanggal tidak boleh melebihi hari ini.";
                }
                break;
            default:
                break;
        }
        setErrors((prev) => ({ ...prev, [name]: message }));
    };

    const validateForm = () => {
        const validationErrors = {};
        if (!formData.name.trim()) validationErrors.name = "Nama pelapor harus diisi.";
        else if (formData.name.trim().length < 3) validationErrors.name = "Nama minimal 3 karakter.";
        if (!formData.email.trim()) validationErrors.email = "Email harus diisi.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) validationErrors.email = "Format email tidak valid.";
        if (!formData.category) validationErrors.category = "Kategori harus dipilih.";
        if (!formData.priority) validationErrors.priority = "Prioritas harus dipilih.";
        if (!formData.location) validationErrors.location = "Lokasi kejadian harus dipilih."; // Baru
        if (!formData.title.trim()) validationErrors.title = "Judul masalah harus diisi.";
        else if (formData.title.trim().length < 10) validationErrors.title = "Judul minimal 10 karakter.";
        if (!formData.description.trim()) validationErrors.description = "Deskripsi masalah harus diisi.";
        else if (formData.description.trim().length < 20) validationErrors.description = "Deskripsi minimal 20 karakter.";
        if (!formData.incidentDate) validationErrors.incidentDate = "Tanggal kejadian harus diisi.";
        else {
            const selectedDate = new Date(formData.incidentDate);
            const today = new Date();
            selectedDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            if (selectedDate > today) validationErrors.incidentDate = "Tanggal tidak boleh melebihi hari ini.";
        }
        setErrors(validationErrors);
        return validationErrors;
    };

    const focusFirstError = (validationErrors) => {
        if (validationErrors.name) nameRef.current.focus();
        else if (validationErrors.email) emailRef.current.focus();
        else if (validationErrors.category) categoryRef.current.focus();
        else if (validationErrors.priority) priorityRef.current.focus();
        else if (validationErrors.location) locationRef.current.focus(); // Baru
        else if (validationErrors.title) titleRef.current.focus();
        else if (validationErrors.description) descriptionRef.current.focus();
        else if (validationErrors.incidentDate) dateRef.current.focus();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setSuccessMessage("");
            focusFirstError(validationErrors);
            return;
        }
        addTicket(formData);
        setSuccessMessage("Ticket berhasil dibuat.");
        setFormData({
            name: "", email: "", category: "", priority: "", location: "", title: "", description: "", incidentDate: "",
        });
        setErrors({});
        nameRef.current.focus();
    };

    const handleReset = () => {
        setFormData({
            name: "", email: "", category: "", priority: "", location: "", title: "", description: "", incidentDate: "",
        });
        setErrors({});
        setSuccessMessage("");
        nameRef.current.focus();
    };

    return (
        <div className="row g-4">
            <div className="col-lg-12">
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Create Service Request</h5>
                    </div>
                    <div className="card-body">
                        {successMessage && <div className="alert alert-success">{successMessage}</div>}
                        <form onSubmit={handleSubmit}>
                            {/* NAMA */}
                            <div className="mb-3">
                                <label className="form-label">Nama Pelapor</label>
                                <input ref={nameRef} type="text" name="name" value={formData.name} onChange={handleChange} className={`form-control ${errors.name ? "is-invalid" : ""}`} placeholder="Masukkan nama pelapor" />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>

                            {/* EMAIL */}
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input ref={emailRef} type="email" name="email" value={formData.email} onChange={handleChange} className={`form-control ${errors.email ? "is-invalid" : ""}`} placeholder="contoh@email.com" />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            {/* CATEGORY (Dinamis dari JSON) */}
                            <div className="mb-3">
                                <label className="form-label">Kategori Permasalahan</label>
                                <select ref={categoryRef} name="category" value={formData.category} onChange={handleChange} className={`form-select ${errors.category ? "is-invalid" : ""}`}>
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                            </div>

                            {/* PRIORITY (Tambah Critical) */}
                            <div className="mb-3">
                                <label className="form-label">Prioritas</label>
                                <select ref={priorityRef} name="priority" value={formData.priority} onChange={handleChange} className={`form-select ${errors.priority ? "is-invalid" : ""}`}>
                                    <option value="">-- Pilih Prioritas --</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option> {/* Instruksi C */}
                                </select>
                                {errors.priority && <div className="invalid-feedback">{errors.priority}</div>}
                            </div>

                            {/* LOKASI (Instruksi A) */}
                            <div className="mb-3">
                                <label className="form-label">Lokasi Kejadian</label>
                                <select ref={locationRef} name="location" value={formData.location} onChange={handleChange} className={`form-select ${errors.location ? "is-invalid" : ""}`}>
                                    <option value="">-- Pilih Lokasi --</option>
                                    <option value="Laboratorium">Laboratorium</option>
                                    <option value="Ruang Kelas">Ruang Kelas</option>
                                    <option value="Ruang Dosen">Ruang Dosen</option>
                                    <option value="Area Umum">Area Umum</option>
                                </select>
                                {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                            </div>

                            {/* TITLE */}
                            <div className="mb-3">
                                <label className="form-label">Judul Masalah</label>
                                <input ref={titleRef} type="text" name="title" value={formData.title} onChange={handleChange} className={`form-control ${errors.title ? "is-invalid" : ""}`} placeholder="Contoh: Tidak dapat mengakses Wi-Fi Lab" />
                                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                            </div>

                            {/* DESCRIPTION */}
                            <div className="mb-3">
                                <label className="form-label">Deskripsi Masalah</label>
                                <textarea ref={descriptionRef} name="description" value={formData.description} onChange={handleChange} rows="3" className={`form-control ${errors.description ? "is-invalid" : ""}`} placeholder="Jelaskan permasalahan secara lengkap" />
                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>

                            {/* DATE */}
                            <div className="mb-3">
                                <label className="form-label">Tanggal Kejadian</label>
                                <input ref={dateRef} type="date" name="incidentDate" value={formData.incidentDate} onChange={handleChange} className={`form-control ${errors.incidentDate ? "is-invalid" : ""}`} />
                                {errors.incidentDate && <div className="invalid-feedback">{errors.incidentDate}</div>}
                            </div>

                            <button type="submit" className="btn btn-primary me-2">Submit Ticket</button>
                            <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketForm;