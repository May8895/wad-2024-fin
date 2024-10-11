

"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function Home() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  const { register, handleSubmit, reset } = useForm();
  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const formatDateForInput = (date) => {
    // Convert the date into a string that can be used in an input[type="date"]
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month starts at 0
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const startEdit = (customer) => async () => {
    setEditMode(true);
    reset({
      ...customer,
      dateOfBirth: formatDateForInput(customer.dateOfBirth), // Formatting the date
    });
  };

  async function fetchCustomers() {
    const data = await fetch(`${APIBASE}/customer`);
    const c = await data.json();
    const c2 = c.map((customer) => {
      customer.id = customer._id;
      return customer;
    });
    setCustomers(c2);
  }

  const createOrUpdateCustomer = async (data) => {
    if (editMode) {
      const response = await fetch(`${APIBASE}/customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert(`Failed to update customer: ${response.status}`);
      } else {
        alert("Customer updated successfully");
      }

      reset({
        name: "",
        dateOfBirth: "",
        memberNumber: "",
        Interests: "",
      });
      setEditMode(false);
      fetchCustomers();
      return;
    }

    const response = await fetch(`${APIBASE}/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    try {
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      alert("Customer added successfully");
      reset({
        name: "",
        dateOfBirth: "",
        memberNumber: "",
        Interests: "",
      });
      fetchCustomers();
    } catch (error) {
      alert(`Failed to add customer: ${error.message}`);
      console.error(error);
    }
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;

    const response = await fetch(`${APIBASE}/customer/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert(`Failed to delete customer: ${response.status}`);
    } else {
      alert("Customer deleted successfully");
      fetchCustomers();
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Customer Management</h1>
      <div className="flex gap-4 w-full">
        <div className="flex-1 w-1/3 bg-white p-4 shadow-md rounded-md">
          <form onSubmit={handleSubmit(createOrUpdateCustomer)} className="space-y-4">
            <h2 className="text-xl font-semibold">{editMode ? "Edit Customer" : "Add Customer"}</h2>
            <div>
              <label>Name:</label>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-gray-300 w-full p-2 rounded"
              />
            </div>
            <div>
              <label>Date of Birth:</label>
              <input
                name="dateOfBirth"
                type="date"
                {...register("dateOfBirth", { required: true })}
                className="border border-gray-300 w-full p-2 rounded"
              />
            </div>
            <div>
              <label>Member Number:</label>
              <input
                name="memberNumber"
                type="number"
                {...register("memberNumber", { required: true })}
                className="border border-gray-300 w-full p-2 rounded"
              />
            </div>
            <div>
              <label>Interests:</label>
              <input
                name="Interests"
                type="text"
                {...register("Interests", { required: true })}
                className="border border-gray-300 w-full p-2 rounded"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className={`bg-${editMode ? "blue" : "green"}-600 hover:bg-${editMode ? "blue" : "green"}-700 text-white font-bold py-2 px-4 rounded`}
              >
                {editMode ? "Update" : "Add"}
              </button>
              {editMode && (
                <button
                  onClick={() => {
                    reset({
                      name: "",
                      dateOfBirth: "",
                      memberNumber: "",
                      Interests: "",
                    });
                    setEditMode(false);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="flex-1 w-1/3 bg-white p-4 shadow-md rounded-md">
          <h2 className="text-xl font-semibold">Customers ({customers.length})</h2>
          {/* <button
            onClick={() => {
              reset({
                name: "",
                dateOfBirth: "",
                memberNumber: "",
                Interests: "",
              });
              setEditMode(false);
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Add New Customer
          </button> */}
          <ul className="list-disc ml-5 mt-2">
            {customers.map((c) => (
              <li key={c._id} className="flex justify-between items-center py-2 border-b border-gray-200">
                <Link href={`/customer/${c._id}`} className="text-blue-600 font-bold hover:underline">
                  {c.name}
                </Link>
                <div>
                  <button className="text-blue-500" onClick={startEdit(c)}>
                    📝
                  </button>
                  <button className="text-red-500 ml-2" onClick={deleteById(c._id)}>
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
