import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/admin/users');
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError("Access Denied or Server Error");
                setLoading(false);
                if (err.response && err.response.status === 403) {
                    // navigate('/dashboard'); // Optional: auto redirect
                }
            }
        };
        fetchUsers();
    }, [navigate]);

    return (
        <div className="admin-container">
            {/* Background Blobs */}
            <div className="blob blob-1" style={{ top: '-10%', left: '-10%' }}></div>
            <div className="blob blob-2" style={{ bottom: '-10%', right: '-10%' }}></div>

            <div className="admin-header">
                <h1 className="admin-title">Admin Dashboard</h1>
                <button className="btn-back" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </button>
            </div>

            <div className="admin-table-container">
                {loading ? (
                    <div className="text-center text-white p-4">Loading users...</div>
                ) : error ? (
                    <div className="text-center text-red-400 p-4">{error}</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Last Login / Token</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>#{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td>
                                        {user.last_login ? new Date(user.last_login).toLocaleString() : 'No active session'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
