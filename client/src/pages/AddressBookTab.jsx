import React, { useState } from "react";

const AddressBookTab = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const handleAddressChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSaveAddress = () => {
    if (!Object.values(form).every(Boolean)) return alert("Please fill all fields!");
    setAddresses([...addresses, form]);
    setForm({ name: "", phone: "", street: "", city: "", state: "", pincode: "", country: "" });
  };
  const removeAddress = (index) => setAddresses(addresses.filter((_, i) => i !== index));

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-lg font-semibold dark:text-white">Add New Address</h2>
      <div className="space-y-4">
        {["name", "phone", "street", "city", "state", "pincode", "country"].map((field) => (
          field === "street" ? (
            <textarea
              key={field}
              name={field}
              placeholder="Street Address"
              rows={2}
              value={form[field]}
              onChange={handleAddressChange}
              className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          ) : (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleAddressChange}
              className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          )
        ))}
        <button onClick={handleSaveAddress} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save Address</button>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold dark:text-white">Saved Addresses</h2>
        {addresses.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">You haven’t added any address yet.</p>
        ) : (
          addresses.map((addr, index) => (
            <div key={index} className="border p-4 rounded shadow dark:border-gray-600 dark:text-white">
              <p className="font-medium">{addr.name}</p>
              <p>{addr.phone}</p>
              <p>{addr.street}</p>
              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
              <p>{addr.country}</p>
              <button onClick={() => removeAddress(index)} className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700">Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressBookTab;
