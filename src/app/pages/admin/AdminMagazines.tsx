import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Plus, Edit, Trash2, Eye, Search, X, RotateCw } from "lucide-react";
import { useAdminData } from "../../contexts/AdminDataContext";
import apiClient from "../../utils/api";
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

export function AdminMagazines() {
  const { magazines: magList, updateMagazine, addMagazine, deleteMagazine } = useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
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
  const [uploadProgress, setUploadProgress] = useState<{ [k: string]: number }>({});
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploadErrors, setUploadErrors] = useState<{ [k: string]: string }>({});

  const location = useLocation();
  const navigate = useNavigate();

  const checkFormValid = (): { [k: string]: string } => {
    const errors: any = {};
    if (!newMag.title.trim()) errors.title = 'Title is required';
    if (!newMag.description.trim()) errors.description = 'Description is required';
    if (!newMag.publishedAt) errors.publishedAt = 'Publish date is required';
    if (!newMag.coverImage.trim()) errors.coverImage = 'Cover image URL or upload is required';
    return errors;
  };

  const isFormValid = (): boolean => {
    return Object.keys(checkFormValid()).length === 0;
  };

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
    const errors = checkFormValid();
    setMagErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Prevent saving while any uploads are still in progress
    const pending = Object.values(uploadProgress).some((v) => typeof v === 'number' && v < 100);
    if (pending) {
      setMagErrors((prev) => ({ ...prev, general: 'Please wait for uploads to finish before saving.' }));
      return;
    }

    const payload = {
      ...newMag,
      publishedAt: newMag.publishedAt
        ? new Date(newMag.publishedAt).toISOString()
        : null,
    };
    try {
      if (editingId) {
        await apiClient.put(`/magazines/${editingId}`, payload);
      } else {
        await apiClient.post('/magazines', payload);
      }
      // Refetch magazines
      const { data } = await apiClient.get('/magazines');
      // assumes useAdminData context has a method to update magazines
    } catch (err: any) {
      console.error('Failed to save magazine', err.response?.data?.error || err.message);
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
      await apiClient.delete(`/magazines/${confirmDeleteMag.id}`);
      deleteMagazine(confirmDeleteMag.id);
    } catch (e: any) {
      console.error('Failed to deactivate', e.response?.data?.error || e.message);
    }
    setConfirmDeleteMag(null);
  };

  const handleActivateClick = (mag: any) => {
    setConfirmActivateMag(mag);
  };

  const confirmActivate = async () => {
    if (!confirmActivateMag) return;
    try {
      const { data: updated } = await apiClient.post(`/magazines/${confirmActivateMag.id}/activate`);
      updateMagazine(confirmActivateMag.id, updated);
    } catch (e: any) {
      console.error('Failed to activate', e.response?.data?.error || e.message);
    }
    setConfirmActivateMag(null);
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
        setNewMag((prev) => ({ ...prev, coverImage: res.secure_url }));
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesSelected(e);
  };

  const filteredMagazines = magList.filter((magazine) =>
    magazine.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Magazines</h1>
            <p className="text-gray-600">Manage all magazine issues</p>
          </div>
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg animate-pulse">
              ✓ {successMessage}
            </div>
          )}
          {!isAdding && (
            <button
                onClick={() => {
                setIsAdding(true);
                setEditingId(null);
                setNewMag({ title: "", description: "", coverImage: "", publishedAt: "" });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Magazine
            </button>
          )}
        </div>

        {isAdding ? (
          <div className="bg-white rounded-lg border-2 border-blue-200 p-8 max-w-2xl mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-900">{editingId ? "Edit Magazine" : "Add New Magazine"}</h2>
               <Button variant="ghost" size="icon" onClick={() => { setIsAdding(false); setEditingId(null); setNewMag({ title: "", description: "", coverImage: "", publishedAt: "" }); }}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Magazine Title <span className="text-red-600">*</span>
                </label>
                <Input
                  value={newMag.title}
                  onChange={(e) => setNewMag({ ...newMag, title: e.target.value })}
                  placeholder="e.g. Modern Architecture Vol 1"
                  className={magErrors.title ? "border-red-500" : ""}
                />
                {magErrors.title && <p className="text-sm text-red-600">{magErrors.title}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Description <span className="text-red-600">*</span>
                </label>
                <Textarea
                  value={newMag.description}
                  onChange={(e) => setNewMag({ ...newMag, description: e.target.value })}
                  placeholder="Tell readers what this issue is about..."
                  className={magErrors.description ? "border-red-500" : ""}
                />
                {magErrors.description && <p className="text-sm text-red-600">{magErrors.description}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Publish Date <span className="text-red-600">*</span>
                  </label>
                  <Input
                    type="date"
                    value={newMag.publishedAt}
                    onChange={(e) => setNewMag({ ...newMag, publishedAt: e.target.value })}
                    className={magErrors.publishedAt ? "border-red-500" : ""}
                  />
                  {magErrors.publishedAt && <p className="text-sm text-red-600">{magErrors.publishedAt}</p>}
                </div>
                {/* Publish checkbox removed — publication is determined from Publish Date */}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Cover Image <span className="text-red-600">*</span>
                  </label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={newMag.coverImage}
                        onChange={(e) => setNewMag({ ...newMag, coverImage: e.target.value })}
                        placeholder="Paste Image URL..."
                        className={magErrors.coverImage ? "border-red-500" : ""}
                      />
                      {magErrors.coverImage && <p className="text-sm text-red-600">{magErrors.coverImage}</p>}
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
                          onChange={handleImageChange}
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
                                <button type="button" className="text-xs px-2 py-1 border rounded" onClick={() => setNewMag((p) => ({ ...p, coverImage: f.url }))}>Use</button>
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
              {/* PDF URL removed: cover image URL or upload is used instead */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isFormValid() || Object.keys(uploadProgress).length > 0}
                  title={Object.keys(uploadProgress).length > 0 ? 'Please wait for uploads to complete' : ''}
                >
                  {Object.keys(uploadProgress).length > 0 ? 'Uploading...' : (editingId ? "Update Magazine" : "Create Magazine")}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsAdding(false); setEditingId(null); setNewMag({ title: "", description: "", coverImage: "", publishedAt: "" }); setUploadProgress({}); setUploadedFiles([]); setUploadErrors({}); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Search and table container (restored original admin panel styling) */}
            <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
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

              <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-blue-50 border-b-2 border-blue-200">
                  <tr>
                    <th className="w-16 px-4 py-4 text-left text-sm font-semibold text-blue-900">Cover</th>
                    <th className="max-w-[48ch] px-6 py-4 text-left text-sm font-semibold text-blue-900">Title</th>
                    <th className="w-36 px-6 py-4 text-left text-sm font-semibold text-blue-900">Published Date</th>
                    <th className="w-20 px-6 py-4 text-center text-sm font-semibold text-blue-900">Views</th>
                    <th className="w-24 px-6 py-4 text-center text-sm font-semibold text-blue-900">Status</th>
                    <th className="w-24 px-6 py-4 text-center text-sm font-semibold text-blue-900">Published</th>
                    <th className="w-36 px-6 py-4 text-right text-sm font-semibold text-blue-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMagazines.map((magazine, index) => (
                    <tr key={magazine.id || `mag-${index}`} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-4">
                        {magazine.coverImage && (
                          <img
                            src={magazine.coverImage}
                            alt={magazine.title}
                            className="w-12 h-16 object-cover rounded border-2 border-blue-100"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-[48ch]">
                        <div className="font-semibold text-blue-900 whitespace-normal break-words line-clamp-2">{magazine.title}</div>
                        <div className="text-sm text-gray-600 line-clamp-2">{magazine.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{magazine.publishedAt ? new Date(magazine.publishedAt).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">—</td>
                      <td className="px-6 py-4 text-center">
                        {magazine.isActive === false ? (
                          <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">Inactive</span>
                        ) : (
                          <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
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
