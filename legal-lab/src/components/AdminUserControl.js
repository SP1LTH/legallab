// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useEffect, useState } from 'react';
import axios from '../services/api';

const AdminUserControl = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('');

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/users', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }); // Update with your backend route
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching users");
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/admin/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }); // Update with your backend route
      setUsers(users.filter(user => user._id !== userId)); // Update UI
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting user");
    }
  };

  // Change user role
  const changeUserRole = async (userId) => {
    try {
        console.log(role);
      await axios.patch(`/admin/users/${userId}/role`, { role }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }); // Update with your backend route
      fetchUsers(); // Refresh users after role change
    } catch (err) {
      setError(err.response?.data?.message || "Error changing user role");
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Админы хэрэглэгчийн самбар</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border="1" style={{ width: '100%', textAlign: 'left', backgroundColor: 'white' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Нэр</th>
            <th>Имэйл</th>
            <th>Эрх</th>
            <th>Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.firstname}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => deleteUser(user._id)}>Устгах</button>
                <select
                  onChange={(e) => setRole(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Эрх өөрчлөх
                  </option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                  <option value="journal">Journal</option>
                </select>
                <button onClick={() => changeUserRole(user._id)}>Эрх шинэчлэх</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserControl;
