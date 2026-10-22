import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import useAuth from '../hooks/useAuth';
import UpdateCard from '../components/UpdateCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Bell, ShieldCheck, Plus, Sparkles } from 'lucide-react';

const Updates = () => {
  const { isAdmin } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = [
    'All',
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
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;

      const res = await API.get('/updates', { params });
      setUpdates(res.data.data || []);
    } catch (err) {
      console.error('Error fetching updates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [search, category]);

  const handleDeleteUpdate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this official update?')) return;
    try {
      await API.delete(`/admin/updates/${id}`);
      setUpdates(updates.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting notice');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-rose-600" />
            <span>Campus Updates & Notices</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official department timetables, examination circulars, workshops, and deadlines.
          </p>
        </div>

        {isAdmin && (
          <Link
            to="/admin/updates"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Control Panel</span>
          </Link>
        )}
      </div>

      {/* Search & Category Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search updates by headline or keywords..."
            onClear={() => setSearch('')}
          />

          <FilterBar
            label="Category"
            options={categories}
            value={category}
            onChange={setCategory}
          />
        </div>
      </div>

      {/* Updates Cards Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching official circulars..." />
      ) : updates.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No updates found"
          description="There are currently no circulars or events in this category."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {updates.map((update) => (
            <UpdateCard
              key={update._id}
              update={update}
              onDelete={handleDeleteUpdate}
              onEdit={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Updates;
