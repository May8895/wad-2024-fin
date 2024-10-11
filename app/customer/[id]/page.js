// app/customer/[id]/page.js
"use client";
import { useEffect, useState } from "react";

export default function CustomerDetail({ params }) {
  const { id } = params; // Accessing the dynamic route parameter
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/${id}`);
    const data = await response.json();
    setCustomer(data);
  };

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{customer.name}</h1>
      <div className="mb-4">
        <p className="text-lg">
          <strong className="font-semibold">Date of Birth:</strong> {new Date(customer.dateOfBirth).toLocaleDateString()}
        </p>
        <p className="text-lg">
          <strong className="font-semibold">Member Number:</strong> {customer.memberNumber}
        </p>
        <p className="text-lg">
          <strong className="font-semibold">Interests:</strong> {customer.Interests}
        </p>
      </div>
      <button 
        onClick={() => window.history.back()} 
        className="mt-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
      >
        Back
      </button>
    </div>
  );
}
