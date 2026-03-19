import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Plus, Edit, Trash2, Eye, Search, X, RotateCw } from "lucide-react";
import { magazines as mockMagazines } from "../../data/mockData";
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
import { Textarea } from "../../components/ui/textarea";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export function AdminMagazines() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [magList, setMagList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Load magazines from API on mount
  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        console.log('Fetching magazines from:', `${API_BASE}/magazines`);
        const res = await fetch(`${API_BASE}/magazines`);
        console.log('Response status:', res.status);
        if (res.ok) {
          const data = await res.json();
          console.log('Magazines fetched:', data);
          setMagList(Array.isArray(data) ? data : []);
        } else {
          const errorText = await res.text();
          console.error('Failed to fetch magazines:', res.status, errorText);
        }
      } catch (err) {
        console.error('Failed to fetch magazines', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMagazines();
  }, []);
  const [newMag, setNewMag] = useState({
    title: "",
    description: "",
    coverImage: "",
    publishedAt: "",
  });
  const [magErrors, setMagErrors] = useState<{ [k: string]: string }>({});
  const [viewMag, setViewMag] = useState<any | null>(null);
  const [confirmDeleteMag, setConfirmDeleteMag] = useState<any | null>(null);
  const [confirmActivateMag, setConfirmActivateMag] = useState<any | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("add") === "true") {
      setIsAdding(true);
      setEditingId(null);
      // remove query param to avoid reopening on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.search]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate fields
    const errors: { [k: string]: string } = {};
    if (!newMag.title.trim()) errors.title = 'Title is required';
    if (!newMag.description.trim()) errors.description = 'Description is required';
    if (!newMag.publishedAt) errors.publishedAt = 'Publish date is required';
    setMagErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const payload = {
      ...newMag,
      publishedAt: newMag.publishedAt
        ? new Date(newMag.publishedAt).toISOString()
        : null,
    };
    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/magazines/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/magazines`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (res.ok) {
        const saved = await res.json();
        if (editingId) {
          setMagList((prev) => prev.map((m) => (m.cmmuanId === editingId ? saved : m)));
        } else {
          setMagList((prev) => [saved, ...prev]);
        }
      } else {
        console.error('Failed to save magazine');
      }
    } catch (err) {
      console.error('Failed to save magazine', err);
    }
    setIsAdding(false);
    setEditingId(null);
    setNewMag({ title: "", description: "", coverImage: "", publishedAt: "" });
  };

  const handleViewClick = (mag: any) => {
    setViewMag(mag);
  };

  const handleEditClick = (mag: any) => {
    setIsAdding(true);
    setEditingId(mag.id);
    setNewMag({
      title: mag.title,
      description: mag.description,
      coverImage: mag.coverImage || "",
      publishedAt: mag.publishedAt
        ? new Date(mag.publishedAt).toISOString().split("T")[0]
        : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (mag: any) => {
    setConfirmDeleteMag(mag);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteMag) return;
    try {
      const res = await fetch(`${API_BASE}/magazines/${confirmDeleteMag.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMagList((prev) =>
          prev.map((m) =>
            m.id === confirmDeleteMag.id ? { ...m, isActive: false } : m
          )
        );
      }
    } catch (e) {
      console.error('Failed to deactivate', e);
    }
    setConfirmDeleteMag(null);
  };

  const handleActivateClick = (mag: any) => {
    setConfirmActivateMag(mag);
  };

  const confirmActivate = async () => {
    if (!confirmActivateMag) return;
    try {
      const res = await fetch(`${API_BASE}/magazines/${confirmActivateMag.id}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const updated = await res.json();
        setMagList((prev) => prev.map((m) => (m.id === confirmActivateMag.id ? updated : m)));
      }
    } catch (e) {
      console.error('Failed to activate', e);
    }
    setConfirmActivateMag(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setNewMag({ ...newMag, coverImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredMagazines = magList.filter((magazine) =>
    magazine.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-1">Magazines</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage all magazine issues</p>
          </div>
          {!isAdding && (
            <button
                onClick={() => {
                setIsAdding(true);
                setEditingId(null);
                setNewMag({ title: "", description: "", coverImage: "", publishedAt: "" });
              }}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add New Magazine
            </button>
          )}
        </div>

        {isAdding ? (
          <div className="bg-white rounded-lg border-2 border-blue-200 p-4 sm:p-8 w-full max-w-2xl mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-900">{editingId ? "Edit Magazine" : "Add New Magazine"}</h2>
               <Button variant="ghost" size="icon" onClick={() => { setIsAdding(false); setEditingId(null); setNewMag({ title: "", description: "", coverImage: "", publishedAt: "" }); }}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Magazine Title</label>
                <Input
                  value={newMag.title}
                  onChange={(e) => setNewMag({ ...newMag, title: e.target.value })}
                  placeholder="e.g. Modern Architecture Vol 1"
                />
                {magErrors.title && <div className="text-red-600 text-sm mt-1">{magErrors.title}</div>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <Textarea
                  value={newMag.description}
                  onChange={(e) => setNewMag({ ...newMag, description: e.target.value })}
                  placeholder="Tell readers what this issue is about..."
                />
                {magErrors.description && <div className="text-red-600 text-sm mt-1">{magErrors.description}</div>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Publish Date</label>
                  <Input
                    type="date"
                    value={newMag.publishedAt}
                    onChange={(e) => setNewMag({ ...newMag, publishedAt: e.target.value })}
                  />
                  {magErrors.publishedAt && <div className="text-red-600 text-sm mt-1">{magErrors.publishedAt}</div>}
                </div>
                {/* Publish checkbox removed — publication is determined from Publish Date */}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Cover Image</label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={newMag.coverImage}
                        onChange={(e) => setNewMag({ ...newMag, coverImage: e.target.value })}
                        placeholder="Paste Image URL..."
                      />
                      {magErrors.coverImage && <div className="text-red-600 text-sm mt-1">{magErrors.coverImage}</div>}
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
                    {newMag.coverImage && (
                      <div className="relative w-24 aspect-[3/4] rounded-lg overflow-hidden border-2 border-blue-100 bg-gray-50 flex-shrink-0">
                        <img src={newMag.coverImage} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewMag({ ...newMag, coverImage: "" })}
                          className="absolute top-1 right-1 p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                        >
                          <X className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* PDF URL removed: cover image URL or upload is used instead */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-900 hover:bg-blue-800"
                  disabled={!(newMag.title.trim() && newMag.description.trim() && newMag.publishedAt)}
                >
                  {editingId ? "Update Magazine" : "Create Magazine"}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsAdding(false); setEditingId(null); setNewMag({ title: "", description: "", coverImage: "", publishedAt: "" }); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Search and table container (restored original admin panel styling) */}
            <div className="bg-white rounded-lg border-2 border-blue-200 p-4 sm:p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search magazines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[650px]">
                <thead className="bg-blue-50 border-b-2 border-blue-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Cover</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Published Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Views</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Published</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-blue-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMagazines.map((magazine, index) => (
                    <tr key={magazine.id || `mag-${index}`} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        {magazine.coverImage && (
                          <img
                            src={magazine.coverImage}
                            alt={magazine.title}
                            className="w-12 h-16 object-cover rounded border-2 border-blue-100"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-blue-900">{magazine.title}</div>
                        <div className="text-sm text-gray-600 line-clamp-2">{magazine.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{magazine.publishedAt ? new Date(magazine.publishedAt).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">—</td>
                      <td className="px-6 py-4">
                        {magazine.isActive === false ? (
                          <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">Inactive</span>
                        ) : (
                          <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {(magazine.publishedAt && new Date(magazine.publishedAt) <= new Date()) ? (
                          <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Yes</span>
                        ) : (
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleViewClick(magazine)} className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button onClick={() => handleEditClick(magazine)} className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          {magazine.isActive === false ? (
                            <button onClick={() => handleActivateClick(magazine)} title="Activate" className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                              <RotateCw className="w-4 h-4 text-green-600" />
                            </button>
                          ) : (
                            <button onClick={() => handleDeleteClick(magazine)} className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
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
              <Dialog open={!!viewMag} onOpenChange={() => setViewMag(null)}>
                {viewMag && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{viewMag.title}</DialogTitle>
                      <DialogDescription>{viewMag.publishedAt ? new Date(viewMag.publishedAt).toLocaleDateString() : ''}</DialogDescription>
                    </DialogHeader>
                    <div className="pt-4">
                      <img src={viewMag.coverImage} alt={viewMag.title} className="w-full h-48 object-cover rounded" />
                      <p className="mt-4 text-sm text-gray-700">{viewMag.description}</p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setViewMag(null)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>

              {/* Confirm Delete Dialog */}
              <Dialog open={!!confirmDeleteMag} onOpenChange={() => setConfirmDeleteMag(null)}>
                {confirmDeleteMag && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deactivate Magazine</DialogTitle>
                      <DialogDescription>Are you sure you want to deactivate "{confirmDeleteMag.title}"? This will hide it from active lists.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setConfirmDeleteMag(null)}>Cancel</Button>
                      <Button className="bg-red-600 text-white" onClick={confirmDelete}>Deactivate</Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>

              {/* Confirm Activate Dialog */}
              <Dialog open={!!confirmActivateMag} onOpenChange={() => setConfirmActivateMag(null)}>
                {confirmActivateMag && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Activate Magazine</DialogTitle>
                      <DialogDescription>Do you want to activate "{confirmActivateMag.title}"?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setConfirmActivateMag(null)}>Cancel</Button>
                      <Button className="bg-green-600 text-white" onClick={confirmActivate}>Activate</Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
      </div>
    </AdminLayout>
  );
}
