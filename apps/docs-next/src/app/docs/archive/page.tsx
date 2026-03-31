import type { Metadata } from 'next'
import { formatTitle } from '#/utils'
import { getArchiveData } from './_data'
import { CardCover } from './CardCover'
import { TransitionLink } from './Link'
import 'ebb-ui/pages/archive.css'

export const metadata: Metadata = {
  title: formatTitle('归档'),
  description: '潮起潮落-归档'
}

export default async function Page() {
  const articles = await getArchiveData()

  return (
    <div className="archive-page">
      <div className="chain top-[--offset]"></div>
      <div className="chain bottom-[--offset]" data-reverse="true"></div>
      <div className="cards-container">
        <ul className="cards">
          {articles.map((item, index) => (
            <li key={index}>
              <TransitionLink to={`/docs/${item.path}`}>
                <CardCover src={item.cover} />
                <div className="p-2 bg-black">
                  <p className="leading-6 font-bold mb-2 text-center truncate">
                    {item.title}
                  </p>
                </div>
                <div className="p-2 bg-black/60 inset-x-0 bottom-10 absolute">
                  <p className="text-xs flex gap-2 items-center">
                    {item.tags?.map((tag, idx) => (
                      <span key={idx}>{`#${tag}`}</span>
                    ))}
                    <span className="flex-1"></span>
                  </p>
                </div>
                <div
                  className="card-mask inset-0 absolute z-10"
                  data-role="mask"
                ></div>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
