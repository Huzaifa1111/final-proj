import React, { useState } from "react";

function Customers() {
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cnic: "",
    bookNo: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = () => {
    if (editIndex !== null) {
      const updatedCustomers = [...customers];
      updatedCustomers[editIndex] = formData;
      setCustomers(updatedCustomers);
      setEditIndex(null);
    } else {
      setCustomers([...customers, formData]);
    }
    setFormData({ name: "", phone: "", cnic: "", bookNo: "" });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setFormData(customers[index]);
    setShowForm(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedCustomers = customers.filter((_, i) => i !== index);
    setCustomers(updatedCustomers);
  };

  return (
    <div className="p-4">
      <button
        className="w-32 bg-blue-500 text-white px-4 py-2 rounded-3xl mb-4 hover:bg-lime-400"
        onClick={() => {
          setShowForm(!showForm);
          setFormData({ name: "", phone: "", cnic: "", bookNo: "" });
          setEditIndex(null);
        }}
      >
        Add New
      </button>

      {showForm && (
        <form className="mb-4 p-4 border rounded shadow-sm bg-gray-50">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">CNIC</label>
            <input
              type="text"
              name="cnic"
              value={formData.cnic}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Book No</label>
            <input
              type="text"
              name="bookNo"
              value={formData.bookNo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="button"
            className="w-32 bg-green-500 text-white px-4 py-2 rounded-3xl hover:bg-lime-400"
            onClick={handleAddCustomer}
          >
            {editIndex !== null ? "Update" : "Add"}
          </button>
        </form>
      )}

      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl font-bold mb-4">Customers</h2>
        <div className="flex flex-wrap gap-4">
          {customers.map((customer, index) => (
            <div
              key={index}
              className="border rounded p-4 w-full md:w-1/2 lg:w-1/3 bg-gray-50 shadow-sm"
            >
              <p>
                <strong>Name:</strong> {customer.name}
              </p>
              <p>
                <strong>Phone:</strong> {customer.phone}
              </p>
              <p>
                <strong>CNIC:</strong> {customer.cnic}
              </p>
              <p>
                <strong>Book No:</strong> {customer.bookNo}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  className="w-[77px] bg-yellow-500 text-white px-3 py-1 rounded-3xl hover:bg-lime-400"
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </button>
                <button
                  className="w-[77px] bg-red-500 text-white px-3 py-1 rounded-3xl hover:bg-lime-400"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Customers;
