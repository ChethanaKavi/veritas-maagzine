import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, X, Upload, Trash2, Edit, Eye, RotateCw, Search } from "lucide-react";
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

const API_URL = "http://localhost:4000";

export function AdminAdvertisements() {
  const [isAdding, setIsAdding] = useState(false);
  const [ads, setAds] = useState<any[]>([]);
  const [showPlacementDialog, setShowPlacementDialog] = useState(false);
  const [placements, setPlacements] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);
  const [customPlacementName, setCustomPlacementName] = useState("");
  
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
    area: "sidebar",
    link: "#",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [formErrors, setFormErrors] = useState<{ web?: string; tab?: string; mobile?: string }>({});

  const location = useLocation();
  const navigate = useNavigate();

  const fetchAds = async () => {
    try {
      const response = await fetch(`${API_URL}/advertisements`);
      const data = await response.json();
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
        const res = await fetch(`${API_URL}/placements`);
        if (res.ok) {
          const data = await res.json();
          // expected data: [{ value, label }, ...]
          setPlacements(data);
          return;
        }
      } catch (err) {
        // ignore and fallback to defaults
      }
      setPlacements([
        { value: "top-banner", label: "Top Banner" },
        { value: "sidebar", label: "Sidebar" },
        { value: "bottom-strip", label: "Bottom Strip" },
        { value: "inline-content", label: "Inline Content" },
      ]);
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
    const url = editingId ? `${API_URL}/advertisements/${editingId}` : `${API_URL}/advertisements`;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAd),
      });
      if (response.ok) {
        fetchAds();
        setIsAdding(false);
        setEditingId(null);
        setNewAd({ topic: "", description: "", webImage: "", tabImage: "", mobileImage: "", webImageWidth: 0, tabImageWidth: 0, mobileImageWidth: 0, area: "sidebar", link: "#" });
      } else {
        console.error("Failed to save advertisement");
      }
    } catch (error) {
      console.error("Error saving advertisement:", error);
    }
  };

  const handleSpecificImageChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const naturalWidth = img.naturalWidth;
        
        const dims: any = {};
        if (field === "webImage") {
          dims.webImage = result;
          dims.webImageWidth = naturalWidth;
        } else if (field === "tabImage") {
          dims.tabImage = result;
          dims.tabImageWidth = naturalWidth;
        } else {
          dims.mobileImage = result;
          dims.mobileImageWidth = naturalWidth;
        }
        setNewAd((prev) => ({ ...prev, ...dims }));
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
      area: ad.area || "sidebar",
      link: ad.link || "#",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (ad: any) => {
    setConfirmDeleteAd(ad);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteAd) return;
    try {
      const response = await fetch(`${API_URL}/advertisements/${confirmDeleteAd.id}`, { method: "DELETE" });
      if (response.ok) {
        fetchAds();
        setConfirmDeleteAd(null);
      } else {
        console.error("Failed to delete advertisement");
      }
    } catch (error) {
      console.error("Error deleting advertisement:", error);
    }
  };

  const handleActivateClick = (ad: any) => {
    setConfirmActivateAd(ad);
  };

  const confirmActivate = async () => {
    if (!confirmActivateAd) return;
    try {
      const response = await fetch(`${API_URL}/advertisements/${confirmActivateAd.id}/activate`, { method: "POST" });
      if (response.ok) {
        fetchAds();
        setConfirmActivateAd(null);
      } else {
        console.error("Failed to activate advertisement");
      }
    } catch (error) {
      console.error("Error activating advertisement:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-1">Advertisements</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your website's ad placements</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowPlacementDialog(true)} className="hidden md:inline-flex">
            Placement
          </Button>
          {!isAdding && (
            <Button onClick={() => { setIsAdding(true); setEditingId(null); setNewAd({ topic: "", description: "", webImage: "", tabImage: "", mobileImage: "", webImageWidth: 0, tabImageWidth: 0, mobileImageWidth: 0, area: "sidebar", link: "#" }); }} className="bg-blue-900 hover:bg-blue-800">
              <Plus className="w-4 h-4 mr-2" /> Add New Advertisement
            </Button>
          )}
        </div>
      </div>

      {isAdding ? (
        <div className="bg-white rounded-lg border-2 border-blue-200 p-4 sm:p-8 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-blue-900">{editingId ? "Edit Advertisement" : "Add New Advertisement"}</h2>
            <Button variant="ghost" size="icon" onClick={() => { setIsAdding(false); setEditingId(null); setNewAd({ topic: "", description: "", webImage: "", tabImage: "", mobileImage: "", webImageWidth: 0, tabImageWidth: 0, mobileImageWidth: 0, area: "sidebar", link: "#" }); }}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Topic</label>
              <Input
                required
                value={newAd.topic}
                onChange={(e) => setNewAd({ ...newAd, topic: e.target.value })}
                placeholder="e.g. Summer Sale 2026"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <Textarea
                required
                value={newAd.description}
                onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                placeholder="Brief description of the advertisement"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Image</label>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Web image (will use placement web width)</label>
                  <div className="flex gap-2 mt-1">
                    <Input value={newAd.webImage} onChange={(e) => setNewAd({ ...newAd, webImage: e.target.value })} placeholder="Image URL or browse..." className="flex-1" />
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleSpecificImageChange("webImage")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <Button type="button" variant="outline" className="flex items-center gap-2"><Upload className="w-4 h-4" /> Browse</Button>
                    </div>
                  </div>
                  {newAd.webImage && (
                    <div className="mt-2 w-32 aspect-[3/4] rounded-lg overflow-hidden border-2 border-blue-100 bg-gray-50">
                      <img src={newAd.webImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-600">{newAd.webImageWidth ? `Image width: ${newAd.webImageWidth} px` : null}</div>
                  {formErrors.web && <div className="text-sm text-red-600 mt-1">{formErrors.web}</div>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Tablet image</label>
                  <div className="flex gap-2 mt-1">
                    <Input value={newAd.tabImage} onChange={(e) => setNewAd({ ...newAd, tabImage: e.target.value })} placeholder="Image URL or browse..." className="flex-1" />
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleSpecificImageChange("tabImage")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <Button type="button" variant="outline" className="flex items-center gap-2"><Upload className="w-4 h-4" /> Browse</Button>
                    </div>
                  </div>
                  {newAd.tabImage && (
                    <div className="mt-2 w-32 aspect-[3/4] rounded-lg overflow-hidden border-2 border-blue-100 bg-gray-50">
                      <img src={newAd.tabImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-600">{newAd.tabImageWidth ? `Image width: ${newAd.tabImageWidth} px` : null}</div>
                  {formErrors.tab && <div className="text-sm text-red-600 mt-1">{formErrors.tab}</div>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Mobile image</label>
                  <div className="flex gap-2 mt-1">
                    <Input value={newAd.mobileImage} onChange={(e) => setNewAd({ ...newAd, mobileImage: e.target.value })} placeholder="Image URL or browse..." className="flex-1" />
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={handleSpecificImageChange("mobileImage")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <Button type="button" variant="outline" className="flex items-center gap-2"><Upload className="w-4 h-4" /> Browse</Button>
                    </div>
                  </div>
                  {newAd.mobileImage && (
                    <div className="mt-2 w-32 aspect-[3/4] rounded-lg overflow-hidden border-2 border-blue-100 bg-gray-50">
                      <img src={newAd.mobileImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-600">{newAd.mobileImageWidth ? `Image width: ${newAd.mobileImageWidth} px` : null}</div>
                  {formErrors.mobile && <div className="text-sm text-red-600 mt-1">{formErrors.mobile}</div>}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Advertisement Area</label>
              <Select
                  value={newAd.area}
                  onValueChange={(value) => setNewAd({ ...newAd, area: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    {placements.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                    <SelectItem value="other">Other (define)</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Link URL</label>
              <Input
                value={newAd.link}
                onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
                placeholder="#"
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 bg-blue-900 hover:bg-blue-800">
                Save Advertisement
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
        ) : (
        <div>
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
            <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
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
          </div>
        </div>
        )}

      {/* Placement Dialog */}
      <Dialog open={showPlacementDialog} onOpenChange={() => setShowPlacementDialog(false)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ad Placements</DialogTitle>
            <DialogDescription>Select an existing placement or define a new custom one.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            {/* Existing placements from DB */}
            {placements.map((p) => (
              <div
                key={p.value}
                onClick={() => {
                  setNewAd({ ...newAd, area: p.value });
                  setSelectedPlacement(p.value);
                  setShowPlacementDialog(false);
                }}
                className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between hover:bg-blue-50 transition-colors ${newAd.area === p.value ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
              >
                <div>
                  <div className="font-semibold text-blue-900">{p.label}</div>
                  <div className="text-xs text-gray-500">{p.value}</div>
                </div>
                {newAd.area === p.value && <span className="text-blue-600 text-sm font-semibold">✓ Selected</span>}
              </div>
            ))}

            {/* Add new custom placement */}
            <div className={`p-4 border rounded-lg mt-3 ${selectedPlacement === 'other' ? 'ring-2 ring-blue-300' : ''}`}>
              <div className="font-semibold text-gray-800">+ Add New Placement</div>
              <div className="text-sm text-gray-600 mt-1">Define a custom placement name and save it to the database.</div>
              <input
                value={customPlacementName}
                onChange={(e) => setCustomPlacementName(e.target.value)}
                placeholder="e.g. Homepage Sidebar"
                className="w-full mt-3 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <div className="mt-3 flex gap-2">
                <Button
                  onClick={async () => {
                    const val = customPlacementName.trim();
                    if (!val) return;
                    const key = val.toLowerCase().replace(/\s+/g, '-');
                    try {
                      const res = await fetch(`${API_URL}/placements`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ value: key, label: val }),
                      });
                      const listRes = await fetch(`${API_URL}/placements`);
                      if (listRes.ok) setPlacements(await listRes.json());
                      setNewAd({ ...newAd, area: key });
                      setSelectedPlacement(key);
                      setCustomPlacementName('');
                      if (res.status === 201 || res.status === 409) {
                        setShowPlacementDialog(false);
                      }
                    } catch {
                      const key2 = val.toLowerCase().replace(/\s+/g, '-');
                      setPlacements((prev) => prev.some((pp) => pp.value === key2) ? prev : [...prev, { value: key2, label: val }]);
                      setNewAd({ ...newAd, area: key2 });
                      setShowPlacementDialog(false);
                    }
                  }}
                >
                  Save & Use
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
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
