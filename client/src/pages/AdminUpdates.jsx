import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import useAuth from '../hooks/useAuth';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { fileToBase64, formatBytes } from '../utils/fileHelpers';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Tag, 
  FileText,
  AlertCircle,
  CheckCircle2,
  Upload,
  X,
  ExternalLink
} from 'lucide-react';

const AdminUpdates = () => {
  const { user } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Attachments
  const [imagePreview, setImagePreview] = useState('');
  const [attachFileName, setAttachFileName] = useState('');

  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Notices',
    date: new Date().toISOString().split('T')[0],
    image: '',
    attachment: '',
  });

  const categories = [
    'Notices',
    'Events',
    'Workshops',
    'Hackathons',
    'Clubs',
    'Academics',
    'Deadlines',
  ];

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const res = await API.get('/updates');
      setUpdates(res.data.data || []);
    } catch (err) {
      console.error('Error fetching admin updates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormError('');
    setImagePreview('');
    setAttachFileName('');
    setFormData({
      title: '',
      description: '',
      category: 'Notices',
      date: new Date().toISOString().split('T')[0],
      image: '',
      attachment: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setCurrentId(item._id);
    setFormError('');
    setImagePreview(item.image || '');
    setAttachFileName(item.attachment ? 'Current Attachment' : '');
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      date: item.date,
      image: item.image || '',
      attachment: item.attachment || '',
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      setFormData({ ...formData, image: base64 });
    } catch (err) {
      setFormError(err.message || 'Error processing poster image');
    }
  };

  const handleDocFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setAttachFileName(file.name);
      const base64 = await fileToBase64(file);
      setFormData({ ...formData, attachment: base64 });
    } catch (err) {
      setFormError(err.message || 'Error processing attachment document');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.description) {
      setFormError('Please provide both Title and Description');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        const res = await API.put(`/admin/updates/${currentId}`, formData);
        setUpdates(updates.map((u) => (u._id === currentId ? res.data.data : u)));
        setSuccessMsg('Notice updated successfully!');
      } else {
        const res = await API.post('/admin/updates', formData);
        setUpdates([res.data.data, ...updates]);
        setSuccessMsg('🎉 Official notice published to student portal!');
      }
      setIsModalOpen(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving update');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this official update permanently?')) return;
    try {
      await API.delete(`/admin/updates/${id}`);
      setUpdates(updates.filter((u) => u._id !== id));
      setSuccessMsg('Notice deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting update');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Console</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Official Campus Updates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish department circulars, timetable notices, workshops, and deadlines for students.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Notice</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Table / List View */}
      {loading ? (
        <LoadingSpinner text="Loading admin console records..." />
      ) : updates.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No campus notices published"
          description="Create your first notice or event for the student portal."
          actionText="Create Notice"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Headline</th>
                  <th className="py-3 px-4">Event Date</th>
                  <th className="py-3 px-4">Posted By</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {updates.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {item.createdBy?.name || 'Administrator'}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Official Update' : 'Publish Official Campus Update'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Title / Circular Headline *
            </label>
            <input
              type="text"
              required
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="e.g., End Semester Examination Tentative Schedule"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Event / Circular Date *
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

          {/* Hidden inputs */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            onChange={handleImageFile}
            className="hidden"
          />
          <input
            type="file"
            ref={docInputRef}
            accept=".pdf,.doc,.docx"
            onChange={handleDocFile}
            className="hidden"
          />

          {/* Banner Poster Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Banner / Poster Image
            </label>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-44 flex items-center justify-center p-2 bg-slate-50">
                <img src={imagePreview} alt="Preview" className="max-h-40 object-contain rounded-lg" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setFormData({ ...formData, image: '' });
                  }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full py-2.5 px-3 border border-dashed border-slate-300 hover:border-brand-500 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5 text-brand-600" />
                <span>Choose Poster Image from Computer</span>
              </button>
            )}
          </div>

          {/* Attachment Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Attachment (PDF / Document)
            </label>
            {attachFileName ? (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-brand-600" />
                  <span className="font-semibold text-slate-800 truncate">{attachFileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAttachFileName('');
                    setFormData({ ...formData, attachment: '' });
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                className="w-full py-2.5 px-3 border border-dashed border-slate-300 hover:border-brand-500 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5 text-brand-600" />
                <span>Choose PDF / Circular from Computer</span>
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Update Content & Instructions *
            </label>
            <textarea
              required
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Detailed notification text for students..."
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
              className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Notice' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUpdates;
