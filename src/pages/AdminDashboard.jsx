import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import './AdminDashboard.css';

function AdminDashboard({ navigateTo }) {
  const { user, isAdmin, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState({});
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigateTo('login');
      return;
    }
    loadData();
  }, [user, isAdmin]);

  const loadData = async () => {
    try {
      const [productsRes, ordersRes, reviewsRes, settingsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*, products(name)').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*')
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (reviewsRes.data) setReviews(reviewsRes.data);

      if (settingsRes.data) {
        const settingsObj = {};
        settingsRes.data.forEach(setting => {
          settingsObj[setting.key] = setting.value;
        });
        setSettings(settingsObj);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleLogout = async () => {
    await signOut();
    navigateTo('home');
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get('name'),
      category: formData.get('category'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      sale_price: parseFloat(formData.get('sale_price')),
      stock: parseInt(formData.get('stock')),
      image: formData.get('image'),
      featured: formData.get('featured') === 'on'
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        showToast('Product updated successfully!');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
        showToast('Product added successfully!');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      loadData();
    } catch (error) {
      showToast('Error saving product: ' + error.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      showToast('Product deleted successfully!');
      loadData();
    } catch (error) {
      showToast('Error deleting product: ' + error.message, 'error');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      if (error) throw error;
      showToast('Review deleted successfully!');
      loadData();
    } catch (error) {
      showToast('Error deleting review: ' + error.message, 'error');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const updates = [
        { key: 'hero_image', value: formData.get('hero_image') },
        { key: 'discord_link', value: formData.get('discord_link') },
        { key: 'hero_heading', value: formData.get('hero_heading') },
        { key: 'hero_subheading', value: formData.get('hero_subheading') },
        { key: 'hero_paragraph', value: formData.get('hero_paragraph') }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: update.value, updated_at: new Date().toISOString() })
          .eq('key', update.key);
        if (error) throw error;
      }

      showToast('Settings saved successfully!');
      loadData();
    } catch (error) {
      showToast('Error saving settings: ' + error.message, 'error');
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>
        {toast.message}
      </div>

      <aside className="admin-sidebar">
        <div className="sidebar-logo">AuroraServices</div>
        <ul className="sidebar-menu">
          <li>
            <a
              className={activeSection === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveSection('dashboard')}
            >
              📊 Dashboard
            </a>
          </li>
          <li>
            <a
              className={activeSection === 'products' ? 'active' : ''}
              onClick={() => setActiveSection('products')}
            >
              📦 Products
            </a>
          </li>
          <li>
            <a
              className={activeSection === 'orders' ? 'active' : ''}
              onClick={() => setActiveSection('orders')}
            >
              🛒 Orders
            </a>
          </li>
          <li>
            <a
              className={activeSection === 'reviews' ? 'active' : ''}
              onClick={() => setActiveSection('reviews')}
            >
              ⭐ Reviews
            </a>
          </li>
          <li>
            <a
              className={activeSection === 'settings' ? 'active' : ''}
              onClick={() => setActiveSection('settings')}
            >
              ⚙️ Settings
            </a>
          </li>
          <li>
            <a onClick={handleLogout} style={{ color: '#ef4444' }}>
              🚪 Logout
            </a>
          </li>
        </ul>
      </aside>

      <main className="admin-main">
        {activeSection === 'dashboard' && (
          <div className="admin-section">
            <div className="admin-header">
              <h1 className="admin-title">Dashboard</h1>
            </div>
            <div className="stats-cards">
              <div className="stat-card-admin">
                <h3>Total Products</h3>
                <div className="number">{products.length}</div>
              </div>
              <div className="stat-card-admin">
                <h3>Total Orders</h3>
                <div className="number">{orders.length}</div>
              </div>
              <div className="stat-card-admin">
                <h3>Total Reviews</h3>
                <div className="number">{reviews.length}</div>
              </div>
              <div className="stat-card-admin">
                <h3>Pending Orders</h3>
                <div className="number">{orders.filter(o => o.status === 'pending').length}</div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'products' && (
          <div className="admin-section">
            <div className="admin-header">
              <h1 className="admin-title">Products Management</h1>
              <button
                className="btn-add"
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductModal(true);
                }}
              >
                + Add New Product
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.sale_price?.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`badge ${product.featured ? 'badge-success' : 'badge-warning'}`}>
                        {product.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => {
                          setEditingProduct(product);
                          setShowProductModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="admin-section">
            <div className="admin-header">
              <h1 className="admin-title">Orders Management</h1>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.order_number}</td>
                    <td>{order.products?.name}</td>
                    <td>{order.customer_email}</td>
                    <td>${order.amount?.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'reviews' && (
          <div className="admin-section">
            <div className="admin-header">
              <h1 className="admin-title">Reviews Management</h1>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review.id}>
                    <td>{review.author}</td>
                    <td>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</td>
                    <td>{review.comment}</td>
                    <td>{new Date(review.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="admin-section">
            <div className="admin-header">
              <h1 className="admin-title">Site Settings</h1>
            </div>
            <div className="settings-form-container">
              <form onSubmit={handleSaveSettings}>
                <div className="form-group">
                  <label className="form-label">Hero Image URL</label>
                  <input
                    type="text"
                    className="form-input"
                    name="hero_image"
                    defaultValue={settings.hero_image}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Discord Server Link</label>
                  <input
                    type="text"
                    className="form-input"
                    name="discord_link"
                    defaultValue={settings.discord_link}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hero Heading</label>
                  <input
                    type="text"
                    className="form-input"
                    name="hero_heading"
                    defaultValue={settings.hero_heading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hero Subheading</label>
                  <input
                    type="text"
                    className="form-input"
                    name="hero_subheading"
                    defaultValue={settings.hero_subheading}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hero Paragraph</label>
                  <textarea
                    className="form-textarea"
                    name="hero_paragraph"
                    defaultValue={settings.hero_paragraph}
                    required
                  />
                </div>
                <button type="submit" className="btn-add">
                  Save Settings
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {showProductModal && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-input"
                  name="name"
                  defaultValue={editingProduct?.name}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-input"
                  name="category"
                  defaultValue={editingProduct?.category}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  name="description"
                  defaultValue={editingProduct?.description}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-input"
                  name="price"
                  step="0.01"
                  defaultValue={editingProduct?.price}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sale Price</label>
                <input
                  type="number"
                  className="form-input"
                  name="sale_price"
                  step="0.01"
                  defaultValue={editingProduct?.sale_price}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  className="form-input"
                  name="stock"
                  defaultValue={editingProduct?.stock}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  name="image"
                  defaultValue={editingProduct?.image}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={editingProduct?.featured}
                    style={{ marginRight: '8px' }}
                  />
                  Featured Product
                </label>
              </div>
              <button type="submit" className="btn-primary full-width">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
