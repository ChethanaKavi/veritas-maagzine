import { useState, useEffect } from "react";
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
          const [articlesRes, magazinesRes] = await Promise.all([
            fetch(`/api/articles`),
            fetch(`/api/magazines`),
          ]);
        if (articlesRes.ok) setArticles(await articlesRes.json());
        if (magazinesRes.ok) setMagazines(await magazinesRes.json());
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
    { label: "Total Magazines", value: magazines.length.toLocaleString(), icon: BookOpen, color: "text-green-600", bgColor: "bg-green-100" },
    { label: "Total Article Views", value: totalArticleViews.toLocaleString(), icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-100" },
    { label: "Total Articles", value: articles.length.toLocaleString(), icon: FileText, color: "text-indigo-600", bgColor: "bg-indigo-100" },
  ];

  // Top articles by viewCount for bar chart
  const topArticlesChartData = [...articles]
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
          .map((a) => ({ id: a.id, title: a.title, meta: a.magazine?.title || "—", views: a.viewCount || 0 }))
      : [...magazines]
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .map((m) => ({
            id: m.id,
            title: m.title,
            meta: m.publishedAt
              ? new Date(m.publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "—",
            views: m.viewCount || 0,
          }));

  const totalPages = Math.ceil(tableData.length / perPage);
  const pagedData = tableData.slice((page - 1) * perPage, page * perPage);

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Analytics</h1>
        <p className="text-gray-600 mb-8">Track your website performance and user engagement</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-lg p-6 border-2 border-blue-200">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} rounded-lg p-3`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                {loading ? (
                  <div className="h-9 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                ) : (
                  <p className="text-3xl font-bold text-blue-900 mb-1">{stat.value}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Articles by Views */}
          <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Top Articles by Views</h2>
            {loading ? (
              <div className="flex items-center justify-center h-[300px] text-gray-400">Loading...</div>
            ) : topArticlesChartData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-400">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topArticlesChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
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
            {loading ? (
              <div className="flex items-center justify-center h-[300px] text-gray-400">Loading...</div>
            ) : magazineChartData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-400">No articles for this magazine yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={magazineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Views Table */}
        <div className="bg-white rounded-lg border-2 border-blue-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-900">Views Breakdown</h2>
            <select
              className="border rounded px-3 py-1 text-sm"
              value={viewMode}
              onChange={(e) => { setViewMode(e.target.value as any); setPage(1); }}
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
                  <th className="px-4 py-3 text-sm font-semibold text-blue-900">{viewMode === "articles" ? "Magazine" : "Published"}</th>
                  <th className="px-4 py-3 text-sm font-semibold text-blue-900">Views</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="px-4 py-10 text-center text-gray-400">Loading...</td></tr>
                ) : (
                  <>
                    {pagedData.map((item) => (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-blue-50">
                        <td className="px-4 py-3 font-semibold text-blue-900">{item.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.meta}</td>
                        <td className="px-4 py-3 font-semibold text-blue-600">{item.views.toLocaleString()}</td>
                      </tr>
                    ))}
                    {pagedData.length === 0 && (
                      <tr><td colSpan={3} className="px-4 py-10 text-center text-gray-400">No data available yet</td></tr>
                    )}
                  </>
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

        {/* Google Analytics Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-900">Google Analytics Integration</h2>
            <a
              href={GA_DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open Google Analytics
            </a>
          </div>
          <div className="space-y-3">
            <p className="text-gray-700">
              <strong>Status:</strong>{" "}
              <span className="text-green-600 font-semibold">✓ Active</span> — tracking is enabled on all pages
            </p>
            <p className="text-gray-700">
              <strong>Measurement ID:</strong>{" "}
              <code className="bg-white px-2 py-1 rounded text-sm border border-blue-200">{GA_MEASUREMENT_ID}</code>
            </p>
            <p className="text-gray-700">
              <strong>Account:</strong> analytics.veritasinnovations@gmail.com
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
