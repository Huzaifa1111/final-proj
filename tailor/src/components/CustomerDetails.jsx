
import React, { useState, useEffect } from 'react';

const CustomerDetails = ({
  formState,
  setFormState,
  editCustomer,
  setEditCustomer,
  handleEditCustomer,
  handleEditClick,
  handleDeleteCustomer,
}) => {
  const [localCustomer, setLocalCustomer] = useState(formState.customerDetails || {});

  useEffect(() => {
    setLocalCustomer(formState.customerDetails || {});
  }, [formState.customerDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormState((prev) => ({
      ...prev,
      customerDetails: {
        ...prev.customerDetails,
        [name]: value,
      },
      bookNo: name === 'bookNo' ? value : prev.bookNo, // Update bookNo in formState
    }));
    if (editCustomer) {
      setEditCustomer((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEditClickWrapper = () => {
    if (window.confirm('Are you sure you want to edit this customer?')) {
      console.log('Edit confirmed for customer:', localCustomer);
      handleEditClick(localCustomer);
    }
  };

  const handleUpdateClick = () => {
    if (window.confirm('Are you sure you want to update this customer?')) {
      console.log('Update confirmed for customer:', editCustomer);
      handleEditCustomer(editCustomer);
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      console.log('Delete confirmed for customer:', formState.customerDetails._id || editCustomer?._id);
      handleDeleteCustomer(formState.customerDetails._id || editCustomer?._id);
    }
  };

  return (
    <div className="p-[12px] mb-6 md:mb-0 md:p-[21px] rounded-xl bg-cardBg shadow-xl w-[319px] md:w-[598px] mx-auto text-white border borderColor font-font relative">
      {formState.customerDetails.customerId && (
        <div className="absolute top-2 right-2 bg-btnBg text-white px-3 py-1 rounded-lg text-sm">
          ID: {formState.customerDetails.customerId}
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4 text-left text-heading">
        Customer Details
      </h2>
      <div className="space-y-4">
        {editCustomer ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={editCustomer.name || ''}
                  onChange={handleInputChange}
                  className="peer p-2 rounded-lg w-full bg-inputBg text-black border border-borderColor input-custom"
                  placeholder=" "
                />
                <label
                  htmlFor="name"
                  className="absolute left-2 -top-2.5 text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2 transition-all peer-focus:-top-2.5 peer-focus:left-2 bg-cardBg px-1 cut-border border-box"
                >
                  Name
                </label>
              </div>
              <div className="relative">
                <input
                  id="bookNo"
                  name="bookNo"
                  type="text"
                  value={editCustomer.bookNo || ''}
                  onChange={handleInputChange}
                  className="peer p-2 rounded-lg w-full bg-inputBg text-black border border-borderColor input-custom"
                  placeholder=" "
                />
                <label
                  htmlFor="bookNo"
                  className="absolute left-2 -top-2.5 text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2 transition-all peer-focus:-top-2.5 peer-focus:left-2 bg-cardBg px-1 cut-border border-box"
                >
                  Book No
                </label>
              </div>
            </div>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="text"
                value={editCustomer.phone || ''}
                onChange={handleInputChange}
                className="peer p-2 rounded-lg w-full bg-inputBg text-black border border-borderColor input-custom"
                placeholder=" "
              />
              <label
                htmlFor="phone"
                className="absolute left-2 -top-2.5 text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2 transition-all peer-focus:-top-2.5 peer-focus:left-2 bg-cardBg px-1 cut-border border-box"
              >
                Phone
              </label>
            </div>
            <div className="relative">
              <input
                id="cnic"
                name="cnic"
                type="text"
                value={editCustomer.cnic || ''}
                onChange={handleInputChange}
                className="peer p-2 rounded-lg w-full bg-inputBg text-black border border-borderColor input-custom"
                placeholder=" "
              />
              <label
                htmlFor="cnic"
                className="absolute left-2 -top-2.5 text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2 transition-all peer-focus:-top-2.5 peer-focus:left-2 bg-cardBg px-1 cut-border border-box"
              >
                CNIC
              </label>
            </div>
            <div className="flex flex-col md:flex-row justify-between pt-3 gap-2">
              <button
                className="w-full md:w-[8rem] h-[41px] px-4 py-2 text-sm text-white transition-all bg-btnBg rounded-xl btn"
                onClick={handleUpdateClick}
              >
                Update
              </button>
              <button
                className="w-full md:w-[8rem] h-[41px] px-4 py-2 text-sm text-white bg-red-500 rounded-xl shadow-md transition-all hover:bg-red-600 hover:-translate-y-1"
                onClick={handleDeleteClick}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={localCustomer.name || ''}
                  onChange={handleInputChange}
                  className="peer p-2 rounded-lg w-full bg-inputBg text-black border border-borderColor input-custom"
                  placeholder=" "
                />
                <label
                  htmlFor="name"
                  className="absolute left-2 -top-2.5 text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2 transition-all peer-focus:-top-2.5 peer-focus:left-2 bg-cardBg px-1 cut-border border-box"
                >
                  Name
                </label>
              </div>
              <div className="relative">
                <input
                  id="bookNo"
                  name="bookNo"
                  type="text"
                  value={localCustomer.bookNo || ''}
                  onChange={handleInputChange}
                  className="peer p-2 rounded-lg w-full bg-inputBg text-black border border-borderColor input-custom"
                  placeholder=" "
                />
                <label
                  htmlFor="bookNo"
                  className="absolute left-2 -top-2.5 text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2 transition-all peer-focus:-top-2.5 peer-focus:left-2 bg-cardBg px-1 cut-border border-box"
                >
                  Book No
                </label>
              </div>
            </div>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="text"
                value={localCustomer.phone || ''}
                onChange={handleInputChange}
                className="peer p-2 rounded-lg w-full bg-inputBg text-black border border-borderColor input-custom"
                placeholder=" "
              />
              <label
                htmlFor="phone"
                className="absolute left-2 -top-2.5 text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2 transition-all peer-focus:-top-2.5 peer-focus:left-2 bg-cardBg px-1 cut-border border-box"
              >
                Phone
              </label>
            </div>
            <div className="relative">
              <input
                id="cnic"
                name="cnic"
                type="text"
                value={localCustomer.cnic || ''}
                onChange={handleInputChange}
                className="peer p-2 rounded-lg w-full bg-inputBg text-black border border-borderColor input-custom"
                placeholder=" "
              />
              <label
                htmlFor="cnic"
                className="absolute left-2 -top-2.5 text-gray-500 peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-2 transition-all peer-focus:-top-2.5 peer-focus:left-2 bg-cardBg px-1 cut-border border-box"
              >
                CNIC
              </label>
            </div>
            {localCustomer._id && (
              <div className="flex flex-col md:flex-row justify-between pt-3 gap-2">
                <button
                  className="w-full md:w-[8rem] h-[41px] px-4 py-2 text-sm text-white bg-btnBg rounded-xl transition-all btn"
                  onClick={handleEditClickWrapper}
                >
                  Edit
                </button>
                <button
                  className="w-full md:w-[8rem] h-[41px] px-4 py-2 text-sm text-white bg-red-500 rounded-xl shadow-md transition-all hover:bg-red-600 hover:-translate-y-1"
                  onClick={handleDeleteClick}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;