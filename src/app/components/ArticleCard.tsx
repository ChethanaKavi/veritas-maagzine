import { Link } from "react-router-dom";

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
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
      {/* Fixed height image so it never dominates on mobile */}
      <div className="h-36 sm:h-40 overflow-hidden flex-shrink-0">
        <img
          src={imageSrc}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 sm:p-4 flex-1 overflow-hidden">
        <h3 className="text-sm sm:text-base font-semibold mb-1 group-hover:text-blue-600 transition-colors text-blue-900 line-clamp-2 break-all">
          {article.title}
        </h3>
        <p className="text-gray-600 line-clamp-2 text-xs sm:text-sm break-all">{excerpt}</p>
      </div>
    </Link>
  );
}