import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import API from '../services/api';
import { 
  BookOpen, 
  Search, 
  Users, 
  Bell, 
  ArrowRight, 
  Calendar, 
  Heart, 
  MessageCircle,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentResources, setRecentResources] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [updatesRes, postsRes, resourcesRes] = await Promise.all([
          API.get('/updates'),
          API.get('/posts'),
          API.get('/resources'),
        ]);

        setRecentUpdates(updatesRes.data.data?.slice(0, 4) || []);
        setRecentPosts(postsRes.data.data?.slice(0, 3) || []);
        setRecentResources(resourcesRes.data.data?.slice(0, 4) || []);
      } catch (err) {
        console.error('Error fetching dashboard widgets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickCards = [
    {
      title: 'Campus Library',
      description: 'Notes, PYQs, Lab Files & Subject Syllabus',
      path: '/library',
      icon: BookOpen,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      badge: 'Academic Hub',
    },
    {
      title: 'Lost & Found',
      description: 'Report or recover misplaced campus items',
      path: '/lost-found',
      icon: Search,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      badge: 'Campus Utility',
    },
    {
      title: 'Community Feed',
      description: 'Student discussions, hackathon teams & queries',
      path: '/community',
      icon: Users,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      badge: 'Social Feed',
    },
    {
      title: 'Campus Updates',
      description: 'Official department notices, exams & events',
      path: '/updates',
      icon: Bell,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      badge: 'Notices',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-brand-600/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Campus Connect • CSE Department</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user ? user.name.split(' ')[0] : 'Student'} 👋
            </h1>
            <p className="text-brand-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Stay synchronized with today's lectures, examination timetables, lost belongings, and peer study groups.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <Link
                to="/admin/updates"
                className="px-4 py-2.5 bg-white text-indigo-700 text-xs font-bold rounded-xl hover:bg-brand-50 transition shadow-sm flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            ) : (
              <Link
                to="/library"
                className="px-4 py-2.5 bg-white text-brand-700 text-xs font-bold rounded-xl hover:bg-brand-50 transition shadow-sm flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse Notes</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Quick Action Shortcuts for Teacher Presentation & Student Workflow */}
      <section className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm text-xs font-bold text-slate-800 transition whitespace-nowrap"
        >
          <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-sm">+</span>
          <span>Share a Community Post</span>
        </Link>

        <Link
          to="/library"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm text-xs font-bold text-slate-800 transition whitespace-nowrap"
        >
          <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-sm">+</span>
          <span>Upload Study Notes / PYQ</span>
        </Link>

        <Link
          to="/lost-found"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-sm text-xs font-bold text-slate-800 transition whitespace-nowrap"
        >
          <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-extrabold text-sm">+</span>
          <span>Report Lost / Found Item</span>
        </Link>

        {isAdmin && (
          <Link
            to="/admin/updates"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-sm text-xs font-bold text-slate-800 transition whitespace-nowrap"
          >
            <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-extrabold text-sm">+</span>
            <span>Publish Department Circular</span>
          </Link>
        )}
      </section>

      {/* Quick Access Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Quick Access</h2>
          <span className="text-xs text-slate-400">Core student modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.path}
                className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl ${card.bgColor} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {card.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center text-xs font-semibold text-brand-600 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Dashboard Content Grid: Latest Updates + Community Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Latest Official Updates & Study Material */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Latest Campus Notices & Events */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Latest Campus Updates</h3>
                  <p className="text-[11px] text-slate-400">Department notices & event alerts</p>
                </div>
              </div>
              <Link
                to="/updates"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading updates..." />
            ) : recentUpdates.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">No recent updates</p>
            ) : (
              <div className="space-y-3">
                {recentUpdates.map((item) => (
                  <div
                    key={item._id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 leading-snug">
                        {item.title}
                      </h4>
                    </div>

                    <Link
                      to="/updates"
                      className="text-xs font-semibold text-brand-600 hover:underline shrink-0"
                    >
                      Read details →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Resources */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Recently Shared Notes & PYQs</h3>
                  <p className="text-[11px] text-slate-400">Fresh materials uploaded by classmates</p>
                </div>
              </div>
              <Link
                to="/library"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>View library</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading study materials..." />
            ) : recentResources.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">No materials uploaded yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentResources.map((resItem) => (
                  <div
                    key={resItem._id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-slate-50/50 transition space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          {resItem.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {resItem.semester}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 line-clamp-2 leading-snug">
                        {resItem.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">
                        {resItem.subject}
                      </p>
                    </div>

                    <a
                      href={resItem.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-brand-600 hover:underline inline-flex items-center gap-1 pt-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Download Resource</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Col: Recent Community Discussions */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Community Feed</h3>
                  <p className="text-[11px] text-slate-400">Campus discussions</p>
                </div>
              </div>
              <Link
                to="/community"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Feed</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading feed..." />
            ) : recentPosts.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">No recent community posts</p>
            ) : (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div
                    key={post._id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt={post.author?.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="truncate">
                        <span className="font-bold text-xs text-slate-800 truncate block">
                          {post.author?.name}
                        </span>
                      </div>
                      <span className="text-[10px] ml-auto font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {post.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                        {post.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-slate-400" />
                        {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* College Quick Contact Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-5 text-white space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-brand-300">
              Department Helpline
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Facing any academic issue or need emergency security assistance? Contact the department desk at <span className="text-white font-semibold">cse-desk@college.edu</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
