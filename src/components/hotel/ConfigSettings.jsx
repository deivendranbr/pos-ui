import React, { useState, useEffect } from 'react';

const ConfigSettings = () => {
    const [roles, setRoles] = useState(['admin', 'waiter', 'kitchen']);
    const [categories, setCategories] = useState(['Beverages', 'Starters', 'Main Course']);
    const [newRole, setNewRole] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [currencySymbol, setCurrencySymbol] = useState('₹');

    useEffect(() => {
        const storedSymbol = localStorage.getItem('currencySymbol');
        if (storedSymbol) setCurrencySymbol(storedSymbol);

        try {
            const storedRoles = JSON.parse(localStorage.getItem('appSettings_roles') || 'null');
            if (Array.isArray(storedRoles)) setRoles(storedRoles);

            const storedCategories = JSON.parse(localStorage.getItem('appSettings_categories') || 'null');
            if (Array.isArray(storedCategories)) setCategories(storedCategories);
        } catch (error) {
            console.error("Error loading settings:", error);
            // Optionally reset to defaults if corrupted
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('currencySymbol', currencySymbol);
        localStorage.setItem('appSettings_roles', JSON.stringify(roles));
        localStorage.setItem('appSettings_categories', JSON.stringify(categories));

        alert('Settings saved successfully!');
        if (confirm('Reload page to apply changes?')) {
            window.location.reload();
        }
    };

    const addRole = () => {
        if (newRole && !roles.includes(newRole.toLowerCase())) {
            setRoles([...roles, newRole.toLowerCase()]);
            setNewRole('');
        }
    };

    const removeRole = (role) => {
        setRoles(roles.filter(r => r !== role));
    };

    const addCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setNewCategory('');
        }
    };

    const removeCategory = (cat) => {
        setCategories(categories.filter(c => c !== cat));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold mb-6">Configuration Settings</h2>

            {/* Currency Section */}
            <div className="mb-8 border-b pb-6">
                <h3 className="text-lg font-semibold mb-3">General</h3>
                <label className="block text-gray-700 mb-2">Currency Symbol</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={currencySymbol}
                        onChange={(e) => setCurrencySymbol(e.target.value)}
                        className="w-full p-2 border rounded max-w-xs"
                        placeholder="e.g. ₹, $, €"
                    />
                </div>
            </div>

            {/* Roles Section */}
            <div className="mb-8 border-b pb-6">
                <h3 className="text-lg font-semibold mb-3">User Roles</h3>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="p-2 border rounded"
                        placeholder="New Role"
                    />
                    <button onClick={addRole} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {roles.map(role => (
                        <span key={role} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2">
                            <span className="capitalize">{role}</span>
                            <button onClick={() => removeRole(role)} className="text-red-500 font-bold">×</button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Categories Section */}
            <div className="mb-8 border-b pb-6">
                <h3 className="text-lg font-semibold mb-3">Food Categories</h3>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="p-2 border rounded"
                        placeholder="New Category"
                    />
                    <button onClick={addCategory} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <span key={cat} className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2">
                            <span>{cat}</span>
                            <button onClick={() => removeCategory(cat)} className="text-red-500 font-bold">×</button>
                        </span>
                    ))}
                </div>
            </div>

            <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
            >
                Save All Settings
            </button>
        </div>
    );
};

export default ConfigSettings;
