import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { CircularCarousel } from "../components/CircularCarousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MagazineDetail() {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [magazine, setMagazine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [magazineArticles, setMagazineArticles] = useState<any[]>([]);
  const articlesPerPage = 5;

  // Fetch magazine from database
  useEffect(() => {
    if (!id) {
      setError('No magazine ID provided');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        console.log('Loading magazine id:', id);
        const decodedId = decodeURIComponent(id);
        const res = await fetch(`/api/magazines/${decodedId}`);
        if (!res.ok) {
          setError(`Failed to load magazine (${res.status})`);
          setMagazine(null);
        } else {
          const data = await res.json();
          console.log('Magazine data:', data);
          setMagazine(data);
          setError(null);
        }
      } catch (e) {
        console.error('Failed to fetch magazine', e);
        setError('Failed to load magazine');
        setMagazine(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Scroll to top when component loads or id changes - MUST be before early returns
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);
  // Fetch published articles for this magazine from backend
  useEffect(() => {
    (async () => {
      if (!magazine?.id) return;
      try {
        const res = await fetch(`/api/articles?published=true&magazineId=${magazine.id}`);
        if (res.ok) {
          const data = await res.json();
          setMagazineArticles(data.value || data || []);
        } else {
          setMagazineArticles([]);
        }
      } catch (e) {
        console.error('Failed to fetch magazine articles', e);
        setMagazineArticles([]);
      }
    })();
  }, [magazine?.id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-6">Loading...</div>;
  }

  if (error || !magazine) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <p className="text-red-600 mb-4">{error || 'Magazine not found'}</p>
        <Link to="/magazines" className="text-blue-600 hover:underline">Back to Magazines</Link>
      </div>
    );
  }

  // Pagination
  const totalPages = Math.ceil(magazineArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = magazineArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Magazine Feature (same layout as Home) */}
      <section className="mb-8 -mt-8">
        <div className="rounded-2xl p-4 md:p-6">
          <div className="grid lg:grid-cols-2 gap-0 items-start min-h-[60vh] lg:min-h-[75vh]">
            {/* Left Side - Magazine Cover */}
              <div className="flex justify-center lg:justify-start mt-0 relative overflow-hidden">
              <div className="absolute top-6 left-6 z-10">
                {/* <span className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide backdrop-blur-sm border border-white/20">
                  Latest Magazine
                </span> */}
              </div>
              <img
                src={magazine.coverImage}
                alt={magazine.title}
                className="w-full max-w-md rounded-lg shadow-2xl border-2 border-white object-cover h-[45vh] md:h-[55vh] lg:h-[65vh]"
              />
            </div>

            {/* Right Side - Description and Circular Carousel */}
            <div className="flex flex-col justify-between h-full mt-0">
              <div
                className="relative rounded-none border-l-4 border-blue-900 bg-white shadow-sm md:-ml-6 lg:-ml-12 pl-3 h-full flex-1"
                style={{
                  backgroundImage: `url(${magazine.coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-white/80" />
                <div className="relative p-6 h-full flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="h-px w-6 bg-blue-900/50"></span>
                    <span className="text-blue-900 text-xs font-bold uppercase tracking-[0.2em] font-sans">
                      {magazine.publishedAt ? new Date(magazine.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Issue'}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-4 md:mb-6 text-blue-900 tracking-tight leading-[1.05]">
                    {magazine.title}
                  </h2>
                  <p className="text-gray-800 mb-6 text-base md:text-lg font-light leading-relaxed max-w-lg">
                    {magazine.description}
                  </p>
                  <a
                    href="#articles"
                    className="group inline-flex items-center gap-2 text-blue-900 font-bold uppercase tracking-wider text-sm border-b-2 border-blue-900 pb-1 hover:text-blue-700 hover:border-blue-700 transition-all"
                  >
                    Read Full Magazine
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>

              {/* Circular Article Carousel */}
              <div className="mt-8 flex items-center justify-start gap-4 relative pl-4 pb-2">
                <h3 className="text-xl font-bold text-blue-900 whitespace-nowrap z-10 shrink-0">
                  Featured Articles
                </h3>
                <div className="w-48 md:w-64 relative z-50 transform translate-y-1">
                  <CircularCarousel articles={magazineArticles} compact />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Magazine Articles */}
      <section id="articles">
        <h2 className="text-3xl font-bold mb-8 text-blue-900">Articles in This Issue</h2>

        {magazineArticles.length === 0 ? (
          <p className="text-gray-600 text-center py-12">
            No articles available for this magazine yet.
          </p>
        ) : (
          <>
            {/* Articles Grid - show first row like home */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
              {currentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border-2 border-blue-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-blue-900" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      currentPage === page
                        ? "bg-blue-900 text-white"
                        : "border-2 border-blue-200 text-blue-900 hover:bg-blue-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border-2 border-blue-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-blue-900" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}