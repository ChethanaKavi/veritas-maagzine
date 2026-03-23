import { AdminLayout } from "../../components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/api";
import {
  BookOpen,
  FileText,
  Eye,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

export function AdminDashboard() {
  const [stats, setStats] = useState<any>({});
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [recentMagazines, setRecentMagazines] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await apiClient.get("/dashboard-stats");
        setStats({
          totalMagazines: data.totalMagazines,
          totalArticles: data.totalArticles,
          totalViews: data.totalViews,
          activeReaders: data.activeReaders,
        });
        setRecentArticles(data.recentArticles);
        setRecentMagazines(data.recentMagazines);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error.response?.data?.error || error.message);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      label: "Total Magazines",
      value: stats.totalMagazines,
      icon: BookOpen,
      color: "bg-blue-500",
      change: "+2 this month",
    },
    {
      label: "Total Articles",
      value: stats.totalArticles,
      icon: FileText,
      color: "bg-green-500",
      change: "+6 this month",
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "bg-purple-500",
      change: "+12.5% vs last month",
    },
    {
      label: "Active Readers",
      value: "8,429", // Mock data
      icon: Users,
      color: "bg-orange-500",
      change: "+8.2% vs last month",
    },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back! Here's your overview</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg p-6 border-2 border-blue-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-blue-900 mb-1">
                    {stat.value ?? "0"}
                  </p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Articles */}
          <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              Recent Articles
            </h2>
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0"
                >
                  {article.coverImgUrl ? (
                    <img
                      src={article.coverImgUrl}
                      alt={article.title}
                      className="w-20 h-20 rounded-lg object-cover border-2 border-blue-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg border-2 border-blue-100 bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-8 h-8 text-blue-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-blue-900 mb-1 line-clamp-2 break-words truncate">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {article.magazine?.title || '—'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Magazines */}
          <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              Recent Magazines
            </h2>
            <div className="space-y-4">
              {recentMagazines.map((magazine) => (
                <div
                  key={magazine.id}
                  className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0"
                >
                  {magazine.coverImage ? (
                    <img
                      src={magazine.coverImage}
                      alt={magazine.title}
                      className="w-16 h-24 rounded-lg object-cover border-2 border-blue-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-24 rounded-lg border-2 border-blue-100 bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-blue-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-blue-900 mb-1 line-clamp-2 break-words truncate">
                      {magazine.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {magazine.publishedAt ? new Date(magazine.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(magazine.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
          <div className="mt-8 bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/admin/magazines?add=true")}
                className="rounded-lg p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-white rounded-lg p-4 h-28 flex flex-col justify-end">
                  <BookOpen className="w-4 h-4 text-blue-900 mb-2" />
                  <p className="font-semibold text-blue-900 text-base">Add New Magazine</p>
                  <p className="text-sm text-gray-500 mt-1">Create a new issue</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/admin/articles?add=true")}
                className="rounded-lg p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-white rounded-lg p-4 h-28 flex flex-col justify-end">
                  <FileText className="w-5 h-5 text-blue-900 mb-2" />
                  <p className="font-semibold text-blue-900 text-base">Add New Article</p>
                  <p className="text-sm text-gray-500 mt-1">Write new content</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/admin/advertisements?add=true")}
                className="rounded-lg p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-white rounded-lg p-4 h-28 flex flex-col justify-end">
                  <TrendingUp className="w-5 h-5 text-blue-900 mb-2" />
                  <p className="font-semibold text-blue-900 text-base">Add New Ad</p>
                  <p className="text-sm text-gray-500 mt-1">Create a new advertisement</p>
                </div>
              </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
