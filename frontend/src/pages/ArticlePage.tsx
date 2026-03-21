import { Link, Navigate, useParams } from 'react-router-dom';
import { articleBySlug, clusterBySlug, getClusterArticles } from '../content/seoContent';
import { useSeo } from '../seo/useSeo';

export default function ArticlePage() {
  const { clusterSlug, articleSlug } = useParams();
  const safeClusterSlug = clusterSlug || '';
  const safeArticleSlug = articleSlug || '';
  const article = articleBySlug[`${safeClusterSlug}/${safeArticleSlug}`];

  if (!article) {
    return <Navigate to="/kien-thuc" replace />;
  }

  const cluster = clusterBySlug[article.clusterSlug];
  const relatedArticles = getClusterArticles(article.clusterSlug).filter((item) => item.slug !== article.slug);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    inLanguage: 'vi-VN',
    url: `https://vistapatientjourney.vn/kien-thuc/${article.clusterSlug}/${article.slug}`,
    author: {
      '@type': 'Organization',
      name: 'VISTA Patient Journey',
    },
    publisher: {
      '@type': 'Organization',
      name: 'VISTA Patient Journey',
    },
    keywords: [article.longTailKeyword, cluster?.keyword || 'suc khoe mat'],
  };

  useSeo({
    title: `${article.title} | VISTA`,
    description: article.description,
    path: `/kien-thuc/${article.clusterSlug}/${article.slug}`,
    schema: [articleSchema, faqSchema],
  });

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <nav className="text-sm text-slate-600 mb-4">
          <Link to="/" className="hover:text-slate-900">Trang chu</Link>
          <span className="mx-2">/</span>
          <Link to="/kien-thuc" className="hover:text-slate-900">Trung tam kien thuc</Link>
          <span className="mx-2">/</span>
          <Link to={`/kien-thuc/${article.clusterSlug}`} className="hover:text-slate-900">
            {cluster?.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">Bai viet</span>
        </nav>

        <article className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Long-tail keyword</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{article.title}</h1>
          <p className="text-slate-600 mt-3 leading-relaxed">{article.description}</p>
          <p className="mt-3 text-sm text-slate-500">Tu khoa chinh: {article.longTailKeyword}</p>

          <div className="mt-8 space-y-7">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold text-slate-900">{section.heading}</h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-slate-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-9 pt-6 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Cau hoi thuong gap</h2>
            <div className="mt-4 space-y-4">
              {article.faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                  <p className="text-slate-700 mt-2">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <aside className="mt-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Internal links theo hub-spoke</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link to="/kien-thuc" className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100">
              Ve hub kien thuc
            </Link>
            <Link
              to={`/kien-thuc/${article.clusterSlug}`}
              className="px-3 py-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              Ve trang cluster
            </Link>
            <Link to="/knowledge" className="px-3 py-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200">
              Trai nghiem AI mo phong thi giac
            </Link>
            <Link to="/journey" className="px-3 py-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200">
              Minh chung trien khai thuc te
            </Link>
          </div>

          {relatedArticles.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-slate-900">Bai lien quan cung cluster</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {relatedArticles.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={`/kien-thuc/${item.clusterSlug}/${item.slug}`}
                      className="text-blue-700 hover:text-blue-800 font-medium"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
