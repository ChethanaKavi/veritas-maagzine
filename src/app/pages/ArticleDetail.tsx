import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Advertisement } from "../components/Advertisement";
import { Clock, User, Calendar } from "lucide-react";

export function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<any | null>(null);
  const [magazine, setMagazine] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
          if (data.magazineId) {
            const m = await fetch(`/api/magazines/${data.magazineId}`);
            if (m.ok) setMagazine(await m.json());
          }
        }
      } catch (e) {
        console.error('Failed to load article', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  // Track view in DB (once per browser session per article)
  useEffect(() => {
    if (!article?.id) return;

    // Set page title so GA4 "Pages and screens" shows the article name
    document.title = `${article.title} — Veritas Magazine`;

    // Fire GA4 page_view with article title
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: `${article.title} — Veritas Magazine`,
        page_path: `/articles/${article.id}`,
        page_location: window.location.href,
      });
    }

    const sessionKey = `viewed_article_${article.id}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, '1');

    // Save view to DB
    fetch(`/api/articles/${article.id}/view`, { method: 'POST' })
      .then((r) => r.json())
      .then((data) => console.log(`[View] Article DB viewCount: ${data.viewCount}`))
      .catch(() => {});

    // Fire GA4 custom event with article details
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'article_view', {
        article_id: article.id,
        article_title: article.title,
        magazine_title: magazine?.title || '',
      });
    }
  }, [article?.id, magazine?.title]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12">Loading...</div>;
  if (!article) return <Navigate to="/articles" replace />;

  return (
    <>
      <Advertisement area="top-banner" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Article Header */}
      <article>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-blue-900">{article.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{article.excerpt || ''}</p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 pb-6 mb-8 border-b-2 border-blue-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 text-blue-600" />
            <span>{article.author?.name || article.authorId || 'Author'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</span>
          </div>
        </div>

        {/* Featured Image */}
        {article.coverImgUrl && (
        <div className="mb-8 rounded-lg overflow-hidden border-4 border-blue-100">
          <img
            src={article.coverImgUrl}
            alt={article.title}
            className="w-full h-auto"
          />
        </div>
        )}

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: article.content || '' }}
        />
      </article>

      {/* Advertisement */}
      <section className="mb-12">
        <Advertisement area="inline-content" />
      </section>

      {/* Related Magazine */}
      {magazine && (
        <section className="bg-blue-50 rounded-lg p-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">From This Issue</h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            <img
              src={magazine.coverImage}
              alt={magazine.title}
              className="w-full sm:w-32 h-48 object-cover rounded shadow-lg border-4 border-white"
            />
            <div className="flex-1">
              <div className="inline-block bg-blue-900 text-white text-xs px-3 py-1 rounded-full mb-2">
                {magazine.issue}
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-900">{magazine.title}</h3>
              <p className="text-gray-600 mb-4">{magazine.description}</p>
              <Link
                to={`/magazines/${magazine.id}`}
                className="inline-block px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
              >
                View Full Issue
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
    </>
  );
}