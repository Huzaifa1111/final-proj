import React, { useState } from 'react';

const Search = ({ searchCustomers, onCreateOrder, onAddCustomer, updateCustomer, searchResults, handleCustomerSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    cnic: '',
    bookNo: '',
  });
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrors({});
    const results = await searchCustomers(searchTerm);
    setShowNewCustomerForm(results.length === 0);
  };

  const handleCustomerClick = (customer) => {
    setSearchTerm(customer.name);
    handleCustomerSelect(customer);
    setShowNewCustomerForm(false);
    setErrors({});
  };

  const handleNewCustomerChange = (e) => {
    const { id, value } = e.target;
    const field = id.toLowerCase().replace(' ', '');
    setNewCustomer((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleAddCustomerClick = async () => {
    const newErrors = {};
    
    // Validation
    if (!newCustomer.name) {
      newErrors.name = 'Name is required';
    } else {
      const nameRegex = /^[a-zA-Z\s]*$/;
      if (!nameRegex.test(newCustomer.name)) {
        newErrors.name = 'Name must contain only letters and spaces';
      }
    }
    
    if (!newCustomer.phone) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^\d{10,12}$/;
      if (!phoneRegex.test(newCustomer.phone)) {
        newErrors.phone = 'Phone number must be 10-12 digits';
      }
    }
    
    if (!newCustomer.cnic) {
      newErrors.cnic = 'CNIC is required';
    } else {
      const cnicRegex = /^\d{13}$/;
      if (!cnicRegex.test(newCustomer.cnic)) {
        newErrors.cnic = 'CNIC must be 13 digits';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const createdCustomer = await onAddCustomer(newCustomer);
    if (createdCustomer) {
      onCreateOrder(createdCustomer);
      setNewCustomer({ name: '', phone: '', cnic: '', bookNo: '' });
      setSearchTerm('');
      setShowNewCustomerForm(false);
      setErrors({});
    }
  };

  return (
    <div className="flex justify-center pt-[25px]">
      <div className="md:mb-6 mb-3 p-6 rounded-xl space-y-1 w-[322px] md:ml-[5rem] mr-[1px] md:w-[33rem] bg-cardBg border shadow-lg border-gradient">
        <h1 className="text-2xl font-bold mb-4 text-center text-heading font-font">
          Search Customer
        </h1>
        <form onSubmit={handleSearch} className="relative flex justify-center mb-4">
          <svg
            className="absolute md:left-4 left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
            />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className="w-[20rem] md:w-[31rem] px-10 py-2 border-customBorder bg-inputBg rounded-xl text-black input-custom border-borderColor font-font"
          />
          <button
            type="submit"
            className="w-[14rem] h-[41px] px-4 py-2 text-sm text-white transition-all bg-btnBg md:rounded-lg rounded-3xl btn font-font ml-4"
          >
            Search
          </button>
        </form>
        {searchResults.length > 0 && (
          <div className="bg-white border rounded-3xl mt-2 shadow-lg max-h-40 overflow-auto">
            {searchResults.map((customer) => (
              <div
                key={customer._id}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleCustomerClick(customer)}
              >
                {customer.name} - {customer.customerId}
              </div>
            ))}
          </div>
        )}
        {showNewCustomerForm && (
          <div className="bg-cardBg p-6 border rounded-3xl shadow-lg space-y-4 mt-4">
            <h2 className="text-lg font-bold text-center text-heading font-font">
              Add New Customer
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  value={newCustomer.name}
                  onChange={handleNewCustomerChange}
                  placeholder=" "
                  className="input-custom peer w-full px-4 py-2 rounded-xl text-black border border-borderColor"
                />
                <label
                  htmlFor="name"
                  className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out bg-cardBg px-1 ${
                    newCustomer.name
                      ? 'top-[-1px] left-4 text-blue-500'
                      : 'peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-4 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:left-4 peer-focus:text-blue-500'
                  }`}
                >
                  Name
                </label>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div className="relative">
                <input
                  id="phone"
                  type="text"
                  value={newCustomer.phone}
                  onChange={handleNewCustomerChange}
                  placeholder=" "
                  className="input-custom peer w-full px-4 py-2 rounded-xl text-black border border-borderColor"
                />
                <label
                  htmlFor="phone"
                  className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out bg-cardBg px-1 ${
                    newCustomer.phone
                      ? 'top-[-1px] left-4 text-blue-500'
                      : 'peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-4 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:left-4 peer-focus:text-blue-500'
                  }`}
                >
                  Phone
                </label>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div className="relative">
                <input
                  id="cnic"
                  type="text"
                  value={newCustomer.cnic}
                  onChange={handleNewCustomerChange}
                  placeholder=" "
                  className="input-custom peer w-full px-4 py-2 rounded-xl text-black border border-borderColor"
                />
                <label
                  htmlFor="cnic"
                  className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out bg-cardBg px-1 ${
                    newCustomer.cnic
                      ? 'top-[-1px] left-4 text-blue-500'
                      : 'peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-4 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:left-4 peer-focus:text-blue-500'
                  }`}
                >
                  CNIC
                </label>
                {errors.cnic && <p className="text-red-500 text-sm mt-1">{errors.cnic}</p>}
              </div>
              <div className="relative">
                <input
                  id="bookNo"
                  type="text"
                  value={newCustomer.bookNo}
                  onChange={handleNewCustomerChange}
                  placeholder=" "
                  className="input-custom peer w-full px-4 py-2 rounded-xl text-black border border-borderColor"
                />
                <label
                  htmlFor="bookNo"
                  className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out bg-cardBg px-1 ${
                    newCustomer.bookNo
                      ? 'top-[-1px] left-4 text-blue-500'
                      : 'peer-placeholder-shown:top-1/2 peer-placeholder-shown:left-4 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-8px] peer-focus:left-4 peer-focus:text-blue-500'
                  }`}
                >
                  Book No (Optional)
                </label>
              </div>
              <div className="flex flex-row justify-center items-center space-x-6 mt-6">
                <button
                  onClick={handleAddCustomerClick}
                  className="w-[14rem] h-[41px] px-4 py-2 text-sm text-white transition-all bg-btnBg md:rounded-lg rounded-3xl btn font-font"
                >
                  Add New Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;