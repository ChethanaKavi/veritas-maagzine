import React, { useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Eye, Users } from "lucide-react";
import { articles as mockArticles, magazines as mockMagazines } from "../../data/mockData";

export function AdminAnalytics() {
  // Mock analytics data
  const pageViewsData = [
    { name: "Mon", views: 2400 },
    { name: "Tue", views: 1398 },
    { name: "Wed", views: 9800 },
    { name: "Thu", views: 3908 },
    { name: "Fri", views: 4800 },
    { name: "Sat", views: 3800 },
    { name: "Sun", views: 4300 },
  ];

  const readersData = [
    { name: "Jan", readers: 4000 },
    { name: "Feb", readers: 3000 },
    { name: "Mar", readers: 5000 },
    { name: "Apr", readers: 2780 },
    { name: "May", readers: 1890 },
    { name: "Jun", readers: 2390 },
  ];

  const topArticles = [
    { title: "The Future of AI in Business", views: 12453, author: "Sarah Johnson" },
    { title: "Sustainable Fashion Trends 2026", views: 10234, author: "Emma Davis" },
    { title: "Hidden Gems of Southeast Asia", views: 8932, author: "James Wilson" },
    { title: "Mastering French Cuisine", views: 7654, author: "Michael Chen" },
    { title: "The Rise of Remote Work", views: 6543, author: "Emily Brown" },
  ];

  // Generate mock per-article views and daily series for charts
  const mockArticleViews = topArticles.map((a, i) => ({
    id: `t${i}`,
    title: a.title,
    views: a.views,
    daily: [Math.max(10, Math.floor(a.views * 0.08)), Math.max(10, Math.floor(a.views * 0.12)), Math.max(10, Math.floor(a.views * 0.15)), Math.max(10, Math.floor(a.views * 0.25)), Math.max(10, Math.floor(a.views * 0.4))],
  }));

  const COLORS: string[] = ["#1e3a8a", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"];

  // Aggregate basic metrics from mock data
  const totalPageViews = pageViewsData.reduce((s, d) => s + d.views, 0).toLocaleString();
  const totalArticleViews = topArticles.reduce((s, a) => s + a.views, 0).toLocaleString();
  const totalMagazineViews = Math.floor(topArticles.reduce((s, a) => s + a.views, 0) * 0.9).toLocaleString(); // mock
  const avgTimeOnPage = "4m 32s";

  const stats = [
    { label: "Total Page Views", value: totalPageViews, icon: Eye, color: "text-blue-600", bgColor: "bg-blue-100", change: "+12.5%" },
    { label: "Total Magazine Views", value: totalMagazineViews, icon: Users, color: "text-green-600", bgColor: "bg-green-100", change: "+8.2%" },
    { label: "Total Article Views", value: totalArticleViews, icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-100", change: "+5.1%" },
    { label: "Avg. Time on Page", value: avgTimeOnPage, icon: TrendingUp, color: "text-indigo-600", bgColor: "bg-indigo-100", change: "+0.0%" },
  ];

  // Prepare lists for tables and charts using real mock data
  const allArticles = mockArticles.map((a, idx) => ({ id: a.id, title: a.title, views: Math.max(100, Math.floor((new Date(a.date).getDate() || (idx + 1)) * 1000)), author: a.author, magazineId: a.magazineId, date: a.date }));
  const allMagazines = mockMagazines.map((m) => ({ id: m.id, title: m.title, issue: m.issue }));

  // UI state
  const [viewMode, setViewMode] = useState<'articles' | 'magazines'>('articles');
  const [page, setPage] = useState(1);
  const perPage = 5;
  const [selectedMagazine, setSelectedMagazine] = useState(allMagazines[0]?.id ?? '');
  const [selectedArticle, setSelectedArticle] = useState(allArticles[0]?.id ?? '');

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Aggregate monthly views for selected magazine
  const monthlyData = monthNames.map((m, mi) => {
    const total = allArticles
      .filter((a) => a.magazineId === selectedMagazine && new Date(a.date).getMonth() === mi)
      .reduce((s, a) => s + (a.views || 0), 0);
    return { name: m, views: total };
  });

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Analytics</h1>
        <p className="text-gray-600 mb-8">
          Track your website performance and user engagement
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-lg p-6 border-2 border-blue-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} rounded-lg p-3`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-blue-900 mb-1">
                  {stat.value}
                </p>
                <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} vs last month
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Page Views Chart */}
          <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              Weekly Page Views
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pageViewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#1e3a8a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart: articles in selected magazine */}
          <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-900">Articles by Magazine</h2>
              <div className="ml-4 flex-shrink-0">
                <select className="border rounded px-3 py-1 w-56 max-w-full text-sm truncate" value={selectedMagazine} onChange={(e) => setSelectedMagazine(e.target.value)}>
                {allMagazines.map((m) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* List and Table */}
          <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-900">Views</h2>
              <select className="border rounded px-3 py-1" value={viewMode} onChange={(e) => { setViewMode(e.target.value as any); setPage(1); }}>
                <option value="articles">Articles</option>
                <option value="magazines">Magazines</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-blue-50 border-b-2 border-blue-200">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-blue-900">Title</th>
                    <th className="px-4 py-3 text-sm font-semibold text-blue-900">Meta</th>
                    <th className="px-4 py-3 text-sm font-semibold text-blue-900">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {(viewMode === 'articles' ? allArticles : (() => {
                    const mags = allMagazines.map(m => ({ ...m, views: allArticles.filter(a => a.magazineId === m.id).reduce((s, a) => s + (a.views || 0), 0) }));
                    return mags;
                  })()).slice((page - 1) * perPage, page * perPage).map((item: any) => (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-blue-50">
                      <td className="px-4 py-3 font-semibold text-blue-900">{item.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{viewMode === 'articles' ? (item.author + ' • ' + (mockMagazines.find(mm => mm.id === item.magazineId)?.title || '')) : item.issue}</td>
                      <td className="px-4 py-3 font-semibold text-blue-600">{(item.views || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button className="px-3 py-1 border rounded" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
              <div className="px-3 py-1">Page {page}</div>
              <button className="px-3 py-1 border rounded" onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </div>

          {/* Line chart: article daily views */}
          <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-900">Article Trend</h2>
              <div className="ml-4 flex-shrink-0">
                <select className="border rounded px-3 py-1 w-56 max-w-full text-sm truncate" value={selectedArticle} onChange={(e) => setSelectedArticle(e.target.value)}>
                  {allArticles.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={(() => {
                const idx = allArticles.findIndex(a => a.id === selectedArticle);
                const series = mockArticleViews[Math.max(0, Math.min(mockArticleViews.length - 1, idx))]?.daily || mockArticleViews[0].daily;
                return series.map((v: number, i: number) => ({ name: `Day ${i + 1}`, views: v }));
              })()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#1e3a8a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Google Analytics Info */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            Google Analytics Integration
          </h2>
          <div className="space-y-3">
            <p className="text-gray-700">
              <strong>Status:</strong> Google Analytics tracking is enabled on all pages
            </p>
            <p className="text-gray-700">
              <strong>Measurement ID:</strong> <code className="bg-white px-2 py-1 rounded text-sm border border-blue-200">GA_MEASUREMENT_ID</code>
            </p>
            <p className="text-sm text-gray-600">
              To configure Google Analytics, add your Measurement ID in the analytics utility file located at <code className="bg-white px-2 py-1 rounded text-xs">src/app/utils/analytics.ts</code>
            </p>
            <div className="mt-4 p-4 bg-white rounded border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-2">Tracked Events:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Page views (all routes)</li>
                <li>Article views with article ID and title</li>
                <li>Magazine views with magazine ID and title</li>
                <li>Search queries with result count</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
