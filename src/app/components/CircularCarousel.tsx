import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";

interface CircularCarouselProps {
  articles: any[];
  compact?: boolean;
}

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function CircularCarousel({ articles, compact = false }: CircularCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 3500); // Slightly slower rotation

    return () => clearInterval(interval);
  }, [articles.length]);

  if (articles.length === 0) return null;

  const currentArticle = articles[currentIndex];

  const getArticleStyle = (index: number) => {
    const total = articles.length;
    const angle = ((index - currentIndex + total) % total) * (360 / total);
    const radius = compact ? 90 : 120; // smaller radius when compact
    const x = Math.sin((angle * Math.PI) / 180) * radius;
    const y = -Math.cos((angle * Math.PI) / 180) * radius;

    const isTop = index === currentIndex;
    const scale = isTop ? 1.1 : 0.6; // Higher contrast in size
    const opacity = isTop ? 1 : 0.5;
    const filter = isTop ? "grayscale(0%)" : "grayscale(100%)";
    const zIndex = isTop ? 10 : 1;

    return { x, y, scale, opacity, filter, zIndex };
  };

    return (
    <div className="w-full flex flex-col items-center">
      {/* ── Orbit area ── */}
      <div className={`relative w-full ${compact ? 'h-[220px]' : 'h-[360px]'} flex items-center justify-center`}>
      {/* visible circular track with subtle background */}
      <div className={`absolute ${compact ? 'w-[180px] h-[180px]' : 'w-[260px] h-[260px]'} rounded-full`}
           style={{
             background: 'radial-gradient(circle at center, rgba(255,255,255,0.04), transparent 60%)',
             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 10px 30px rgba(2,6,23,0.15)'
           }}
      />
      <div className={`absolute ${compact ? 'w-[180px] h-[180px]' : 'w-[260px] h-[260px]'} rounded-full border-2 border-dashed border-white/30`} />
      {/* decorative arrow to indicate rotation direction */}
      <div className="absolute top-6 right-[calc(50%-120px)] text-white/80 rotate-12">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* Articles */}
      {articles.map((article, index) => {
        const style = getArticleStyle(index);
        const isTop = index === currentIndex;

        return (
          <motion.div
            key={article.id}
            animate={{
              x: style.x,
              y: style.y,
              scale: style.scale,
              opacity: style.opacity,
              filter: style.filter,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            style={{
              position: "absolute",
              zIndex: style.zIndex,
            }}
            className={`${compact ? 'w-20 h-20' : 'w-28 h-28'}`}
          >
            <Link to={`/articles/${article.id}`} className="relative group">
              <img
                src={article.coverImgUrl || article.image || ''}
                alt={article.title}
                className={`w-full h-full rounded-full object-cover transition-all duration-300 ${isTop ? 'ring-4 ring-white/60' : 'border-4 border-white/20'}`}
                style={{
                  filter: style.filter,
                  transform: undefined,
                  boxShadow: isTop
                    ? "0 8px 30px rgba(59,130,246,0.25)"
                    : "0 4px 15px rgba(0,0,0,0.12)",
                }}
              />
              {/* Title on Hover for non-active items */}
              {!isTop && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs text-center p-2 line-clamp-2">
                    {article.title}
                  </p>
                </div>
              )}
            </Link>
          </motion.div>
        );
      })}
      </div>

      {/* ── Info card: rendered in normal flow BELOW the orbit ──
          This avoids the card being lifted by the active circle's
          CSS transform (y: -90px) which caused it to appear near the navbar. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentArticle.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className={`${compact ? 'w-44 p-2' : 'w-64 p-4'} bg-white rounded-lg shadow-2xl border border-blue-100 mt-2`}
        >
          <h4 className={`font-bold ${compact ? 'text-[11px]' : 'text-sm md:text-base'} mb-1 text-blue-900 line-clamp-2 leading-tight`}>
            {currentArticle.title}
          </h4>
          <p className={`text-gray-700 line-clamp-2 ${compact ? 'text-[9px]' : 'text-[11px]'}`}>
            {currentArticle.excerpt || stripHtml(currentArticle.content || '').slice(0, 120)}
          </p>
          <Link
            to={`/articles/${currentArticle.id}`}
            className={`mt-1 font-semibold hover:underline text-blue-600 ${compact ? 'text-[9px]' : 'text-[11px]'} block`}
          >
            Read More →
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
