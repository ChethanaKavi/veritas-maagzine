import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, X, Upload, Trash2, Edit, Eye, RotateCw, Search } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export function AdminAdvertisements() {
  const { magazines: magazineList, articles: articleList } = useAdminData();
  const [isAdding, setIsAdding] = useState(false);
  const [ads, setAds] = useState<any[]>([]);
  const [showPlacementDialog, setShowPlacementDialog] = useState(false);
  const [placements, setPlacements] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);
  const [customPlacementName, setCustomPlacementName] = useState("");
  const [selectedMagazineId, setSelectedMagazineId] = useState<string>("");
  
  const [viewAd, setViewAd] = useState<any | null>(null);
  const [confirmDeleteAd, setConfirmDeleteAd] = useState<any | null>(null);
  const [confirmActivateAd, setConfirmActivateAd] = useState<any | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newAd, setNewAd] = useState({
    topic: "",
    description: "",
    webImage: "",
    tabImage: "",
    mobileImage: "",
    webImageWidth: 0,
    tabImageWidth: 0,
    mobileImageWidth: 0,
    area: "Footer",
    link: "#",
    magazineId: "",
    articleId: "",
    active: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ 
    topic?: string; 
    description?: string;
    webImage?: string; 
    tabImage?: string; 
    mobileImage?: string;
    area?: string;
    link?: string;
  }>({});

  const location = useLocation();
  const navigate = useNavigate();

  // Validate image dimensions
  const validateImageDimensions = (width: number, height: number, type: 'web' | 'tab' | 'mobile'): boolean => {
    if (type === 'web') return width === 560 && height === 560;
    if (type === 'tab') return width === 420 && height === 420;
    if (type === 'mobile') return width === 300 && height === 300;
    return false;
  };

  // Check form validity (pure function - no state updates)
  const checkFormValid = (): { [k: string]: string } => {
    const errors: any = {};
    
    if (!newAd.topic.trim()) errors.topic = "Topic is required";
    if (!newAd.description.trim()) errors.description = "Description is required";
    if (!newAd.webImage) errors.webImage = "Web image is required (560x560px)";
    if (!newAd.tabImage) errors.tabImage = "Tablet image is required (420x420px)";
    if (!newAd.mobileImage) errors.mobileImage = "Mobile image is required (300x300px)";
    if (!newAd.area) errors.area = "Area is required";
    if (!newAd.link.trim()) errors.link = "Link is required";
    
    // Validate image dimensions
    if (newAd.webImage && !validateImageDimensions(newAd.webImageWidth, newAd.webImageWidth, 'web')) {
      errors.webImage = "Web image must be exactly 560x560px";
    }
    if (newAd.tabImage && !validateImageDimensions(newAd.tabImageWidth, newAd.tabImageWidth, 'tab')) {
      errors.tabImage = "Tablet image must be exactly 420x420px";
    }
    if (newAd.mobileImage && !validateImageDimensions(newAd.mobileImageWidth, newAd.mobileImageWidth, 'mobile')) {
      errors.mobileImage = "Mobile image must be exactly 300x300px";
    }
    
    return errors;
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    return Object.keys(checkFormValid()).length === 0;
  };

  const fetchAds = async () => {
    try {
      const { data } = await apiClient.get('/advertisements');
      setAds(data);
    } catch (error) {
      console.error("Failed to fetch advertisements", error);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // load placements from localStorage or default
  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const { data } = await apiClient.get('/placements');
        if (data && data.length > 0) {
          setPlacements(data);
          return;
        }
      } catch (err) {
        // ignore and fallback to defaults
      }
      // Default placements
      const defaultPlacements = [
        { value: "homepage-topbar", label: "Homepage Topbar" },
        { value: "homepage-bottom", label: "Homepage Bottom" },
        { value: "leftside-in-the-magazine-page", label: "Left Side - Magazine Page" },
        { value: "rightsidebar-in-the-article-page", label: "Right Sidebar - Article Page" },
        { value: "Footer", label: "Footer" },
      ];
      setPlacements(defaultPlacements);
    };
    fetchPlacements();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("add") === "true") {
      setIsAdding(true);
      setEditingId(null);
      navigate(location.pathname, { replace: true });
    }
  }, [location.search]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submitting
    const errors = checkFormValid();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.error("Form validation failed");
      return;
    }

    try {
      if (editingId) {
        await apiClient.put(`/advertisements/${editingId}`, newAd);
        setSuccessMessage('Advertisement updated successfully!');
      } else {
        await apiClient.post('/advertisements', newAd);
        setSuccessMessage('Advertisement created successfully!');
      }
      fetchAds();
      setIsAdding(false);
      setEditingId(null);
      setFormErrors({});
      setNewAd({ topic: "", description: "", webImage: "", tabImage: "", mobileImage: "", webImageWidth: 0, tabImageWidth: 0, mobileImageWidth: 0, area: "Footer", link: "#", magazineId: "", articleId: "", active: true });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error("Error saving advertisement:", error.response?.data?.error || error.message);
    }
  };

  const handleSpecificImageChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.');
      e.target.value = '';
      return;
    }

    // Get image dimensions first
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const naturalWidth = img.naturalWidth;
        
        // Upload to Cloudinary using XMLHttpRequest (same as AdminArticles)
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'veritas_ads');
        
        xhr.open('POST', '/api/uploads');
        xhr.onload = () => {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              const data = JSON.parse(xhr.responseText);
              const cloudinaryUrl = data.secure_url;
              
              const dims: any = {};
              if (field === "webImage") {
                dims.webImage = cloudinaryUrl;
                dims.webImageWidth = naturalWidth;
              } else if (field === "tabImage") {
                dims.tabImage = cloudinaryUrl;
                dims.tabImageWidth = naturalWidth;
              } else {
                dims.mobileImage = cloudinaryUrl;
                dims.mobileImageWidth = naturalWidth;
              }
              setNewAd((prev) => ({ ...prev, ...dims }));
            } else {
              const errorData = JSON.parse(xhr.responseText);
              alert('Upload failed: ' + (errorData.error || 'Unknown error'));
              e.target.value = '';
            }
          } catch (err) {
            console.error('Error parsing upload response:', err);
            alert('Upload error: Invalid response from server');
            e.target.value = '';
          }
        };
        xhr.onerror = () => {
          console.error('Upload request failed');
          alert('Upload failed: Network error');
          e.target.value = '';
        };
        xhr.send(formData);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleViewClick = (ad: any) => {
    setViewAd(ad);
  };

  const handleEditClick = (ad: any) => {
    setIsAdding(true);
    setEditingId(ad.id);
    setNewAd({
      topic: ad.topic,
      description: ad.description,
      webImage: ad.webImage || "",
      tabImage: ad.tabImage || "",
      mobileImage: ad.mobileImage || "",
      webImageWidth: ad.webImageWidth || 0,
      tabImageWidth: ad.tabImageWidth || 0,
      mobileImageWidth: ad.mobileImageWidth || 0,
      area: ad.area || "Footer",
      link: ad.link || "#",
      magazineId: ad.magazineId || "",
      articleId: ad.articleId || "",
      active: ad.active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (ad: any) => {
    setConfirmDeleteAd(ad);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteAd) return;
    try {
      await apiClient.delete(`/advertisements/${confirmDeleteAd.id}`);
      fetchAds();
      setConfirmDeleteAd(null);
    } catch (error: any) {
      console.error("Error deleting advertisement:", error.response?.data?.error || error.message);
    }
  };

  const handleActivateClick = (ad: any) => {
    setConfirmActivateAd(ad);
  };

  const confirmActivate = async () => {
    if (!confirmActivateAd) return;
    try {
      await apiClient.post(`/advertisements/${confirmActivateAd.id}/activate`);
      fetchAds();
      setConfirmActivateAd(null);
    } catch (error: any) {
      console.error("Error activating advertisement:", error.response?.data?.error || error.message);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Advertisements</h1>
          <p className="text-gray-600">Manage your website's ad placements</p>
        </div>
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 animate-pulse">
            ✓ {successMessage}
          </div>
        )}
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowPlacementDialog(true)} className="hidden md:inline-flex">
            Placement
          </Button>
          {!isAdding && (
          <Button onClick={() => { setIsAdding(true); setEditingId(null); setSelectedMagazineId(""); setNewAd({ topic: "", description: "", webImage: "", tabImage: "", mobileImage: "", webImageWidth: 0, tabImageWidth: 0, mobileImageWidth: 0, area: "Footer", link: "#", magazineId: "", articleId: "", active: true }); }} className="bg-blue-900 hover:bg-blue-800">
              <Plus className="w-4 h-4 mr-2" /> Add New Advertisement
            </Button>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding ? (
        <div className="bg-white rounded-lg border-2 border-blue-200 p-8 max-w-2xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-blue-900">{editingId ? "Edit Advertisement" : "Add New Advertisement"}</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Topic <span className="text-red-600">*</span></label>
              <Input
                required
                value={newAd.topic}
                onChange={(e) => setNewAd({ ...newAd, topic: e.target.value })}
                placeholder="e.g. Summer Sale 2026"
                className={formErrors.topic ? "border-red-500" : ""}
              />
              {formErrors.topic && <p className="text-sm text-red-600">{formErrors.topic}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description <span className="text-red-600">*</span></label>
              <Textarea
                required
                value={newAd.description}
                onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                placeholder="Brief description of the advertisement"
                className={formErrors.description ? "border-red-500" : ""}
              />
              {formErrors.description && <p className="text-sm text-red-600">{formErrors.description}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Image</label>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Web image <span className="text-red-600">*</span> (560x560px required)</label>
                  <div className="flex gap-2 mt-1">
                    <Input value={newAd.webImage} onChange={(e) => setNewAd({ ...newAd, webImage: e.target.value })} placeholder="Image URL or browse..." className={`flex-1 ${formErrors.webImage ? "border-red-500" : ""}`} />
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleSpecificImageChange("webImage")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <Button type="button" variant="outline" className="flex items-center gap-2"><Upload className="w-4 h-4" /> Browse</Button>
                    </div>
                  </div>
                  {newAd.webImage && (
                    <div className="mt-2 w-32 aspect-square rounded-lg overflow-hidden border-2 border-blue-100 bg-gray-50">
                      <img src={newAd.webImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-600">{newAd.webImageWidth ? `Dimensions: ${newAd.webImageWidth}x${newAd.webImageWidth}px` : null}</div>
                  {formErrors.webImage && <div className="text-sm text-red-600 mt-1">{formErrors.webImage}</div>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Tablet image <span className="text-red-600">*</span> (420x420px required)</label>
                  <div className="flex gap-2 mt-1">
                    <Input value={newAd.tabImage} onChange={(e) => setNewAd({ ...newAd, tabImage: e.target.value })} placeholder="Image URL or browse..." className={`flex-1 ${formErrors.tabImage ? "border-red-500" : ""}`} />
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleSpecificImageChange("tabImage")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <Button type="button" variant="outline" className="flex items-center gap-2"><Upload className="w-4 h-4" /> Browse</Button>
                    </div>
                  </div>
                  {newAd.tabImage && (
                    <div className="mt-2 w-32 aspect-square rounded-lg overflow-hidden border-2 border-blue-100 bg-gray-50">
                      <img src={newAd.tabImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-600">{newAd.tabImageWidth ? `Dimensions: ${newAd.tabImageWidth}x${newAd.tabImageWidth}px` : null}</div>
                  {formErrors.tabImage && <div className="text-sm text-red-600 mt-1">{formErrors.tabImage}</div>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Mobile image <span className="text-red-600">*</span> (300x300px required)</label>
                  <div className="flex gap-2 mt-1">
                    <Input value={newAd.mobileImage} onChange={(e) => setNewAd({ ...newAd, mobileImage: e.target.value })} placeholder="Image URL or browse..." className={`flex-1 ${formErrors.mobileImage ? "border-red-500" : ""}`} />
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleSpecificImageChange("mobileImage")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <Button type="button" variant="outline" className="flex items-center gap-2"><Upload className="w-4 h-4" /> Browse</Button>
                    </div>
                  </div>
                  {newAd.mobileImage && (
                    <div className="mt-2 w-32 aspect-square rounded-lg overflow-hidden border-2 border-blue-100 bg-gray-50">
                      <img src={newAd.mobileImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-600">{newAd.mobileImageWidth ? `Dimensions: ${newAd.mobileImageWidth}x${newAd.mobileImageWidth}px` : null}</div>
                  {formErrors.mobileImage && <div className="text-sm text-red-600 mt-1">{formErrors.mobileImage}</div>}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Magazine</label>
              <Select
                value={selectedMagazineId}
                onValueChange={(val) => {
                  setSelectedMagazineId(val);
                  setNewAd({ ...newAd, magazineId: val, articleId: "" });
                }}
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
            </div>

            {selectedMagazineId && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Article</label>
                <Select
                  value={newAd.articleId}
                  onValueChange={(val) => setNewAd({ ...newAd, articleId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Article" />
                  </SelectTrigger>
                  <SelectContent>
                    {articleList
                      .filter((article) => article.magazineId === selectedMagazineId)
                      .map((article) => (
                        <SelectItem key={article.id} value={article.id}>
                          {article.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Advertisement Area <span className="text-red-600">*</span>
              </label>
              <Select
                  value={newAd.area}
                  onValueChange={(value) => setNewAd({ ...newAd, area: value as any })}
                >
                  <SelectTrigger className={formErrors.area ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    {placements.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                    <SelectItem value="other">Other (define)</SelectItem>
                  </SelectContent>
                </Select>
              {formErrors.area && <p className="text-sm text-red-600">{formErrors.area}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Link URL <span className="text-red-600">*</span>
              </label>
              <Input
                value={newAd.link}
                onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
                placeholder="#"
                className={formErrors.link ? "border-red-500" : ""}
              />
              {formErrors.link && <p className="text-sm text-red-600">{formErrors.link}</p>}
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="active"
                checked={newAd.active}
                onChange={(e) => setNewAd({ ...newAd, active: e.target.checked })}
                className="w-4 h-4 text-blue-900 rounded border-gray-300 cursor-pointer"
              />
              <label htmlFor="active" className="text-sm font-semibold text-gray-700 cursor-pointer">
                Active (Show this advertisement)
              </label>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={!isFormValid()} className="flex-1 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
                Save Advertisement
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsAdding(false); setSelectedMagazineId(""); setNewAd({ topic: "", description: "", webImage: "", tabImage: "", mobileImage: "", webImageWidth: 0, tabImageWidth: 0, mobileImageWidth: 0, area: "Footer", link: "#", magazineId: "", articleId: "", active: true }); }}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <>
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search advertisements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="bg-white rounded-lg border-2 border-blue-200 overflow-hidden">
          <table className="w-full">
          <thead className="bg-blue-50 border-b-2 border-blue-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Preview</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Topic</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Area</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Link</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-blue-900">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-blue-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ads
              .filter((ad) =>
                ad.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (ad.area || "").toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((ad) => (
              <tr key={ad.id} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-12 h-16 rounded overflow-hidden border-2 border-blue-100 bg-gray-50 flex items-center justify-center">
                    <img src={ad.webImage || ad.tabImage || ad.mobileImage} alt={ad.topic} className="w-full h-full object-cover rounded" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-blue-900">{ad.topic}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{ad.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div>{ad.area}</div>
                </td>
                <td className="px-6 py-4 text-sm text-blue-700 truncate max-w-xs">{ad.link}</td>
                <td className="px-6 py-4">
                  {ad.active === false ? (
                    <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">Inactive</span>
                  ) : (
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Active</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleViewClick(ad)} className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="View"><Eye className="w-4 h-4 text-blue-600" /></button>
                      <button onClick={() => handleEditClick(ad)} className="p-2 hover:bg-blue-100 rounded-lg transition-colors" title="Edit"><Edit className="w-4 h-4 text-blue-600" /></button>
                      {ad.active === false ? (
                        <button onClick={() => handleActivateClick(ad)} title="Activate" className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                          <RotateCw className="w-4 h-4 text-green-600" />
                        </button>
                      ) : (
                        <button onClick={() => handleDeleteClick(ad)} className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4 text-red-600" /></button>
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

      {/* Placement Dialog */}
      <Dialog open={showPlacementDialog} onOpenChange={() => setShowPlacementDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ad Placements</DialogTitle>
            <DialogDescription>Select a placement area and see example dimensions.</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className={`p-4 border rounded-lg ${selectedPlacement === 'other' ? 'ring-2 ring-blue-300' : ''}`}>
              <div className="font-semibold">Other (define)</div>
              <div className="text-sm text-gray-600 mt-1">Define a custom placement name and save it.</div>
              <input value={customPlacementName} onChange={(e) => setCustomPlacementName(e.target.value)} placeholder="e.g. Homepage Sidebar" className="w-full mt-3 border rounded px-3 py-2" />
              <div className="mt-3 flex gap-2">
                <Button onClick={() => { if (customPlacementName.trim()) { setSelectedPlacement('other'); } }} variant="outline">Select</Button>
                <Button onClick={() => {
                  (async () => {
                    const val = customPlacementName.trim();
                    if (!val) return;
                    const key = val.toLowerCase().replace(/\s+/g, '-');
                    try {
                      const res = await apiClient.post('/placements', { value: key, label: val });
                      setPlacements((prev) => [...prev.filter((p) => p.value !== res.data.value), res.data]);
                      setNewAd({ ...newAd, area: res.data.value });
                    } catch (err: any) {
                      if (err.response?.status === 409) {
                        try {
                          const list = await apiClient.get('/placements');
                          setPlacements(list.data);
                        } catch (e) {
                          console.error('Failed to fetch placements', e);
                        }
                        setNewAd({ ...newAd, area: key });
                      } else {
                        setPlacements((prev) => {
                          const exists = prev.some((pp) => pp.value === key);
                          if (!exists) return [...prev, { value: key, label: val }];
                          return prev;
                        });
                        setNewAd({ ...newAd, area: key });
                      }
                    }
                    setShowPlacementDialog(false);
                  })();
                }}>
                  Save & Use
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlacementDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewAd} onOpenChange={() => setViewAd(null)}>
        {viewAd && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewAd.topic}</DialogTitle>
              <DialogDescription>{viewAd.area}</DialogDescription>
            </DialogHeader>
            <div className="pt-4">
              <img src={viewAd.webImage || viewAd.tabImage || viewAd.mobileImage} alt={viewAd.topic} className="w-full h-48 object-cover rounded" />
              <p className="mt-4 text-sm text-gray-700">{viewAd.description}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewAd(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDeleteAd} onOpenChange={() => setConfirmDeleteAd(null)}>
        {confirmDeleteAd && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deactivate Advertisement</DialogTitle>
              <DialogDescription>Are you sure you want to deactivate "{confirmDeleteAd.topic}"? This will hide it from active lists.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDeleteAd(null)}>Cancel</Button>
              <Button className="bg-red-600 text-white" onClick={confirmDelete}>Deactivate</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Confirm Activate Dialog */}
      <Dialog open={!!confirmActivateAd} onOpenChange={() => setConfirmActivateAd(null)}>
        {confirmActivateAd && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activate Advertisement</DialogTitle>
              <DialogDescription>Do you want to activate "{confirmActivateAd.topic}"?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmActivateAd(null)}>Cancel</Button>
              <Button className="bg-green-600 text-white" onClick={confirmActivate}>Activate</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </AdminLayout>
  );
}
