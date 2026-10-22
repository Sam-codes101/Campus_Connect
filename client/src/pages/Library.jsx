import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import useAuth from '../hooks/useAuth';
import ResourceCard from '../components/ResourceCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { fileToBase64, formatBytes } from '../utils/fileHelpers';
import { 
  BookOpen, 
  Plus, 
  Upload, 
  Filter, 
  CheckCircle2, 
  FileText, 
  X, 
  Link as LinkIcon 
} from 'lucide-react';

const Library = () => {
  const { isAuthenticated } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('All');
  const [semester, setSemester] = useState('All');
  const [type, setType] = useState('All');

  // Upload Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  const docInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    branch: 'CSE',
    semester: 'Semester 5',
    type: 'Notes',
    fileUrl: '',
  });

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (branch !== 'All') params.branch = branch;
      if (semester !== 'All') params.semester = semester;
      if (type !== 'All') params.type = type;

      const res = await API.get('/resources', { params });
      setResources(res.data.data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [search, branch, semester, type]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDocFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setFormError('');
      setFileName(file.name);
      setFileSize(formatBytes(file.size));
      const base64 = await fileToBase64(file);
      setFormData({ ...formData, fileUrl: base64 });
    } catch (err) {
      setFormError(err.message || 'Error processing document');
    }
  };

  const handleRemoveDoc = () => {
    setFileName('');
    setFileSize('');
    setFormData({ ...formData, fileUrl: '' });
    if (docInputRef.current) docInputRef.current.value = '';
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.subject || !formData.fileUrl) {
      setFormError('Please fill in Title, Subject, and Document File or Link');
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post('/resources', formData);
      setResources([res.data.data, ...resources]);
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        subject: '',
        branch: 'CSE',
        semester: 'Semester 5',
        type: 'Notes',
        fileUrl: '',
      });
      handleRemoveDoc();
      setSuccessMsg('🎉 Academic resource published to the campus library!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error uploading resource');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to remove this academic resource?')) return;
    try {
      await API.delete(`/resources/${id}`);
      setResources(resources.filter((r) => r._id !== id));
      setSuccessMsg('Resource deleted successfully');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete resource');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-brand-600" />
            <span>Campus Academic Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access curated lecture notes, university PYQs, lab manuals & question banks.
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Resource</span>
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

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by title, subject or topic..."
            onClear={() => setSearch('')}
          />

          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
            <FilterBar
              label="Branch"
              options={['All', 'CSE', 'IT', 'ECE', 'EE', 'MECH', 'CIVIL']}
              value={branch}
              onChange={setBranch}
            />

            <FilterBar
              label="Semester"
              options={['All', 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8']}
              value={semester}
              onChange={setSemester}
            />

            <FilterBar
              label="Type"
              options={['All', 'Notes', 'PYQs', 'Lab Files', 'Assignments', 'Study Material']}
              value={type}
              onChange={setType}
            />
          </div>
        </div>
      </div>

      {/* Resources Cards Grid */}
      {loading ? (
        <LoadingSpinner text="Searching study resources..." />
      ) : resources.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No resources found"
          description="Try broadening your search query or reset your semester and category filters."
          actionText={isAuthenticated ? "Upload the first one" : null}
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((resource) => (
            <ResourceCard
              key={resource._id}
              resource={resource}
              onDelete={handleDeleteResource}
            />
          ))}
        </div>
      )}

      {/* Upload Resource Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Academic Resource"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              required
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="e.g., Computer Architecture Unit 1-4 Complete Notes"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                required
                name="subject"
                value={formData.subject}
                onChange={handleFormChange}
                placeholder="e.g., Database Management Systems"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Resource Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Notes">Notes</option>
                <option value="PYQs">PYQs (Question Papers)</option>
                <option value="Lab Files">Lab Files</option>
                <option value="Assignments">Assignments</option>
                <option value="Study Material">Study Material</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Branch *
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleFormChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EE">EE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleFormChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={`Semester ${s}`}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Document File / Link Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Document File or Public Link *
            </label>

            <input
              type="file"
              ref={docInputRef}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
              onChange={handleDocFileChange}
              className="hidden"
            />

            {fileName ? (
              <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-800 truncate">{fileName}</span>
                  <span className="text-[10px] text-slate-500 shrink-0">({fileSize})</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveDoc}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => docInputRef.current?.click()}
                  className="flex-1 py-3 px-4 border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl text-xs font-semibold text-slate-600 hover:text-brand-700 hover:bg-brand-50/50 flex items-center justify-center gap-2 transition"
                >
                  <Upload className="w-4 h-4 text-brand-600" />
                  <span>Choose PDF / Document from Computer</span>
                </button>
              </div>
            )}

            {!fileName && (
              <input
                type="url"
                name="fileUrl"
                value={formData.fileUrl}
                onChange={handleFormChange}
                placeholder="Or paste public share link (Google Drive, Dropbox, Cloudinary, etc.)"
                className="w-full mt-2 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description / Chapter Coverage
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Brief summary of syllabus units covered or tips for exams..."
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
              {submitting ? 'Uploading...' : 'Publish Resource'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Library;
