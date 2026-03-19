import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Advertisement } from "../components/Advertisement";

export function Articles() {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  const [allArticles, setAllArticles] = useState<any[]>([]);

  useEffect(() => { document.title = 'Articles — Veritas Magazine'; }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/articles?published=true');
        if (res.ok) {
          const data = await res.json();
          setAllArticles(data || []);
        }
      } catch (e) {
        console.error('Failed to fetch articles', e);
      }
    })();
  }, []);

  // No filter, use all fetched articles
  const filteredArticles = allArticles;

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link to="/" className="hover:text-blue-900 transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-blue-900 font-medium">Articles</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-blue-900">All Articles</h1>
      <p className="text-gray-600 mb-6 text-sm md:text-base">
        Explore our complete collection of articles across all magazines
      </p>

      <div className="flex gap-6 items-start">
        {/* Left sidebar ad */}
        <div className="hidden xl:block w-56 flex-shrink-0">
          <Advertisement area="left-sidebar" />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Articles Grid */}
          {currentArticles.length > 0 ? (
            <>
              <div className="mb-12">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {currentArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No articles found matching your search.</p>
            </div>
          )}
        </div>

        {/* Right sidebar ad */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <Advertisement area="sidebar" />
        </div>
      </div>

      {/* Bottom strip ad */}
      <section className="mt-10">
        <Advertisement area="bottom-strip" />
      </section>
    </div>
  );
}