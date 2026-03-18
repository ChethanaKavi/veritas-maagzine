import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MagazineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MagazineDrawer({ isOpen, onClose }: MagazineDrawerProps) {
  const navigate = useNavigate();
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/magazines?published=true');
        if (res.ok) {
          const data = await res.json();
          setMagazines(data);
        }
      } catch (e) {
        console.error('Failed to fetch magazines', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleMagazineClick = (magazineId: string) => {
    navigate(`/magazines/${encodeURIComponent(magazineId)}`);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out border-r-2 border-blue-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-blue-200 bg-blue-50">
            <h2 className="text-lg font-semibold text-blue-900">Previous Issues</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-blue-100 transition-colors text-blue-900"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Magazine List */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="text-center py-4 text-gray-600">Loading...</div>
            ) : (
              <div className="space-y-3">
                {magazines.map((magazine) => (
                  <button
                    key={magazine.id}
                    onClick={() => handleMagazineClick(magazine.id)}
                    className="w-full text-left group"
                  >
                    <div className="flex gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors border-2 border-transparent hover:border-blue-200">
                      <img
                        src={magazine.coverImage}
                        alt={magazine.title}
                        className="w-14 h-20 object-cover rounded shadow-md border-2 border-blue-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors text-blue-900">
                          {magazine.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-1">{new Date(magazine.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        <p className="text-xs text-gray-500">{new Date(magazine.publishedAt).getFullYear()}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}