import type { Metadata } from 'next'
import { formatTitle } from '#/utils'
import { getArchiveData } from './_data'
import { CardCover } from './CardCover'
import { TransitionLink } from './Link'

export const metadata: Metadata = {
  title: formatTitle('归档'),
  description: '潮起潮落-归档'
}

export default async function Page() {
  const articles = await getArchiveData()

  return (
    <div className="archive-page" data-page="archive">
      <div className="cards-container">
        <ul className="cards">
          {articles.map((item, index) => (
            <li className="card-item" key={index}>
              <TransitionLink to={`/docs/${item.path}`}>
                <article className="card relative">
                  <figure className="card-content">
                    <CardCover src={item.cover} />
                    <figcaption className="card-summary">
                      <p className="truncate text-center font-bold text-8 text-brand leading-12 tracking-px lg:text-4 lg:leading-8">
                        {item.title}
                      </p>
                      <p className="flex items-center gap-2 p-4 text-base text-brand-2 lg:p-2 lg:text-sm">
                        {item.tags?.map((tag, idx) => (
                          <span key={idx}>{`#${tag}`}</span>
                        ))}
                        <span className="flex-1"></span>
                      </p>
                    </figcaption>
                  </figure>
                  <div className="card-mask"></div>
                </article>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden="true" className="chain" data-pos="bs"></div>
      <div aria-hidden="true" className="chain" data-pos="be"></div>
      <div aria-hidden="true" className="shadow-mask" data-pos="is"></div>
      <div aria-hidden="true" className="shadow-mask" data-pos="ie"></div>
      <div aria-hidden="true" className="indicator"></div>
    </div>
  )
}
