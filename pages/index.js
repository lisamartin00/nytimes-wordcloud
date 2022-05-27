import styles from '../styles/Home.module.css'
import { useState } from 'react'
import WordCloud from '../components/WordCloud'
import Modal from '../components/Modal'
import buildWordCloudData from '../utils/buildWordCloudData';
import Head from 'next/head';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home() {
  const { data, error } = useSWR(`https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${process.env.NEXT_PUBLIC_API_KEY}`, fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tag, setTag] = useState();

  if (error) return <div>Failed to load</div>

  const topStories = data?.results;
  const headlineTags = buildWordCloudData(topStories?.map(story => story.title.split(' ')), topStories);

  const categoryTags = buildWordCloudData(topStories?.map(story => story.des_facet, topStories), topStories);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const handleTagClick = (tag) => {
    setIsModalOpen(true);
    setTag(tag);
  }

  const title = 'NY Times Word Cloud';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={styles.container}>
        <h1>{title}</h1>
        <p className="subtitle">{`Generated from the top stories of ${today}`}</p>
        { !data && <div className="loader"></div> }
        { data && (
        <>
          <WordCloud
            title="Headlines"
            minSize={99}
            maxSize={150}
            tags={headlineTags}
            colorHue="blue"
            onTagClick={handleTagClick}
          />
          <WordCloud
            title="Categories"
            minSize={36}
            maxSize={72}
            tags={categoryTags}
            colorHue="orange"
            onTagClick={handleTagClick}
          />
          <Modal
            isOpen={isModalOpen}
            closeModal={() => setIsModalOpen(false)}
            title={`"${tag?.value}"`}
          >
            {tag?.props?.links?.map(link => (
              <p key={link.headline}>
                <a href={link.url} target="_blank" rel="noreferrer">{link.headline}</a>
              </p>
            ))}
          </Modal>
        </>
      )}
      </div>
    </>
  )
}
