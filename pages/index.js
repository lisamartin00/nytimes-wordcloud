import styles from '../styles/Home.module.css'
import { useState } from 'react'
import WordCloud from '../components/WordCloud'
import Modal from '../components/Modal'
import buildWordCloudData from '../utils/buildWordCloudData';

export default function Home({topStories}) {
  const headlineTags = buildWordCloudData(topStories.map(story => story.title.split(' ')), topStories);

  const categoryTags = buildWordCloudData(topStories.map(story => story.des_facet, topStories), topStories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tag, setTag] = useState();

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const handleTagClick = (tag) => {
    setIsModalOpen(true);
    setTag(tag);
  }

  return (
    <div className={styles.container}>
      <h1>NY Times World Cloud</h1>
      <p className="subtitle">{`Generated from the top stories of ${today}`}</p>
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
    </div>
  )
}

export async function getStaticProps() {
  const topStoriesRes = await fetch(`https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${process.env.API_KEY}`);
  const topStoriesJson = await topStoriesRes.json();

  return {
    props: {
      topStories: topStoriesJson.results,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 minutes
    revalidate: 600, // In seconds
  }
}