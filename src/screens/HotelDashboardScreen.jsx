import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddUserForm from '../components/hotel/AddUserForm';
import AddProductForm from '../components/hotel/AddProductForm';
import UserList from '../components/hotel/UserList';
import ProductList from '../components/hotel/ProductList';
import ConfigSettings from '../components/hotel/ConfigSettings';

const HotelDashboardScreen = () => {
    const navigate = useNavigate();

    // --- State ---
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, users, products, settings
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Table Data State
    const [tables, setTables] = useState([
        { id: 1, name: 'Table 1', category: 'A/C', status: 'blank' },
        { id: 2, name: 'Table 2', category: 'A/C', status: 'running' },
        { id: 3, name: 'Table 3', category: 'A/C', status: 'blank' },
        { id: 4, name: 'Table 4', category: 'A/C', status: 'blank' },
        { id: 5, name: 'Table 5', category: 'A/C', status: 'running' },
        { id: 6, name: 'Table 6', category: 'A/C', status: 'blank' },
        { id: 7, name: 'Table 7', category: 'A/C', status: 'blank' },
        { id: 8, name: 'Table 8', category: 'A/C', status: 'running' },
        { id: 9, name: 'Table 9', category: 'A/C', status: 'running_kot' },
        { id: 10, name: 'Table 10', category: 'A/C', status: 'blank' },
        { id: 11, name: 'Table 11', category: 'A/C', status: 'blank' },
        { id: 12, name: 'Table 12', category: 'A/C', status: 'running' },
        { id: 14, name: 'Table 14', category: 'A/C', status: 'printed' },
        { id: 19, name: 'Table 19', category: 'A/C', status: 'running_kot' },
        { id: 26, name: 'Table 26', category: 'A/C', status: 'printed' },
        { id: 27, name: 'Table 27', category: 'A/C', status: 'running_kot' },
        { id: 28, name: 'Table 28', category: 'A/C', status: 'running_kot' },
        // Non A/C
        { id: 101, name: 'Table 1', category: 'Non A/C', status: 'blank' },
        { id: 102, name: 'Table 2', category: 'Non A/C', status: 'running_kot' },
        { id: 103, name: 'Table 3', category: 'Non A/C', status: 'blank' },
        { id: 104, name: 'Table 4', category: 'Non A/C', status: 'blank' },
        { id: 105, name: 'Table 5', category: 'Non A/C', status: 'blank' },
        { id: 106, name: 'Table 6', category: 'Non A/C', status: 'blank' },
        { id: 107, name: 'Table 7', category: 'Non A/C', status: 'blank' },
        { id: 108, name: 'Table 8', category: 'Non A/C', status: 'running_kot' },
        { id: 109, name: 'Table 9', category: 'Non A/C', status: 'blank' },
    ]);

    // Existing Management State
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingUser, setEditingUser] = useState(null);

    // --- Helpers ---
    const loadProducts = () => {
        const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
        setProducts(storedProducts);
    };

    const loadUsers = () => {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUsers(storedUsers);
    };

    useEffect(() => {
        if (activeTab === 'products') loadProducts();
        if (activeTab === 'users') loadUsers();
    }, [activeTab]);

    const handleAddTable = () => {
        const category = prompt("Enter Category (A/C, Non A/C, Bar):", "A/C") || "A/C";
        const newId = Math.max(...tables.map(t => t.id)) + 1;
        const countInCategory = tables.filter(t => t.category === category).length + 1;
        const newTable = {
            id: newId,
            name: `Table ${countInCategory}`,
            category,
            status: 'blank'
        };
        setTables([...tables, newTable]);
    };

    // const getStatusColor = (status) => {
    //     switch (status) {
    //         case 'running': return 'bg-[#BAE6FD] border-[#7DD3FC]';
    //         case 'printed': return 'bg-[#BBF7D0] border-[#86EFAC]';
    //         case 'running_kot': return 'bg-[#FEF08A] border-[#FDE047]';
    //         case 'paid': return 'bg-[#FFEDD5] border-[#FED7AA]';
    //         default: return 'bg-[#F1F5F9] border-[#E2E8F0]'; // blank
    //     }
    // };

    const getStatusTextColor = (status) => {
        console.log(status)
        switch (status) {
            case 'running': return 'text-[#BAE6FD]';
            case 'printed': return 'text-[#BBF7D0]';
            case 'running_kot': return 'text-[#FEF08A]';
            case 'paid': return 'text-[#FFEDD5]';
            default: return 'text-green-700'; // blank
        }
    };
    
    const getStatusColor = (status) => {
        return 'border-[#E2E8F0]';
    };

    // --- Render Components ---

    const renderDashboard = () => {
        const categories = [...new Set(tables.map(t => t.category))];

        return (
            <div className="flex-1 bg-white overflow-hidden flex flex-col">
                {/* Utility Bar */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-[#F1F5F9] bg-white">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-black text-[#1E293B] tracking-tight">Table View</h2>
                        <button className="text-[#94A3B8] hover:text-[#2563EB] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <div className="flex items-center space-x-5 text-[10px] font-black text-[#94A3B8] uppercase tracking-wider">
                            <div className="flex items-center space-x-1.5">
                                <div className="w-3.5 h-3.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full"></div>
                                <span>Blank</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <div className="w-3.5 h-3.5 bg-[#BAE6FD] border border-[#7DD3FC] rounded-full"></div>
                                <span>Running</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <div className="w-3.5 h-3.5 bg-[#BBF7D0] border border-[#86EFAC] rounded-full"></div>
                                <span>Printed</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <div className="w-3.5 h-3.5 bg-[#FFEDD5] border border-[#FED7AA] rounded-full"></div>
                                <span>Paid</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <div className="w-3.5 h-3.5 bg-[#FEF08A] border border-[#FDE047] rounded-full"></div>
                                <span>KOT</span>
                            </div>
                        </div>
                        {/* <button className="bg-[#475569] text-white px-5 py-1.5 rounded-lg text-xs font-black shadow-sm hover:bg-[#334155] transition-all active:scale-95">Delivery</button>
                        <button className="bg-[#475569] text-white px-5 py-1.5 rounded-lg text-xs font-black shadow-sm hover:bg-[#334155] transition-all active:scale-95">Take Away</button> */}
                    </div>
                </div>

                {/* Action Bar */}
                {/* <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#F1F5F9]"> */}
                    {/* <div className="flex items-center space-x-3">
                        <button className="bg-[#2563EB] text-white px-5 py-2 rounded-lg text-xs font-black shadow-md hover:bg-[#1D4ED8] transition-all active:scale-95">+ Table Reservation</button>
                        <button className="bg-[#2563EB] text-white px-5 py-2 rounded-lg text-xs font-black shadow-md hover:bg-[#1D4ED8] transition-all active:scale-95">+ Contactless</button>
                        <button
                            onClick={handleAddTable}
                            className="bg-[#059669] text-white px-5 py-2 rounded-lg text-xs font-black shadow-md hover:bg-[#047857] transition-all active:scale-95"
                        >
                            + Add Table
                        </button>
                    </div> */}

                    {/* <div className="flex items-center space-x-6 flex-wrap"> */}
                        {/* <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-full border border-[#E2E8F0]">
                            <div className="w-10 h-5 bg-[#CBD5E1] rounded-full relative cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm transform transition-transform"></div>
                            </div>
                            <span className="text-[10px] font-black text-[#64748B] uppercase tracking-wider">Move KOT/ Items</span>
                        </div> */}

                        {/* Legend */}
                        {/* <div className="flex items-center space-x-5 text-[10px] font-black text-[#94A3B8] uppercase tracking-wider">
                            <div className="flex items-center space-x-1.5">
                                <div className="w-3.5 h-3.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full"></div>
                                <span>Blank</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <div className="w-3.5 h-3.5 bg-[#BAE6FD] border border-[#7DD3FC] rounded-full"></div>
                                <span>Running</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <div className="w-3.5 h-3.5 bg-[#BBF7D0] border border-[#86EFAC] rounded-full"></div>
                                <span>Printed</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <div className="w-3.5 h-3.5 bg-[#FFEDD5] border border-[#FED7AA] rounded-full"></div>
                                <span>Paid</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <div className="w-3.5 h-3.5 bg-[#FEF08A] border border-[#FDE047] rounded-full"></div>
                                <span>KOT</span>
                            </div>
                        </div> */}

                        {/* <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-wider">Plan</span>
                            <select className="text-xs border border-[#E2E8F0] rounded-lg p-1.5 font-bold text-[#475569] bg-white outline-none focus:ring-1 focus:ring-[#2563EB]">
                                <option>Default Layout</option>
                            </select>
                        </div> */}
                    {/* </div> */}
                {/* </div> */}

                {/* Table Grid Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {categories.map(cat => (
                        <div key={cat} className="mb-10 last:mb-0">
                            <h3 className="text-xs font-black text-[#64748B] uppercase tracking-[0.2em] mb-5 pl-1 border-l-4 border-[#2563EB] leading-none">{cat}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                                {tables.filter(t => t.category === cat).map(table => (
                                    <div
                                        key={table.id}
                                        onClick={() => navigate(`/billing?table=${table.id}`)}
                                        className={`h-24 rounded-2xl border border-solid flex flex-col items-center justify-center cursor-pointer transition-all relative group shadow-sm hover:shadow-md hover:-translate-y-1 active:translate-y-0
                                            ${getStatusColor(table.status)}
                                        `}
                                    >
                                        <span className="text-sm text-[#1E293B]">{table.name}</span>
                                        {/* <span className="text-xs font-medium text-green-700">{table.status !== 'blank' ? 'Free' : 'Occupied'}</span> */}
                                        <span className={`text-xs font-medium ${getStatusTextColor(table.status)}`}>{table.status === 'blank' ? 'Free' : 'Occupied'}</span>

                                        {/* Icons on bottom of card if not blank */}
                                        {/* <div className="absolute bottom-2 flex space-x-1">
                                            {table.status !== 'blank' && (
                                                <div className="bg-white/80 backdrop-blur-xs p-1 rounded-lg border border-white/50 shadow-xs">
                                                    <svg className="w-3 h-3 text-[#1E293B]" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                                                </div>
                                            )}
                                        </div> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen flex flex-col bg-[#F0F4F8] overflow-hidden font-sans">

            {/* --- TOP HEADER --- */}
            <header className="bg-white border-b border-[#E2E8F0] px-4 py-2 flex items-center justify-between shrink-0 shadow-sm z-20">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 hover:bg-[#F1F5F9] rounded text-[#64748B]"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex items-center space-x-1">
                        {/* <div className="w-10 h-10 bg-[#2563EB] rounded-md flex items-center justify-center text-white font-black shadow-sm">POS</div> */}
                        <div className="leading-none hidden sm:block">
                            <div className="text-[10px] font-bold text-[#94A3B8]">Connectra</div>
                            <div className="text-xs font-black text-[#1E293B] tracking-tighter">POSS</div>
                        </div>
                    </div>
                    {/* <button className="bg-[#2563EB] text-white px-3 py-1.5 rounded-md text-xs font-black ml-2 shadow-sm hover:bg-[#1D4ED8] transition-colors">New Order</button> */}
                    {/* <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Bill No"
                            className="pl-8 pr-3 py-1.5 border border-[#E2E8F0] rounded-md text-xs w-32 focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-[#F8FAFC]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div> */}
                </div>

                <div className="flex items-center space-x-6">
                    {/* Feature Icons */}
                    {/* <div className="hidden lg:flex items-center space-x-4">
                        {[
                            { label: 'Menu on/off', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                            { label: 'Store status', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                            { label: 'Live view', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
                            { label: 'Online orders', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
                        ].map(item => (
                            <div key={item.label} className="flex flex-col items-center cursor-pointer group">
                                <svg className="w-5 h-5 text-[#64748B] group-hover:text-[#2563EB] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                </svg>
                                <span className="text-[8px] font-black text-[#94A3B8] mt-1 uppercase leading-none group-hover:text-[#2563EB] transition-colors">{item.label}</span>
                            </div>
                        ))}
                    </div> */}

                    {/* Support Box */}
                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
                            <svg className="w-4 h-4 text-[#2563EB]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="leading-tight">
                            <div className="text-[8px] font-bold text-[#64748B]">Call for Support</div>
                            <div className="text-xs font-black text-[#2563EB]">9099912383</div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/');
                        }}
                        className="p-1 hover:bg-[#F1F5F9] rounded text-[#64748B]"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </header>


            {/* --- MAIN CONTENT --- */}
            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-[#0F172A] bg-opacity-20 z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar Navigation */}
                <aside className={`
                    bg-white border-r border-[#E2E8F0] w-64 flex flex-col shrink-0 fixed inset-y-0 left-0 z-40 lg:relative transition-transform duration-300 transform
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="p-4 border-b border-[#F1F5F9]">
                        <h3 className="text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.1em] leading-none">Management</h3>
                    </div>
                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        <button
                            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                                ${activeTab === 'dashboard' ? 'bg-[#E0F2FE] text-[#0F172A] font-semibold' : 'text-[#64748B] hover:bg-[#F8FAFC] font-medium'}
                            `}
                        >
                            <svg className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span>Table View</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                                ${activeTab === 'users' ? 'bg-[#E0F2FE] text-[#0F172A] font-semibold' : 'text-[#64748B] hover:bg-[#F8FAFC] font-medium'}
                            `}
                        >
                            <svg className={`w-5 h-5 ${activeTab === 'users' ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 01-12 0v1z" />
                            </svg>
                            <span>Manage Users</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                                ${activeTab === 'products' ? 'bg-[#E0F2FE] text-[#0F172A] font-semibold' : 'text-[#64748B] hover:bg-[#F8FAFC] font-medium'}
                            `}
                        >
                            <svg className={`w-5 h-5 ${activeTab === 'products' ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span>Manage Products</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                                ${activeTab === 'settings' ? 'bg-[#E0F2FE] text-[#0F172A] font-semibold' : 'text-[#64748B] hover:bg-[#F8FAFC] font-medium'}
                            `}
                        >
                            <svg className={`w-5 h-5 ${activeTab === 'settings' ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Settings</span>
                        </button>
                    </nav>
                    <div className="p-4 bg-[#F8FAFC] text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] border-t border-[#F1F5F9] leading-none">
                        Captain v2.0.0
                    </div>
                </aside>

                {/* Main Dashboard Area */}
                <main className="flex-1 flex flex-col overflow-hidden bg-white">
                    {activeTab === 'dashboard' && renderDashboard()}

                    {activeTab === 'users' && (
                        <div className="flex-1 p-6 overflow-y-auto bg-[#F0F4F8]">
                            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <AddUserForm
                                    userToEdit={editingUser}
                                    onEditComplete={() => { setEditingUser(null); loadUsers(); }}
                                />
                                <UserList users={users} onEdit={setEditingUser} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="flex-1 p-6 overflow-y-auto bg-[#F0F4F8]">
                            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <AddProductForm
                                    productToEdit={editingProduct}
                                    onEditComplete={() => { setEditingProduct(null); loadProducts(); }}
                                />
                                <ProductList products={products} onEdit={setEditingProduct} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="flex-1 p-6 overflow-y-auto bg-[#F0F4F8]">
                            <div className="max-w-4xl mx-auto">
                                <ConfigSettings />
                            </div>
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
};

export default HotelDashboardScreen;
