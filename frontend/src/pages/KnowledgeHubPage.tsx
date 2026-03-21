import { Link } from 'react-router-dom';
import { articles, clusters } from '../content/seoContent';
import { useSeo } from '../seo/useSeo';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Trang chu',
      item: 'https://vistapatientjourney.vn/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Trung tam kien thuc mat',
      item: 'https://vistapatientjourney.vn/kien-thuc',
    },
  ],
};

export default function KnowledgeHubPage() {
  useSeo({
    title: 'Trung tam kien thuc mat | Hub SEO VISTA',
    description:
      'Tong hop 3 cluster noi dung uu tien va 5 bai long-tail dau tien de mo rong traffic tu nhien cho chu de suc khoe mat.',
    path: '/kien-thuc',
    schema: breadcrumbSchema,
  });

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">SEO Hub</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Trung tam kien thuc suc khoe mat
          </h1>
          <p className="text-slate-600 mt-3 leading-relaxed">
            Cac trang duoi day duoc to chuc theo mo hinh hub-spoke de tang topical authority va internal link cho website.
          </p>
        </div>

        <section className="mt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">3 cluster uu tien</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {clusters.map((cluster) => (
              <article key={cluster.slug} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase text-blue-700">Cluster</p>
                <h3 className="text-lg font-semibold text-slate-900 mt-1">{cluster.title}</h3>
                <p className="text-sm text-slate-600 mt-2">{cluster.shortDescription}</p>
                <p className="text-xs text-slate-500 mt-3">Tu khoa tru cot: {cluster.keyword}</p>
                <Link
                  to={`/kien-thuc/${cluster.slug}`}
                  className="inline-flex items-center mt-4 text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  Xem cluster
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">5 bai long-tail da xuat ban</h2>
          <div className="space-y-3">
            {articles.map((article) => (
              <article key={article.slug} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                    {article.longTailKeyword}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">{article.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{article.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <Link
                    to={`/kien-thuc/${article.clusterSlug}/${article.slug}`}
                    className="font-semibold text-blue-700 hover:text-blue-800"
                  >
                    Doc bai viet
                  </Link>
                  <Link to={`/kien-thuc/${article.clusterSlug}`} className="text-slate-700 hover:text-slate-900">
                    Ve trang cluster
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
