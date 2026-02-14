import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

const SuperAdminScreen = () => {
    const navigate = useNavigate();

    const [hotels, setHotels] = useState([]);

    // Hotel meta
    const [hotelName, setHotelName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");


    // DB credentials
    const [dbName, setDbName] = useState("");
    const [dbUser, setDbUser] = useState("");
    const [dbPassword, setDbPassword] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("superAdminToken");

    /* -------------------- LOAD HOTELS -------------------- */
    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const res = await fetch(`${API_URL}/hotels`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) setHotels(data);
        } catch {
            console.error("Failed to load hotels");
        }
    };

    const filteredHotels = hotels.filter(hotel =>
        hotel.hotel_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.db_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /* -------------------- CREATE HOTEL -------------------- */
    const handleAddHotel = async (e) => {
        e.preventDefault();

        const safeRegex = /^[a-z0-9_]+$/;

        if (!hotelName.trim()) return alert("Hotel name required");
        if (!ownerName.trim()) return alert("Owner name required");

        if (!safeRegex.test(dbName))
            return alert("DB name must be lowercase letters, numbers, underscores");

        if (!safeRegex.test(dbUser))
            return alert("DB user must be lowercase letters, numbers, underscores");

        if (dbPassword.length < 6)
            return alert("DB password must be at least 6 characters");


        if (!/^\d{10}$/.test(phone))
            return alert("Phone must be exactly 10 digits");

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return alert("Invalid email address");

        try {
            const res = await fetch(`${API_URL}/hotels`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    hotelName,
                    ownerName,
                    phone,
                    email,
                    dbName,
                    dbUser,
                    dbPassword, // 🔐 hashed in backend
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                return alert(data.error || "Failed to create hotel");
            }

            setHotels(prev => [...prev, data]);
            alert("Hotel, login & database created successfully ✅");

            // Reset form
            setHotelName("");
            setOwnerName("");
            setPhone("");
            setEmail("");
            setDbName("");
            setDbUser("");
            setDbPassword("");

        } catch {
            alert("Server not reachable");
        }
    };

    /* -------------------- USER MANAGEMENT -------------------- */
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [hotelUsers, setHotelUsers] = useState([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    // New User Form State
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const openUserModal = async (hotel) => {
        setSelectedHotel(hotel);
        setIsUserModalOpen(true);
        setHotelUsers([]); // Clear previous
        // Fetch users for this hotel
        try {
            const res = await fetch(`${API_URL}/users?hotel_id=${hotel.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setHotelUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const closeUserModal = () => {
        setIsUserModalOpen(false);
        setSelectedHotel(null);
        setNewUsername("");
        setNewPassword("");
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newUsername || !newPassword) return alert("Username and Password required");

        try {

            const res = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    hotel_id: selectedHotel.id,
                    username: newUsername,
                    password: newPassword,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                return alert(data.error || "Failed to add user");
            }

            // Update list
            setHotelUsers(prev => [...prev, data]);
            alert("User added successfully");
            setNewUsername("");
            setNewPassword("");
        } catch (error) {
            alert("Failed to add user");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Super Admin Dashboard
                </h1>
                <button
                    onClick={() => {
                        localStorage.removeItem("superAdminToken");
                        navigate("/");
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* ADD HOTEL */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Add New Hotel</h2>

                    <form onSubmit={handleAddHotel} className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Hotel Name</label>
                                <input className="w-full p-2 border rounded"
                                    placeholder="Hotel Name"
                                    value={hotelName}
                                    onChange={e => setHotelName(e.target.value)} />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Owner Name</label>
                                <input className="w-full p-2 border rounded"
                                    placeholder="Owner Name"
                                    value={ownerName}
                                    onChange={e => setOwnerName(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                                <input className="w-full p-2 border rounded"
                                    placeholder="Phone"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)} />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input className="w-full p-2 border rounded"
                                    placeholder="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>


                        <div className="border-t pt-4 mt-4">
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Database Configuration</h3>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">DB Name</label>
                                <input className="w-full p-2 border rounded"
                                    placeholder="DB Name"
                                    value={dbName}
                                    onChange={e => setDbName(e.target.value)} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">DB User</label>
                                    <input className="w-full p-2 border rounded"
                                        placeholder="DB User"
                                        value={dbUser}
                                        onChange={e => setDbUser(e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">DB Password</label>
                                    <input type="password"
                                        className="w-full p-2 border rounded"
                                        placeholder="DB Password"
                                        value={dbPassword}
                                        onChange={e => setDbPassword(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded font-bold"
                        >
                            Create Hotel
                        </button>
                    </form>
                </div>

                {/* HOTEL LIST */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">
                        Registered Hotels ({hotels.length})
                    </h2>

                    <input
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />

                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {filteredHotels.map(hotel => (
                            <div key={hotel.id} className="border p-4 rounded bg-gray-50 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg">{hotel.hotel_name}</h3>
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-mono">
                                            {hotel.db_name}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-2 grid grid-cols-2 gap-2">
                                        <p><span className="font-semibold">Owner:</span> {hotel.owner_name}</p>
                                        <p><span className="font-semibold">Phone:</span> {hotel.phone}</p>
                                        <p><span className="font-semibold">Email:</span> {hotel.email}</p>
                                        <p><span className="font-semibold">Hotel Code:</span> {hotel.hotel_code}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t flex justify-end">
                                    <button
                                        onClick={() => openUserModal(hotel)}
                                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                                    >
                                        Manage Users
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* USER MANAGEMENT MODAL */}
            {isUserModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Users for: {selectedHotel?.hotel_name}</h2>
                            <button onClick={closeUserModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                        </div>

                        <div className="p-6">
                            {/* Add User Form */}
                            <div className="bg-gray-50 p-4 rounded mb-6 border">
                                <h3 className="font-bold mb-3 text-sm uppercase text-gray-500">Add New User</h3>
                                <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                    <div className="col-span-1">
                                        <input
                                            className="w-full p-2 border rounded text-sm"
                                            placeholder="Username"
                                            value={newUsername}
                                            onChange={e => setNewUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <input
                                            type="password"
                                            className="w-full p-2 border rounded text-sm"
                                            placeholder="Password"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <button
                                            type="submit"
                                            className="w-full bg-green-600 text-white p-2 rounded text-sm font-bold hover:bg-green-700"
                                        >
                                            Add User
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* User List */}
                            <div>
                                <h3 className="font-bold mb-3 text-sm uppercase text-gray-500">Existing Users</h3>
                                {hotelUsers.length === 0 ? (
                                    <p className="text-gray-500 italic">No users found for this hotel.</p>
                                ) : (
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                                <th className="p-2 border">Username</th>
                                                <th className="p-2 border">Role</th>
                                                <th className="p-2 border">Created At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {hotelUsers.map((user, idx) => (
                                                <tr key={idx} className="border-b text-sm">
                                                    <td className="p-2 border font-medium">{user.username}</td>
                                                    <td className="p-2 border">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                            user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-2 border text-gray-500">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t bg-gray-50 text-right">
                            <button
                                onClick={closeUserModal}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminScreen;
