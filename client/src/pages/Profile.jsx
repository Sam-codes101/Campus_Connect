import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import API from '../services/api';
import Modal from '../components/Modal';
import ResourceCard from '../components/ResourceCard';
import LostFoundCard from '../components/LostFoundCard';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { fileToBase64 } from '../utils/fileHelpers';
import { 
  User, 
  Mail, 
  GraduationCap, 
  BookOpen, 
  Search, 
  Users, 
  Edit3, 
  CheckCircle2, 
  Tag, 
  Sparkles,
  Camera,
  Upload,
  X
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('resources'); // 'resources' | 'lostFound' | 'posts'
  
  // Tab data states
  const [loadingData, setLoadingData] = useState(true);
  const [myResources, setMyResources] = useState([]);
  const [myLostFound, setMyLostFound] = useState([]);
  const [myPosts, setMyPosts] = useState([]);

  // Edit Profile Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [editError, setEditError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.profileImage || '');

  const avatarInputRef = useRef(null);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    branch: user?.branch || 'CSE',
    year: user?.year || '3rd Year',
    section: user?.section || 'A',
    bio: user?.bio || '',
    interests: user?.interests ? user.interests.join(', ') : '',
    profileImage: user?.profileImage || '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        branch: user.branch || 'CSE',
        year: user.year || '3rd Year',
        section: user.section || 'A',
        bio: user.bio || '',
        interests: Array.isArray(user.interests) ? user.interests.join(', ') : '',
        profileImage: user.profileImage || '',
      });
      setAvatarPreview(user.profileImage || '');
      fetchUserActivities();
    }
  }, [user]);

  const fetchUserActivities = async () => {
    if (!user) return;
    try {
      setLoadingData(true);
      const [resRes, lfRes, postRes] = await Promise.all([
        API.get('/resources'),
        API.get('/lost-found'),
        API.get('/posts'),
      ]);

      const userId = user._id;
      setMyResources(resRes.data.data?.filter((r) => (r.uploadedBy?._id || r.uploadedBy) === userId) || []);
      setMyLostFound(lfRes.data.data?.filter((lf) => (lf.postedBy?._id || lf.postedBy) === userId) || []);
      setMyPosts(postRes.data.data?.filter((p) => (p.author?._id || p.author) === userId) || []);
    } catch (err) {
      console.error('Error fetching student activities:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleEditChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setAvatarPreview(base64);
      setProfileForm({ ...profileForm, profileImage: base64 });
    } catch (err) {
      setEditError(err.message || 'Error processing avatar');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setSubmittingProfile(true);

    try {
      const res = await API.put('/users/profile', profileForm);
      updateUser(res.data.data);
      setIsEditModalOpen(false);
      setSuccessMsg('🎉 Student profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await API.delete(`/resources/${id}`);
      setMyResources(myResources.filter((r) => r._id !== id));
      setSuccessMsg('Resource removed');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting');
    }
  };

  const handleToggleLostFound = async (id, newStatus) => {
    try {
      const res = await API.put(`/lost-found/${id}`, { status: newStatus });
      setMyLostFound(myLostFound.map((it) => (it._id === id ? res.data.data : it)));
      setSuccessMsg(`Status updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating');
    }
  };

  const handleDeleteLostFound = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await API.delete(`/lost-found/${id}`);
      setMyLostFound(myLostFound.filter((it) => it._id !== id));
      setSuccessMsg('Listing removed');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting');
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      setMyPosts(myPosts.filter((p) => p._id !== id));
      setSuccessMsg('Post removed');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting');
    }
  };

  if (!user) {
    return <LoadingSpinner text="Loading profile details..." />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Success Notification */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Card Banner */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <img
                src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 uppercase tracking-wide">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email}</span>
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 pt-1">
                <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                  Branch: {user.branch}
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                  Year: {user.year}
                </span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                  Sec: {user.section}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:text-brand-600 font-semibold text-xs text-slate-700 transition shadow-xs shrink-0"
          >
            <Edit3 className="w-4 h-4 text-brand-600" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Bio & Interests */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              About / Bio
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {user.bio || 'No bio added yet.'}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Academic & Tech Interests
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {user.interests && user.interests.length > 0 ? (
                user.interests.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-lg"
                  >
                    <Tag className="w-3 h-3 text-brand-500" />
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No interests listed</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Activity Tabs Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${
              activeTab === 'resources'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Uploaded Resources ({myResources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lostFound')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${
              activeTab === 'lostFound'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>My Lost & Found Listings ({myLostFound.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition ${
              activeTab === 'posts'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>My Community Posts ({myPosts.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        {loadingData ? (
          <LoadingSpinner text="Loading your campus activity..." />
        ) : (
          <div>
            {activeTab === 'resources' && (
              myResources.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No resources uploaded"
                  description="You have not contributed any notes or study materials yet."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myResources.map((res) => (
                    <ResourceCard
                      key={res._id}
                      resource={res}
                      onDelete={handleDeleteResource}
                    />
                  ))}
                </div>
              )
            )}

            {activeTab === 'lostFound' && (
              myLostFound.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="No lost & found listings"
                  description="You haven't reported any lost or found items."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myLostFound.map((item) => (
                    <LostFoundCard
                      key={item._id}
                      item={item}
                      onToggleStatus={handleToggleLostFound}
                      onDelete={handleDeleteLostFound}
                    />
                  ))}
                </div>
              )
            )}

            {activeTab === 'posts' && (
              myPosts.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No posts published"
                  description="You haven't posted any queries or discussion threads to the feed."
                />
              ) : (
                <div className="space-y-4 max-w-2xl">
                  {myPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onLike={() => {}}
                      onComment={() => {}}
                      onDelete={handleDeletePost}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student Profile"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {editError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {editError}
            </div>
          )}

          {/* Avatar Upload */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <img
              src={avatarPreview || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt="Avatar"
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/30"
            />
            <div className="space-y-1">
              <input
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                onChange={handleAvatarFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-700 transition"
              >
                <Upload className="w-3.5 h-3.5 text-brand-600" />
                <span>Upload Avatar from PC</span>
              </button>
              <p className="text-[10px] text-slate-400">JPG or PNG (max 5MB)</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              name="name"
              value={profileForm.name}
              onChange={handleEditChange}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Branch
              </label>
              <select
                name="branch"
                value={profileForm.branch}
                onChange={handleEditChange}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                Year
              </label>
              <select
                name="year"
                value={profileForm.year}
                onChange={handleEditChange}
                className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Section
              </label>
              <input
                type="text"
                name="section"
                value={profileForm.section}
                onChange={handleEditChange}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium uppercase text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Interests (comma separated)
            </label>
            <input
              type="text"
              name="interests"
              value={profileForm.interests}
              onChange={handleEditChange}
              placeholder="e.g., React, AI/ML, Cloud, Algorithms"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bio / About Me
            </label>
            <textarea
              rows={3}
              name="bio"
              value={profileForm.bio}
              onChange={handleEditChange}
              placeholder="Tell your college peers about yourself..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingProfile}
              className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm transition disabled:opacity-50"
            >
              {submittingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
