import React, { useState, useEffect } from 'react';

const AddProductForm = ({ productToEdit, onEditComplete }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [imageType, setImageType] = useState('url'); // 'url' or 'file'
    const fileInputRef = React.useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    React.useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setCategory(productToEdit.category);
            setPrice(productToEdit.price);
            setImage(productToEdit.image);
        } else {
            setName('');
            setCategory('');
            setPrice('');
            setImage('');
        }
    }, [productToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');

        if (productToEdit) {
            const updatedProducts = existingProducts.map(p =>
                p.id === productToEdit.id
                    ? { ...p, name, category, price: parseFloat(price), image }
                    : p
            );
            localStorage.setItem('products', JSON.stringify(updatedProducts));
            alert('Product updated successfully!');
        } else {
            const newProduct = { id: Date.now(), name, category, price: parseFloat(price), image };
            localStorage.setItem('products', JSON.stringify([...existingProducts, newProduct]));
            alert('Product added successfully!');
        }

        setName('');
        setCategory('');
        setPrice('');
        setImage('');
        if (onEditComplete) onEditComplete();
    };

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const storedCategories = JSON.parse(localStorage.getItem('appSettings_categories') || '["Beverages", "Starters", "Main Course"]');
        setCategories(storedCategories);
    }, []);

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Product Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2 border rounded"
                    step="0.01"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Image</label>
                <div className="flex gap-4 mb-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            checked={imageType === 'url'}
                            onChange={() => setImageType('url')}
                            className="mr-2"
                        />
                        Image URL
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            checked={imageType === 'file'}
                            onChange={() => setImageType('file')}
                            className="mr-2"
                        />
                        Upload File
                    </label>
                </div>

                {imageType === 'url' ? (
                    <input
                        type="url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full p-2 border rounded"
                    />
                ) : (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full p-2 border rounded"
                        ref={fileInputRef}
                    />
                )}
                {image && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-1">Preview:</p>
                        <img src={image} alt="Preview" className="h-20 w-20 object-cover rounded border" />
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1">
                    {productToEdit ? 'Update Product' : 'Add Product'}
                </button>
                {productToEdit && (
                    <button
                        type="button"
                        onClick={() => {
                            setName('');
                            setCategory('');
                            setPrice('');
                            setImage('');
                            setImageType('url');
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
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

export default AddProductForm;
