import React, { useState, useEffect } from "react";
import axios from "axios";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dob: "",
    password: "",
    gender: "",
    about: "",
  });

  const [genderOptions, setGenderOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users/genders")
      .then((response) => setGenderOptions(response.data))
      .catch((error) => console.error("Error fetching gender options:", error));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:5000/api/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        await axios.put(`http://localhost:5000/api/users/${editingUserId}`, formData);
        alert("User updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/users", formData);
        alert("User created successfully!");
      }
      setFormData({ name: "", age: "", dob: "", password: "", gender: "", about: "" });
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      age: user.age,
      dob: user.dob,
      password: "",
      gender: user.gender,
      about: user.about,
    });
    setEditingUserId(user._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">User Registration</h1>
      <h2 className="text-lg font-semibold mb-4">{editingUserId ? "Edit User" : "Add User"}</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <label>Name:</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full border p-2 mb-2" />
        
        <label>Age:</label>
        <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} required className="w-full border p-2 mb-2" />
        
        <label>Date of Birth:</label>
        <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} required className="w-full border p-2 mb-2" />
        
        <label>Password:</label>
        <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required className="w-full border p-2 mb-2" />

        <label>Gender:</label>
        <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} required className="w-full border p-2 mb-2">
          <option value="" disabled>Select Gender</option>
          {genderOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>

        <label>About:</label>
        <textarea value={formData.about} onChange={(e) => setFormData({...formData, about: e.target.value})} maxLength={5000} className="w-full border p-2 mb-2"></textarea>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          {editingUserId ? "Update User" : "Submit"}
        </button>
      </form>

      <h2 className="text-lg font-semibold mt-4 mb-2">User List</h2>
      <ul className="border p-4 rounded-lg">
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id} className="flex justify-between items-center border-b p-2">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm">Age: {user.age} | Gender: {user.gender}</p>
              </div>
              <div>
                <button onClick={() => handleEdit(user)} className="bg-green-500 text-white p-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </ul>
    </div>
  );
};

export default UserForm;
