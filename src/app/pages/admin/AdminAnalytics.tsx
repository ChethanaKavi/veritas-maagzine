import React, { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Eye, BookOpen, FileText, ExternalLink } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
const GA_MEASUREMENT_ID = "G-JDT8YSE3TM";
const GA_DASHBOARD_URL = "https://analytics.google.com";

export function AdminAnalytics() {
  const [articles, setArticles] = useState<any[]>([]);
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artRes, magRes] = await Promise.all([
          fetch(`${API_BASE}/articles`),
          fetch(`${API_BASE}/magazines`),
        ]);
        if (artRes.ok) setArticles(await artRes.json());
        if (magRes.ok) setMagazines(await magRes.json());
      } catch (e) {
        console.error("Failed to fetch analytics data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Real stats from DB
  const totalArticleViews = articles.reduce((s, a) => s + (a.viewCount || 0), 0);
  const totalMagazineViews = magazines.reduce((s, m) => s + (m.viewCount || 0), 0);
  const totalPageViews = totalArticleViews + totalMagazineViews;

  const stats = [
    { label: "Total Page Views", value: totalPageViews.toLocaleString(), icon: Eye, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "Total Magazine Views", value: totalMagazineViews.toLocaleString(), icon: BookOpen, color: "text-green-600", bgColor: "bg-green-100" },
    { label: "Total Article Views", value: totalArticleViews.toLocaleString(), icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-100" },
    { label: "Total Articles", value: articles.length.toLocaleString(), icon: FileText, color: "text-indigo-600", bgColor: "bg-indigo-100" },
  ];

  // Top 10 articles by view count
  const articleChartData = [...articles]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 10)
    .map((a) => ({
      name: a.title.length > 18 ? a.title.substring(0, 18) + "…" : a.title,
      views: a.viewCount || 0,
    }));

  // Per-magazine article views
  const [selectedMagazineId, setSelectedMagazineId] = useState("");
  useEffect(() => {
    if (magazines.length > 0 && !selectedMagazineId) {
      setSelectedMagazineId(magazines[0].id);
    }
  }, [magazines]);
  const magazineChartData = articles
    .filter((a) => a.magazineId === selectedMagazineId)
    .map((a) => ({
      name: a.title.length > 15 ? a.title.substring(0, 15) + "…" : a.title,
      views: a.viewCount || 0,
    }));

  // Views table
  const [viewMode, setViewMode] = useState<"articles" | "magazines">("articles");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const tableData =
    viewMode === "articles"
      ? [...articles]
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .map((a) => ({ id: a.id, title: a.title, meta: a.authorId || "—", views: a.viewCount || 0 }))
      : [...magazines]
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .map((m) => ({
            id: m.id,
            title: m.title,
            meta: m.publishedAt ? new Date(m.publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—",
            views: m.viewCount || 0,
          }));

  const pagedData = tableData.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(tableData.length / perPage);

  if (loading) {
    return <AdminLayout><div className="p-8 text-gray-500">Loading analytics...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Track your website performance and user engagement</p>
          </div>
          <a
            href={GA_DASHBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold shadow"
          >
            <ExternalLink className="w-5 h-5" />
            Open Google Analytics
          </a>
        </div>

        {/* GA Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-blue-900">
              Google Analytics 4 is active on this website
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Measurement ID:{" "}
              <code className="bg-white border border-blue-100 px-1.5 py-0.5 rounded text-xs font-mono">{GA_MEASUREMENT_ID}</code>
              {"  "}—{"  "}
              Account: <span className="font-medium">analytics.veritasinnovations@gmail.com</span>
            </p>
          </div>
          <a
            href={GA_DASHBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-700 underline flex items-center gap-1 hover:text-blue-900"
          >
            View Full Report <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-lg p-6 border-2 border-blue-200">
                <div className={`${stat.bgColor} rounded-lg p-3 w-fit mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Articles */}
          <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Top Articles by Views</h2>
            {articleChartData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-400">No article view data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={articleChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#1e3a8a" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Articles by Magazine */}
          <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-900">Articles by Magazine</h2>
              <select
                className="border rounded px-3 py-1 text-sm w-48 truncate"
                value={selectedMagazineId}
                onChange={(e) => setSelectedMagazineId(e.target.value)}
              >
                {magazines.map((m) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
            {magazineChartData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-400">No articles for this magazine yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={magazineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Views Table */}
        <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-900">Views</h2>
            <select
              className="border rounded px-3 py-1"
              value={viewMode}
              onChange={(e) => { setViewMode(e.target.value as "articles" | "magazines"); setPage(1); }}
            >
              <option value="articles">Articles</option>
              <option value="magazines">Magazines</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-blue-50 border-b-2 border-blue-200">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-blue-900">Title</th>
                  <th className="px-4 py-3 text-sm font-semibold text-blue-900">{viewMode === "articles" ? "Author" : "Published"}</th>
                  <th className="px-4 py-3 text-sm font-semibold text-blue-900">Views</th>
                </tr>
              </thead>
              <tbody>
                {pagedData.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-blue-50">
                    <td className="px-4 py-3 font-semibold text-blue-900">{item.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.meta}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">{item.views.toLocaleString()}</td>
                  </tr>
                ))}
                {pagedData.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center text-gray-400">No data available yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button className="px-3 py-1 border rounded disabled:opacity-40" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <span className="px-3 py-1 text-sm">Page {page} of {Math.max(1, totalPages)}</span>
            <button className="px-3 py-1 border rounded disabled:opacity-40" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
