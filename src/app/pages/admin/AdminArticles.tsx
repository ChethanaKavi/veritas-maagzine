import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Search, X, Upload, RotateCw } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAdminData } from "../../contexts/AdminDataContext";
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

export function AdminArticles() {
  const { articles: articleList, magazines: magazineList, updateArticle, addArticle, deleteArticle } = useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
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
  const [uploadProgress, setUploadProgress] = useState<{ [k: string]: number }>({});
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploadErrors, setUploadErrors] = useState<{ [k: string]: string }>({});

  const location = useLocation();
  const navigate = useNavigate();

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

    // Prevent saving while any uploads are still in progress
    const pending = Object.values(uploadProgress).some((v) => typeof v === 'number' && v < 100);
    if (pending) {
      setArticleErrors((prev) => ({ ...prev, general: 'Please wait for uploads to finish before saving.' }));
      return;
    }
    
    const payload = {
      ...newArticle,
      publishedAt: newArticle.publishedAt
        ? new Date(newArticle.publishedAt).toISOString()
        : null,
    };
    
    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/articles/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/articles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      
      if (res.ok) {
        const saved = await res.json();
        if (editingId) {
          updateArticle(editingId, saved);
        } else {
          addArticle(saved);
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
    setEditingId(article.id);
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
      const res = await fetch(`/api/articles/${confirmDeleteArticle.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        deleteArticle(confirmDeleteArticle.id);
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
      const res = await fetch(`/api/articles/${confirmActivateArticle.id}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: true }),
      });
      if (res.ok) {
        const updated = await res.json();
        updateArticle(confirmActivateArticle.id, updated);
      }
    } catch (e) {
      console.error('Failed to activate', e);
    }
    setConfirmActivateArticle(null);
  };

  const uploadFileXHR = (file: File, onProgress: (p: number) => void) => {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      fd.append('file', file);
      xhr.open('POST', '/api/uploads');
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress(pct);
        }
      };
      xhr.onload = () => {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            console.debug(`Upload successful for ${file.name}:`, data);
            resolve(data);
          } else {
            const errMsg = xhr.responseText ? JSON.parse(xhr.responseText).error : `Upload failed with status ${xhr.status}`;
            console.error(`Upload failed for ${file.name}:`, errMsg);
            reject(new Error(errMsg));
          }
        } catch (err) {
          console.error('Parse error in upload response:', err);
          reject(err);
        }
      };
      xhr.onerror = () => {
        const msg = 'Network error during upload';
        console.error(msg, file.name);
        reject(new Error(msg));
      };
      xhr.send(fd);
    });
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setUploadErrors({}); // clear previous errors
    
    for (const file of files) {
      setUploadProgress((p) => ({ ...p, [file.name]: 0 }));
      try {
        console.debug(`Starting upload for ${file.name}...`);
        const res = await uploadFileXHR(file, (pct) => {
          setUploadProgress((p) => ({ ...p, [file.name]: pct }));
          console.debug(`Upload progress for ${file.name}: ${pct}%`);
        });
        setUploadedFiles((prev) => [...prev, { name: file.name, url: res.secure_url, public_id: res.public_id }]);
        // set first uploaded as cover image
        setNewArticle((prev) => ({ ...prev, coverImgUrl: res.secure_url }));
        // clear progress after complete
        setUploadProgress((p) => {
          const newP = { ...p };
          delete newP[file.name];
          return newP;
        });
      } catch (err: any) {
        const errMsg = err?.message || 'Unknown error';
        console.error(`Upload failed for ${file.name}:`, errMsg);
        setUploadErrors((prev) => ({ ...prev, [file.name]: errMsg }));
        setUploadProgress((p) => {
          const newP = { ...p };
          delete newP[file.name];
          return newP;
        });
      }
    }
    // clear the input
    (e.target as HTMLInputElement).value = '';
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
                          accept="image/*,video/*"
                          multiple
                          className="hidden"
                          onChange={handleFilesSelected}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {uploadedFiles.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {uploadedFiles.map((f) => (
                            <div key={f.public_id} className="w-20">
                              <img src={f.url} alt={f.name} className="w-20 h-24 object-cover rounded border-2 border-blue-100" />
                              <div className="flex gap-1 mt-1">
                                <button type="button" className="text-xs px-2 py-1 border rounded" onClick={() => setNewArticle((p) => ({ ...p, coverImgUrl: f.url }))}>Use</button>
                                <button type="button" className="text-xs px-2 py-1 border rounded" onClick={() => setUploadedFiles((prev) => prev.filter((x) => x.public_id !== f.public_id))}>Remove</button>
                              </div>
                              {uploadProgress[f.name] != null && (
                                <div className="w-full bg-gray-200 rounded h-2 mt-1">
                                  <div className="bg-blue-600 h-2 rounded" style={{ width: `${uploadProgress[f.name]}%` }} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Upload Status & Errors */}
                    {Object.keys(uploadProgress).length > 0 && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-sm text-yellow-700">
                        ⏳ Uploading {Object.keys(uploadProgress).length} file(s)... Please wait before saving.
                      </div>
                    )}
                    {Object.keys(uploadErrors).length > 0 && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded text-sm text-red-700">
                        <p className="font-semibold">Upload Errors:</p>
                        <ul className="mt-1">
                          {Object.entries(uploadErrors).map(([file, err]) => (
                            <li key={file}>• {file}: {err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-900 hover:bg-blue-800"
                  disabled={
                    !(newArticle.title.trim() && (newArticle.content.replace(/<[^>]*>/g, '').trim()) && newArticle.coverImgUrl.trim() && newArticle.magazineId && newArticle.publishedAt) ||
                    Object.keys(uploadProgress).length > 0
                  }
                  title={Object.keys(uploadProgress).length > 0 ? 'Please wait for uploads to complete' : ''}
                >
                  {Object.keys(uploadProgress).length > 0 ? 'Uploading...' : (editingId ? "Update Article" : "Publish Article")}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsAdding(false); setEditingId(null); setNewArticle({ title: "", content: "", coverImgUrl: "", magazineId: "", authorId: "", publishedAt: "" }); setUploadProgress({}); setUploadedFiles([]); setUploadErrors({}); }}>
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

              <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-blue-50 border-b-2 border-blue-200">
                  <tr>
                    <th className="w-16 px-4 py-4 text-left text-sm font-semibold text-blue-900">Cover</th>
                    <th className="max-w-[48ch] px-6 py-4 text-left text-sm font-semibold text-blue-900">Title</th>
                    <th className="max-w-[24ch] px-6 py-4 text-left text-sm font-semibold text-blue-900">Magazine</th>
                    <th className="w-36 px-6 py-4 text-left text-sm font-semibold text-blue-900">Publish Date</th>
                    <th className="w-20 px-6 py-4 text-center text-sm font-semibold text-blue-900">Views</th>
                    <th className="w-24 px-6 py-4 text-center text-sm font-semibold text-blue-900">Active</th>
                    <th className="w-24 px-6 py-4 text-center text-sm font-semibold text-blue-900">Published</th>
                    <th className="w-36 px-6 py-4 text-right text-sm font-semibold text-blue-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredArticles.map((article, index) => (
                    <tr key={article.id || `art-${index}`} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-4">
                        {article.coverImgUrl && (
                          <img
                            src={article.coverImgUrl}
                            alt={article.title}
                            className="w-12 h-16 object-cover rounded border-2 border-blue-100"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-blue-900 whitespace-normal break-words line-clamp-2 max-w-[48ch]">{article.title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[24ch]">
                        {article.magazine?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">{typeof article.viewCount === 'number' ? article.viewCount : 0}</td>
                      <td className="px-6 py-4 text-center">
                        {article.active === false ? (
                          <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">Inactive</span>
                        ) : (
                          <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
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
