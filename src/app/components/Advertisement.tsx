import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

interface AdData {
  id: string;
  topic: string;
  description?: string;
  webImage?: string;
  area?: string;
  link?: string;
  active: boolean;
}

export type AdArea = string;

interface AdvertisementProps {
  area?: AdArea;
}

// Module-level cache so multiple components don't re-fetch
let adsCache: AdData[] | null = null;
let adsFetching: Promise<AdData[]> | null = null;

async function getAds(): Promise<AdData[]> {
  if (adsCache !== null) return adsCache;
  if (!adsFetching) {
    adsFetching = fetch(`${API_BASE}/advertisements`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: AdData[]) => {
        adsCache = data;
        return data;
      })
      .catch(() => {
        adsFetching = null;
        return [];
      });
  }
  return adsFetching;
}

/* ── MODAL ─────────────────────────────────────────────────── */
function AdModal({ ad, onClose }: { ad: AdData; onClose: () => void }) {
  // Treat empty, "#", or whitespace-only as no link
  const rawLink = ad.link?.trim();
  const hasValidLink = rawLink && rawLink !== "#" && rawLink !== "/";
  const externalLink = hasValidLink
    ? rawLink.match(/^https?:\/\//) ? rawLink : `https://${rawLink}`
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white rounded-full text-gray-600 hover:text-gray-900 shadow transition-colors"
        >
          ✕
        </button>

        {/* Image */}
        {ad.webImage && (
          <img
            src={ad.webImage}
            alt={ad.topic}
            className="w-full h-36 sm:h-52 object-cover flex-shrink-0"
          />
        )}

        <div className="p-4 sm:p-6">
          <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-2">Advertisement</p>
          <h2 className="text-lg sm:text-2xl font-bold text-blue-900 mb-2 sm:mb-3">{ad.topic}</h2>
          {ad.description && (
            <p className="text-gray-600 mb-6 leading-relaxed">{ad.description}</p>
          )}
          <div className="flex gap-3">
            {externalLink ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(externalLink, "_blank", "noopener,noreferrer");
                }}
                className="flex-1 text-center px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Visit Now
              </button>
            ) : null}
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-blue-200 text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Advertisement({ area = "inline-content" }: AdvertisementProps) {
  const [ad, setAd] = useState<AdData | null | "loading">("loading");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAds().then((ads) => {
      const filtered = ads.filter((a) => a.active && a.area === area);
      setAd(filtered.length > 0 ? filtered[0] : null);
    });
  }, [area]);

  // Still fetching
  if (ad === "loading") return null;

  const realAd = ad as AdData | null;
  const image = realAd?.webImage || null;

  const handleLearnMore = () => setShowModal(true);

  /* ── TOP BANNER ─────────────────────────────────────────── */
  if (area === "top-banner") {
    if (!realAd) return null; // top banner: only show if there's a real ad
    return (
      <>
        <div className="w-full bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              {image && (
                <img src={image} alt={realAd.topic} className="h-8 w-auto rounded flex-shrink-0 object-cover" />
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-60">Advertisement</p>
                <p className="text-sm font-bold leading-tight">{realAd.topic}</p>
                {realAd.description && (
                  <p className="text-xs opacity-70 hidden sm:block">{realAd.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleLearnMore}
              className="flex-shrink-0 px-4 py-1.5 bg-white text-blue-900 rounded text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
        {showModal && <AdModal ad={realAd} onClose={() => setShowModal(false)} />}
      </>
    );
  }

  /* ── SIDEBAR ─────────────────────────────────────────────── */
  if (area === "sidebar") {
    const topic = realAd?.topic ?? "Your Brand Here";
    const description = realAd?.description ?? "Reach thousands of engaged readers with your message. Contact us for advertising opportunities.";
    return (
      <>
        <div className="bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg overflow-hidden sticky top-4">
          {image && <img src={image} alt={topic} className="w-full h-44 object-cover" />}
          <div className="p-4">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Advertisement</p>
            <h4 className="font-bold text-blue-900 text-sm mb-1">{topic}</h4>
            <p className="text-xs text-gray-600 mb-3">{description}</p>
            <button
              onClick={handleLearnMore}
              className="block w-full text-center px-3 py-2 bg-blue-900 text-white rounded text-sm font-semibold hover:bg-blue-800 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
        {showModal && realAd && <AdModal ad={realAd} onClose={() => setShowModal(false)} />}
        {showModal && !realAd && (
          <AdModal
            ad={{ id: "default", topic, description, active: true }}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  /* ── LEFT SIDEBAR ────────────────────────────────────────── */
  if (area === "left-sidebar") {
    const topic = realAd?.topic ?? "Your Brand Here";
    const description = realAd?.description ?? "Reach thousands of engaged readers with your message.";
    return (
      <>
        <div className="bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg overflow-hidden sticky top-4">
          {image && <img src={image} alt={topic} className="w-full h-44 object-cover" />}
          <div className="p-4">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Advertisement</p>
            <h4 className="font-bold text-blue-900 text-sm mb-1">{topic}</h4>
            <p className="text-xs text-gray-600 mb-3">{description}</p>
            <button
              onClick={handleLearnMore}
              className="block w-full text-center px-3 py-2 bg-blue-900 text-white rounded text-sm font-semibold hover:bg-blue-800 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
        {showModal && realAd && <AdModal ad={realAd} onClose={() => setShowModal(false)} />}
        {showModal && !realAd && (
          <AdModal
            ad={{ id: "default", topic, description, active: true }}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  /* ── BOTTOM STRIP ────────────────────────────────────────── */
  if (area === "bottom-strip") {
    const topic = realAd?.topic ?? "Your Brand Here";
    const description = realAd?.description ?? "Reach thousands of engaged readers with your message. Contact us for advertising opportunities.";
    return (
      <>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {image && (
              <img src={image} alt={topic} className="h-20 w-32 object-cover rounded flex-shrink-0" />
            )}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Advertisement</p>
              <h4 className="font-bold text-blue-900 text-xl mb-1">{topic}</h4>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
            <button
              onClick={handleLearnMore}
              className="flex-shrink-0 px-6 py-2 bg-blue-900 text-white rounded-md font-semibold hover:bg-blue-800 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
        {showModal && realAd && <AdModal ad={realAd} onClose={() => setShowModal(false)} />}
        {showModal && !realAd && (
          <AdModal
            ad={{ id: "default", topic, description, active: true }}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  /* ── INLINE CONTENT (default) ───────────────────────────── */
  const topic = realAd?.topic ?? "Your Brand Here";
  const description = realAd?.description ?? "Reach thousands of engaged readers with your message. Contact us for advertising opportunities.";
  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs text-blue-600 mb-2 font-semibold">ADVERTISEMENT</p>
          {image && (
            <img src={image} alt={topic} className="w-full h-48 object-cover rounded-lg mb-4" />
          )}
          <h3 className="text-2xl font-bold mb-3 text-blue-900">{topic}</h3>
          <p className="text-gray-700 mb-4">{description}</p>
          <button
            onClick={handleLearnMore}
            className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
      {showModal && realAd && <AdModal ad={realAd} onClose={() => setShowModal(false)} />}
      {showModal && !realAd && (
        <AdModal
          ad={{ id: "default", topic, description, active: true }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
