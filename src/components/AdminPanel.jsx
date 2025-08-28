import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000"; // Keep this for API calls, not for images

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [sizes, setSizes] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/products`);
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("originalPrice", originalPrice);
    if (discountedPrice) formData.append("discountedPrice", discountedPrice);
    formData.append("sizes", sizes);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/products/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/api/products`, formData);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  const resetForm = () => {
    setName("");
    setOriginalPrice("");
    setDiscountedPrice("");
    setSizes("");
    setImage(null);
    setImagePreview(null);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setName(product.name);
    setOriginalPrice(product.originalPrice);
    setDiscountedPrice(product.discountedPrice || "");
    setSizes(product.sizes.join(","));
    setImage(null);
    setImagePreview(product.image); // ✅ Direct Cloudinary URL
    setEditingId(product._id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Admin Panel - Product Management
      </h1>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Original Price"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Discounted Price (optional)"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Sizes (comma separated)"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="file"
            onChange={handleImageChange}
            className="p-2 border rounded"
            accept="image/*"
          />
        </div>

        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}

        <button
          type="submit"
          className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      <h2 className="text-xl font-semibold mb-4">Product List</h2>
      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg shadow-md p-4 bg-white"
            >
              <img
                src={p.image} // ✅ Direct Cloudinary URL
                alt={p.name}
                className="w-full h-48 object-cover"
              />
              <h3 className="text-lg font-semibold mt-2">{p.name}</h3>
              <p className="text-gray-600">Sizes: {p.sizes.join(", ")}</p>
              <p className="text-red-500 font-bold">
                ₹{p.discountedPrice || p.originalPrice}
              </p>
              {p.discountedPrice && (
                <p className="text-gray-400 line-through">
                  ₹{p.originalPrice}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(p)}
                  className="flex-1 bg-yellow-400 p-2 rounded hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
