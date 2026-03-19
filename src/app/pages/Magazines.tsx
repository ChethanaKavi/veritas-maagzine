import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Filter } from "lucide-react";
import { Advertisement } from "../components/Advertisement";

export function Magazines() {
  const [allMagazines, setAllMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  useEffect(() => { document.title = 'Magazines — Veritas Magazine'; }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/magazines?published=true');
        if (res.ok) {
          const data = await res.json();
          setAllMagazines(data);
        }
      } catch (e) {
        console.error('Failed to fetch magazines', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Extract unique months from magazines based on publishedAt
  const months = Array.from(
    new Set(allMagazines.map((mag) => {
      const date = new Date(mag.publishedAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }))
  ).sort().reverse();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getMonthDisplay = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  // Filter magazines by selected month
  const filteredMagazines = selectedMonth === "all"
    ? allMagazines
    : allMagazines.filter((mag) => {
        const date = new Date(mag.publishedAt);
        const magMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return magMonth === selectedMonth;
      });

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-6">Loading magazines...</div>;
  }

  return (
    <>
      <Advertisement area="top-banner" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link to="/" className="hover:text-blue-900 transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-blue-900 font-medium">Magazines</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1 text-blue-900">All Magazines</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Browse our complete collection of magazine issues
          </p>
        </div>

        {/* Month Filter Dropdown */}
        <div className="relative w-full md:w-auto">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-blue-900 pointer-events-none" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full md:w-48 pl-9 pr-8 py-2 text-sm border-2 border-blue-100 rounded-md focus:outline-none focus:border-blue-500 bg-white text-blue-900 cursor-pointer appearance-none shadow-sm hover:border-blue-300 transition-colors"
          >
            <option value="all">All Months</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {getMonthDisplay(month)}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-3.5 h-3.5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {filteredMagazines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {filteredMagazines.map((magazine) => (
            <div
              key={magazine.id}
              className="bg-white border-2 border-blue-200 rounded-lg overflow-hidden hover:shadow-xl transition-all hover:border-blue-400 flex flex-col h-full"
            >
              <div className="w-full aspect-[3/4] overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={magazine.coverImage}
                  alt={magazine.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                <div className="inline-block bg-blue-900 text-white text-xs px-3 py-1 rounded-full mb-3 w-fit">
                  {new Date(magazine.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-blue-900 line-clamp-2">{magazine.title}</h2>
                <p className="text-gray-600 mb-4 text-sm md:text-base line-clamp-2 flex-grow">
                  {magazine.description}
                </p>
                <Link
                  to={`/magazines/${encodeURIComponent(magazine.id)}`}
                  className="inline-block px-4 py-2 bg-blue-900 text-white text-sm rounded-md hover:bg-blue-800 transition-colors w-full text-center"
                >
                  View More
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No magazines found for the selected month.</p>
        </div>
      )}

      {/* Bottom strip ad */}
      <section className="mt-10">
        <Advertisement area="bottom-strip" />
      </section>
    </div>
    </>
  );
}