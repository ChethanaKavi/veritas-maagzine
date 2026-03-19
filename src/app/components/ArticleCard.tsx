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
      className="group block bg-white border-2 border-blue-200 rounded-lg overflow-hidden hover:shadow-xl transition-all hover:border-blue-400"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={imageSrc}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors text-blue-900 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 line-clamp-2 text-sm sm:text-base">{excerpt}</p>
      </div>
    </Link>
  );
}