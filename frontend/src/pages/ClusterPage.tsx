import { Link, Navigate, useParams } from 'react-router-dom';
import { clusterBySlug, clusters, getClusterArticles } from '../content/seoContent';
import { useSeo } from '../seo/useSeo';

export default function ClusterPage() {
  const { clusterSlug } = useParams();
  const safeSlug = clusterSlug || '';
  const cluster = clusterBySlug[safeSlug];

  if (!cluster) {
    return <Navigate to="/kien-thuc" replace />;
  }

  const spokeArticles = getClusterArticles(cluster.slug);
  const relatedClusters = clusters.filter((item) => item.slug !== cluster.slug);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cluster.title,
    description: cluster.shortDescription,
    url: `https://vistapatientjourney.vn/kien-thuc/${cluster.slug}`,
    inLanguage: 'vi-VN',
  };

  useSeo({
    title: `${cluster.title} | Topic cluster VISTA`,
    description: cluster.shortDescription,
    path: `/kien-thuc/${cluster.slug}`,
    schema,
  });

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <nav className="text-sm text-slate-600 mb-4">
          <Link to="/" className="hover:text-slate-900">Trang chu</Link>
          <span className="mx-2">/</span>
          <Link to="/kien-thuc" className="hover:text-slate-900">Trung tam kien thuc</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{cluster.title}</span>
        </nav>

        <header className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <p className="text-xs uppercase tracking-wide font-semibold text-blue-700">Cluster hub</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{cluster.title}</h1>
          <p className="text-slate-600 mt-3 leading-relaxed">{cluster.shortDescription}</p>
          <p className="mt-4 text-sm text-slate-500">Tu khoa tru cot: {cluster.keyword}</p>
        </header>

        <section className="mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Bai spoke trong cluster</h2>
          <div className="space-y-3">
            {spokeArticles.map((article) => (
              <article key={article.slug} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">{article.title}</h3>
                <p className="text-sm text-slate-600 mt-2">{article.description}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <Link
                    to={`/kien-thuc/${article.clusterSlug}/${article.slug}`}
                    className="font-semibold text-blue-700 hover:text-blue-800"
                  >
                    Doc bai chi tiet
                  </Link>
                  <Link to="/knowledge" className="text-slate-700 hover:text-slate-900">
                    Thu cong cu trai nghiem AI
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="mt-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Lien ket noi bo lien quan</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {relatedClusters.map((item) => (
              <Link
                key={item.slug}
                to={`/kien-thuc/${item.slug}`}
                className="px-3 py-2 rounded-lg bg-slate-100 text-slate-800 text-sm hover:bg-slate-200"
              >
                {item.title}
              </Link>
            ))}
            <Link to="/explore" className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm hover:bg-blue-100">
              Quiz - Podcast - Video
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
