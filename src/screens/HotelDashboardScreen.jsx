import React, { useState, useEffect } from 'react';
import AddUserForm from '../components/hotel/AddUserForm';
import AddProductForm from '../components/hotel/AddProductForm';
import UserList from '../components/hotel/UserList';
import ProductList from '../components/hotel/ProductList';
import ConfigSettings from '../components/hotel/ConfigSettings';
import { useNavigate } from 'react-router-dom';

const HotelDashboardScreen = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const loadProducts = () => {
        const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
        setProducts(storedProducts);
    };

    const loadUsers = () => {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUsers(storedUsers);
    };

    useEffect(() => {
        if (activeTab === 'products') {
            loadProducts();
        } else if (activeTab === 'users') {
            loadUsers();
        }
    }, [activeTab]);

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEditProductComplete = () => {
        setEditingProduct(null);
        loadProducts();
    };

    const handleEditUserComplete = () => {
        setEditingUser(null);
        loadUsers();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Captain Dashboard</h1>
                <button
                    onClick={() => navigate('/')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Home
                </button>
            </div>

            <div className="flex space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                        }`}
                    onClick={() => setActiveTab('users')}
                >
                    Manage Users
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                        }`}
                    onClick={() => setActiveTab('products')}
                >
                    Manage Products
                </button>
                <button
                    className={`px-4 py-2 rounded ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                        }`}
                    onClick={() => setActiveTab('settings')}
                >
                    Settings
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTab === 'users' ? (
                    <>
                        <div className="md:col-span-1">
                            <AddUserForm
                                userToEdit={editingUser}
                                onEditComplete={handleEditUserComplete}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <UserList users={users} onEdit={handleEditUser} />
                        </div>
                    </>
                ) : activeTab === 'products' ? (
                    <>
                        <div className="md:col-span-1">
                            <AddProductForm
                                productToEdit={editingProduct}
                                onEditComplete={handleEditProductComplete}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <ProductList products={products} onEdit={handleEditProduct} />
                        </div>
                    </>
                ) : (
                    <div className="md:col-span-2">
                        <ConfigSettings />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelDashboardScreen;
