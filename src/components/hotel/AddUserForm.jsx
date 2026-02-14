import React, { useState, useEffect } from 'react';

const AddUserForm = ({ userToEdit, onEditComplete }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('waiter');
    const [pin, setPin] = useState('');

    useEffect(() => {
        if (userToEdit) {
            setName(userToEdit.name);
            setRole(userToEdit.role);
            setPin(userToEdit.pin);
        } else {
            setName('');
            setRole('waiter');
            setPin('');
        }
    }, [userToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

        if (userToEdit) {
            const updatedUsers = existingUsers.map(u =>
                u.id === userToEdit.id
                    ? { ...u, name, role, pin }
                    : u
            );
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            alert('User updated successfully!');
        } else {
            const newUser = { id: Date.now(), name, role, pin };
            localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
            alert('User added successfully!');
        }

        setName('');
        setRole('waiter');
        setPin('');
        if (onEditComplete) onEditComplete();
    };

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const storedRoles = JSON.parse(localStorage.getItem('appSettings_roles') || '["admin", "waiter", "kitchen"]');
        setRoles(storedRoles);
    }, []);

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">{userToEdit ? 'Edit User' : 'Add New User'}</h2>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 border rounded capitalize"
                >
                    {roles.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">PIN</label>
                <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full p-2 border rounded"
                    maxLength="4"
                    required
                />
            </div>
            <div className="flex gap-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1">
                    {userToEdit ? 'Update User' : 'Add User'}
                </button>
                {userToEdit && (
                    <button
                        type="button"
                        onClick={() => {
                            setName('');
                            setRole('waiter');
                            setPin('');
                            onEditComplete();
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default AddUserForm;
