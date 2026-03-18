import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Search, X, Upload, RotateCw } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { articles as mockArticles, magazines as mockMagazines } from "../../data/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export function AdminArticles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [articleList, setArticleList] = useState<any[]>([]);
  const [magazineList, setMagazineList] = useState<any[]>([]);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    coverImgUrl: "",
    magazineId: "",
    authorId: "",
    publishedAt: "",
  });
  const [articleErrors, setArticleErrors] = useState<{ [k: string]: string }>({});
  const [viewArticle, setViewArticle] = useState<any | null>(null);
  const [confirmDeleteArticle, setConfirmDeleteArticle] = useState<any | null>(null);
  const [confirmActivateArticle, setConfirmActivateArticle] = useState<any | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Load articles and magazines from API on mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const [articlesRes, magazinesRes] = await Promise.all([
          fetch(`${API_BASE}/articles`),
          fetch(`${API_BASE}/magazines`)
        ]);
        if (articlesRes.ok) {
          const data = await articlesRes.json();
          setArticleList(Array.isArray(data) ? data : []);
        }
        if (magazinesRes.ok) {
          const data = await magazinesRes.json();
          setMagazineList(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to fetch articles/magazines', err);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("add") === "true") {
      setIsAdding(true);
      setEditingId(null);
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, navigate]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [k: string]: string } = {};
    if (!newArticle.title.trim()) errors.title = 'Title is required';
    const textContent = newArticle.content.replace(/<[^>]*>/g, '').trim();
    if (!textContent) errors.content = 'Content is required';
    if (!newArticle.coverImgUrl.trim()) errors.coverImgUrl = 'Cover image is required';
    if (!newArticle.magazineId) errors.magazineId = 'Magazine selection is required';
    if (!newArticle.publishedAt) errors.publishedAt = 'Publish date is required';
    setArticleErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    const payload = {
      ...newArticle,
      publishedAt: newArticle.publishedAt
        ? new Date(newArticle.publishedAt).toISOString()
        : null,
    };
    
    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/articles/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/articles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      
      if (res.ok) {
        const saved = await res.json();
        if (editingId) {
          setArticleList((prev) => prev.map((a) => (a.articleId === editingId ? saved : a)));
        } else {
          setArticleList((prev) => [saved, ...prev]);
        }
        setIsAdding(false);
        setEditingId(null);
        setNewArticle({ title: "", content: "", coverImgUrl: "", magazineId: "", authorId: "", publishedAt: "" });
      } else {
        console.error('Failed to save article');
      }
    } catch (err) {
      console.error('Failed to save article', err);
    }
  };

  const handleViewClick = (article: any) => {
    setViewArticle(article);
  };

  const handleEditClick = (article: any) => {
    setIsAdding(true);
    setEditingId(article.articleId);
    setNewArticle({
      title: article.title,
      content: article.content,
      coverImgUrl: article.coverImgUrl || "",
      magazineId: article.magazineId || "",
      authorId: article.authorId || "",
      publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (article: any) => {
    setConfirmDeleteArticle(article);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteArticle) return;
    try {
      const res = await fetch(`${API_BASE}/articles/${confirmDeleteArticle.articleId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setArticleList((prev) =>
          prev.map((a) =>
            a.articleId === confirmDeleteArticle.articleId ? { ...a, active: false } : a
          )
        );
      }
    } catch (e) {
      console.error('Failed to deactivate', e);
    }
    setConfirmDeleteArticle(null);
  };

  const handleActivateClick = (article: any) => {
    setConfirmActivateArticle(article);
  };

  const confirmActivate = async () => {
    if (!confirmActivateArticle) return;
    try {
      const res = await fetch(`${API_BASE}/articles/${confirmActivateArticle.articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: true }),
      });
      if (res.ok) {
        const updated = await res.json();
        setArticleList((prev) => prev.map((a) => (a.articleId === confirmActivateArticle.articleId ? updated : a)));
      }
    } catch (e) {
      console.error('Failed to activate', e);
    }
    setConfirmActivateArticle(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setNewArticle({ ...newArticle, coverImgUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredArticles = articleList.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Articles</h1>
            <p className="text-gray-600">Manage all articles</p>
          </div>
          {!isAdding && (
            <button
              onClick={() => {
                setIsAdding(true);
                setEditingId(null);
                setNewArticle({
                  title: "",
                  content: "",
                  coverImgUrl: "",
                  magazineId: magazineList[0]?.id || "",
                  authorId: "",
                  publishedAt: "",
                });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Article
            </button>
          )}
        </div>

        {isAdding ? (
          <div className="bg-white rounded-lg border-2 border-blue-200 p-8 max-w-2xl mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-900">{editingId ? "Edit Article" : "Add New Article"}</h2>
              <Button variant="ghost" size="icon" onClick={() => { setIsAdding(false); setEditingId(null); setNewArticle({ title: "", content: "", coverImgUrl: "", magazineId: "", authorId: "", publishedAt: "" }); }}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Article Title</label>
                <Input
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="e.g. The Future of Sustainable Design"
                />
                {articleErrors.title && <div className="text-red-600 text-sm mt-1">{articleErrors.title}</div>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Content</label>
                <ReactQuill
                  value={newArticle.content}
                  onChange={(html) => setNewArticle({ ...newArticle, content: html })}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      ['blockquote', 'code-block'],
                      ['link', 'image'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['clean']
                    ]
                  }}
                  theme="snow"
                  style={{ height: '300px', marginBottom: '50px' }}
                />
                {articleErrors.content && <div className="text-red-600 text-sm mt-1">{articleErrors.content}</div>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Select Magazine</label>
                  <Select
                    value={newArticle.magazineId}
                    onValueChange={(val) => setNewArticle({ ...newArticle, magazineId: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Magazine" />
                    </SelectTrigger>
                    <SelectContent>
                      {magazineList.map((mag) => (
                        <SelectItem key={mag.id} value={mag.id}>
                          {mag.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {articleErrors.magazineId && <div className="text-red-600 text-sm mt-1">{articleErrors.magazineId}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Publish Date</label>
                  <Input
                    type="date"
                    value={newArticle.publishedAt}
                    onChange={(e) => setNewArticle({ ...newArticle, publishedAt: e.target.value })}
                  />
                  {articleErrors.publishedAt && <div className="text-red-600 text-sm mt-1">{articleErrors.publishedAt}</div>}
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Cover Image</label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={newArticle.coverImgUrl}
                        onChange={(e) => setNewArticle({ ...newArticle, coverImgUrl: e.target.value })}
                        placeholder="Paste Image URL..."
                      />
                      {articleErrors.coverImgUrl && <div className="text-red-600 text-sm mt-1">{articleErrors.coverImgUrl}</div>}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">OR</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('cover-upload')?.click()}
                          className="text-xs"
                        >
                          Browse from Device
                        </Button>
                        <input
                          id="cover-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                    {newArticle.coverImgUrl && (
                      <div className="relative w-24 aspect-[3/4] rounded-lg overflow-hidden border-2 border-blue-100 bg-gray-50 flex-shrink-0">
                        <img src={newArticle.coverImgUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewArticle({ ...newArticle, coverImgUrl: "" })}
                          className="absolute top-1 right-1 p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                        >
                          <X className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-900 hover:bg-blue-800"
                  disabled={!(newArticle.title.trim() && (newArticle.content.replace(/<[^>]*>/g, '').trim()) && newArticle.coverImgUrl.trim() && newArticle.magazineId && newArticle.publishedAt)}
                >
                  {editingId ? "Update Article" : "Publish Article"}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsAdding(false); setEditingId(null); setNewArticle({ title: "", content: "", coverImgUrl: "", magazineId: "", authorId: "", publishedAt: "" }); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Search and table container */}
            <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <table className="w-full">
                <thead className="bg-blue-50 border-b-2 border-blue-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Cover</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Magazine</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Publish Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Views</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Active</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Published</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-blue-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredArticles.map((article, index) => (
                    <tr key={article.articleId || `art-${index}`} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        {article.coverImgUrl && (
                          <img
                            src={article.coverImgUrl}
                            alt={article.title}
                            className="w-12 h-16 object-cover rounded border-2 border-blue-100"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-blue-900">{article.title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {magazineList.find(m => m.cmmuanId === article.magazineId)?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{typeof article.viewCount === 'number' ? article.viewCount : 0}</td>
                      <td className="px-6 py-4">
                        {article.active === false ? (
                          <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">Inactive</span>
                        ) : (
                          <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {(article.publishedAt && new Date(article.publishedAt) <= new Date()) ? (
                          <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Yes</span>
                        ) : (
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleViewClick(article)} className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button onClick={() => handleEditClick(article)} className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          {article.active === false ? (
                            <button onClick={() => handleActivateClick(article)} title="Activate" className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                              <RotateCw className="w-4 h-4 text-green-600" />
                            </button>
                          ) : (
                            <button onClick={() => handleDeleteClick(article)} className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
              {/* View Dialog */}
              <Dialog open={!!viewArticle} onOpenChange={() => setViewArticle(null)}>
                {viewArticle && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{viewArticle.title}</DialogTitle>
                      <DialogDescription>{viewArticle.publishedAt ? new Date(viewArticle.publishedAt).toLocaleDateString() : ''}</DialogDescription>
                    </DialogHeader>
                    <div className="pt-4">
                      {viewArticle.coverImgUrl && (
                        <img src={viewArticle.coverImgUrl} alt={viewArticle.title} className="w-full h-48 object-cover rounded" />
                      )}
                      <div className="mt-4 text-sm text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: viewArticle.content }} />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setViewArticle(null)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>

              {/* Confirm Delete Dialog */}
              <Dialog open={!!confirmDeleteArticle} onOpenChange={() => setConfirmDeleteArticle(null)}>
                {confirmDeleteArticle && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deactivate Article</DialogTitle>
                      <DialogDescription>Are you sure you want to deactivate "{confirmDeleteArticle.title}"? This will hide it from active lists.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setConfirmDeleteArticle(null)}>Cancel</Button>
                      <Button className="bg-red-600 text-white" onClick={confirmDelete}>Deactivate</Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>

              {/* Confirm Publish Dialog */}
              <Dialog open={!!confirmActivateArticle} onOpenChange={() => setConfirmActivateArticle(null)}>
                {confirmActivateArticle && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Activate Article</DialogTitle>
                      <DialogDescription>Do you want to activate "{confirmActivateArticle.title}"?</DialogDescription>
                    </DialogHeader>
                    <div className="pt-2">
                      <label className="text-sm text-gray-700">Status</label>
                      <select defaultValue="active" className="w-full mt-2 border rounded px-3 py-2">
                        <option value="active">Activate</option>
                      </select>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setConfirmActivateArticle(null)}>Cancel</Button>
                      <Button className="bg-green-600 text-white" onClick={confirmActivate}>Activate</Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
      </div>
    </AdminLayout>
  );
}
