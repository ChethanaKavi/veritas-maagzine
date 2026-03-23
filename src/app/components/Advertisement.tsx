import { useEffect, useState } from 'react';
import apiClient from '../utils/api';

interface AdvertisementProps {
  area: string;
  className?: string;
}

interface Ad {
  id: string;
  topic: string;
  description: string;
  webImage: string;
  tabImage: string;
  mobileImage: string;
  link: string;
  active: boolean;
}

export function Advertisement({ area, className = "" }: AdvertisementProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/advertisements');
        const allAds = response.data || [];
        
        // Filter ads for the specific area and that are active
        const areaAds = allAds.filter((ad: Ad) => ad.area === area && ad.active);
        setAds(areaAds);
      } catch (err) {
        console.error('Error fetching advertisements:', err);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [area]);

  // If no ads, show nothing
  if (loading || !ads.length) {
    return null;
  }

  // Show the first ad for this area
  const ad = ads[0];
  const imageUrl = ad.webImage || ad.tabImage || ad.mobileImage;

  if (!imageUrl) {
    return null;
  }

  return (
    <div className={`max-w-xs mx-auto ${className}`}>
      {ad.link && ad.link !== '#' ? (
        <a 
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-90 transition-opacity"
        >
          <img
            src={imageUrl}
            alt={ad.topic}
            className="w-full h-32 object-cover rounded-lg"
          />
        </a>
      ) : (
        <div className="block">
          <img
            src={imageUrl}
            alt={ad.topic}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}
      {ad.topic && (
        <div className="mt-1 p-1.5 bg-gray-50 rounded">
          <h4 className="font-semibold text-xs text-gray-900">{ad.topic}</h4>
          {ad.description && (
            <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{ad.description}</p>
          )}
        </div>
      )}
    </div>
  );
}