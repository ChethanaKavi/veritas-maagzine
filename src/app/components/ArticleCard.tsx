import { Link } from "react-router-dom";

function stripHtml(html: string) {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&hellip;/gi, "...")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface ArticleCardProps {
  article: any;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const imageSrc = article.coverImgUrl || article.image || '';
  const excerpt = article.excerpt || stripHtml(article.content || '').slice(0, 140);

  return (
    <Link
      to={`/articles/${article.id}`}
      className="group flex flex-col bg-white border-2 border-blue-200 rounded-lg overflow-hidden hover:shadow-xl transition-all hover:border-blue-400"
    >
      {/* Image */}
      <div className="h-44 sm:h-40 overflow-hidden flex-shrink-0 bg-blue-50">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.img-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'img-fallback w-full h-full flex items-center justify-center bg-blue-100';
                fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 flex-1 overflow-hidden">
        <h3
          className="text-sm sm:text-base font-semibold mb-1 group-hover:text-blue-600 transition-colors text-blue-900 line-clamp-2"
          style={{ overflowWrap: 'anywhere' }}
        >
          {article.title}
        </h3>
        <p
          className="text-gray-600 line-clamp-2 text-xs sm:text-sm"
          style={{ overflowWrap: 'anywhere' }}
        >
          {excerpt}
        </p>
      </div>
    </Link>
  );
}