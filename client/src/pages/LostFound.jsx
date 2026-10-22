import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import useAuth from '../hooks/useAuth';
import LostFoundCard from '../components/LostFoundCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { fileToBase64 } from '../utils/fileHelpers';
import { 
  Search, 
  Plus, 
  MapPin, 
  Tag, 
  Phone, 
  Calendar, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon 
} from 'lucide-react';

const LostFound = () => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageName, setImageName] = useState('');

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Lost',
    category: 'Electronics',
    location: '',
    date: new Date().toISOString().split('T')[0],
    contact: '',
    image: '',
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (type !== 'All') params.type = type;
      if (category !== 'All') params.category = category;
      if (status !== 'All') params.status = status;

      const res = await API.get('/lost-found', { params });
      setItems(res.data.data || []);
    } catch (err) {
      console.error('Error fetching lost & found items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, type, category, status]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setFormError('');
      setImageName(file.name);
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      setFormData({ ...formData, image: base64 });
    } catch (err) {
      setFormError(err.message || 'Error processing selected photo');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setImageName('');
    setFormData({ ...formData, image: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.description || !formData.location || !formData.contact) {
      setFormError('Please fill in Item Name, Description, Campus Location, and Contact details');
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post('/lost-found', formData);
      setItems([res.data.data, ...items]);
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        type: 'Lost',
        category: 'Electronics',
        location: '',
        date: new Date().toISOString().split('T')[0],
        contact: '',
        image: '',
      });
      handleRemoveImage();
      setSuccessMsg('🎉 Listing published successfully to Lost & Found!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error creating listing');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      const res = await API.put(`/lost-found/${id}`, { status: newStatus });
      setItems(items.map((it) => (it._id === id ? res.data.data : it)));
      setSuccessMsg(`Item marked as ${newStatus}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await API.delete(`/lost-found/${id}`);
      setItems(items.filter((it) => it._id !== id));
      setSuccessMsg('Listing deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Search className="w-7 h-7 text-amber-600" />
            <span>Campus Lost & Found</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Report lost items or claim discovered belongings across campus departments and labs.
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Report Item</span>
          </button>
        )}
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by item name, location, or description..."
            onClear={() => setSearch('')}
          />

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
            <FilterBar
              label="Type"
              options={['All', 'Lost', 'Found']}
              value={type}
              onChange={setType}
            />

            <FilterBar
              label="Category"
              options={['All', 'Electronics', 'Documents', 'Books', 'Accessories', 'Clothing', 'Other']}
              value={category}
              onChange={setCategory}
            />

            <FilterBar
              label="Status"
              options={['All', 'Active', 'Resolved']}
              value={status}
              onChange={setStatus}
            />
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <LoadingSpinner text="Searching lost & found reports..." />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No items found"
          description="There are currently no listings matching your search parameters."
          actionText={isAuthenticated ? "Report an Item" : null}
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <LostFoundCard
              key={item._id}
              item={item}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      )}

      {/* Report Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Report Lost or Found Campus Item"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Report Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Lost">Lost Item (I lost something)</option>
                <option value="Found">Found Item (I discovered something)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Electronics">Electronics (Laptop, Phone, Charger, Calc)</option>
                <option value="Documents">Documents (ID Card, Files, Hall Ticket)</option>
                <option value="Books">Books / Notebooks</option>
                <option value="Accessories">Accessories (Keys, Watch, Glasses)</option>
                <option value="Clothing">Clothing (Jacket, Umbrella)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Item Name / Title *
            </label>
            <input
              type="text"
              required
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="e.g., Casio Scientific Calculator fx-991EX"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Campus Location *
              </label>
              <input
                type="text"
                required
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="e.g., Central Library 2nd Floor or CSE Lab 2"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contact Details (Phone / College Email) *
            </label>
            <input
              type="text"
              required
              name="contact"
              value={formData.contact}
              onChange={handleFormChange}
              placeholder="e.g., +91 98765 43210 or your.email@college.edu"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Photo Upload with Device Picker & Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Item Photo (Upload from Device or Paste Link)
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-56 flex items-center justify-center p-2">
                <img
                  src={imagePreview}
                  alt="Item preview"
                  className="max-h-52 object-contain rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-3 px-4 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl text-xs font-semibold text-slate-600 hover:text-amber-700 hover:bg-amber-50/50 flex items-center justify-center gap-2 transition"
                >
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>Choose Photo from Computer</span>
                </button>
              </div>
            )}

            {!imagePreview && (
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={(e) => {
                  handleFormChange(e);
                  setImagePreview(e.target.value);
                }}
                placeholder="Or paste direct image URL (https://...)"
                className="w-full mt-2 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Item Description & Distinguishing Marks *
            </label>
            <textarea
              required
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Describe color, brand, stickers, scratches, or where it was kept..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Post Listing'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LostFound;
