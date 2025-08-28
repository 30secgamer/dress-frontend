import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [sizes, setSizes] = useState("S,M,L");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !originalPrice) return alert("Name and Original Price are required");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("originalPrice", Number(originalPrice));
    if (discountedPrice) formData.append("discountedPrice", Number(discountedPrice));
    formData.append("sizes", sizes);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await fetch(`http://localhost:5000/api/products/${editingId}`, { method: "PUT", body: formData });
        alert("✅ Product updated!");
      } else {
        await fetch("http://localhost:5000/api/products", { method: "POST", body: formData });
        alert("✅ Product added!");
      }

      // Reset
      setName(""); setOriginalPrice(""); setDiscountedPrice(""); setSizes("S,M,L");
      setImage(null); setImagePreview(null); setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save product. Check console.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

const handleEdit = (product) => {
  setName(product.name);
  setOriginalPrice(product.originalPrice);
  setDiscountedPrice(product.discountedPrice || "");
  setSizes(product.sizes.join(","));
  setImage(null);
  setImagePreview(`http://localhost:5000${product.image}`);
  setEditingId(product._id);

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 pt-32 px-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 drop-shadow mb-16"
      >
        ✨ Admin Panel ✨
      </motion.h1>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl mx-auto backdrop-blur-lg bg-white/70 shadow-2xl rounded-3xl p-8 mb-16 border border-purple-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <input
            type="text" placeholder="Product Name" value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-xl bg-white/80 border border-gray-300 focus:ring-4 focus:ring-purple-300 outline-none transition shadow-sm"
            required
          />
          <input
            type="number" placeholder="Original Price" value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="p-3 rounded-xl bg-white/80 border border-gray-300 focus:ring-4 focus:ring-purple-300 outline-none transition shadow-sm"
            required
          />
          <input
            type="number" placeholder="Offer Price (optional)" value={discountedPrice}
            onChange={(e) => setDiscountedPrice(e.target.value)}
            className="p-3 rounded-xl bg-white/80 border border-gray-300 focus:ring-4 focus:ring-purple-300 outline-none transition shadow-sm"
          />
          <input
            type="text" placeholder="Sizes (comma separated)" value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            className="p-3 rounded-xl bg-white/80 border border-gray-300 focus:ring-4 focus:ring-purple-300 outline-none transition shadow-sm"
          />
        </div>

        <div className="mt-8 flex flex-col items-center">
          <label className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition font-semibold">
            {image ? "Change Image" : "Upload Image"}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          {imagePreview && (
            <img src={imagePreview} alt="Preview"
                 className="h-24 w-24 object-cover mt-3 rounded-xl shadow-md border border-purple-200"
            />
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition font-bold"
            >
              {editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setName(""); setOriginalPrice(""); setDiscountedPrice(""); setSizes("S,M,L");
                  setImage(null); setImagePreview(null); setEditingId(null);
                }}
                className="bg-gray-500 text-white px-8 py-3 rounded-xl hover:bg-gray-600 transition font-bold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </motion.form>

      {/* Products */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold text-purple-700 mb-8 text-center"
      >
        📦 Existing Products
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {products.map((p, i) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 80 }}
            className="backdrop-blur-md bg-white/90 border border-purple-200 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition"
          >
            <img src={`http://localhost:5000${p.image}`} alt={p.name} className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="font-bold text-xl text-gray-800">{p.name}</h3>
              <p className="text-gray-500 text-sm">
                {p.discountedPrice ? (
                  <>
                    <span className="line-through mr-2">₹{p.originalPrice}</span>
                    <span className="text-purple-600 font-semibold">₹{p.discountedPrice}</span>
                    <span className="text-green-500 ml-2">
                      ({Math.round((1 - p.discountedPrice / p.originalPrice) * 100)}% OFF)
                    </span>
                  </>
                ) : (
                  <>₹{p.originalPrice}</>
                )}
              </p>
              <p className="text-gray-500 text-sm">Sizes: {p.sizes.join(", ")}</p>
              <div className="flex gap-3 mt-5 flex-wrap">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-400 text-white px-5 py-2 rounded-xl shadow hover:bg-yellow-500 hover:scale-105 transition font-semibold"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-5 py-2 rounded-xl shadow hover:bg-red-600 hover:scale-105 transition font-semibold"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
