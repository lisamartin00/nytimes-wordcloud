import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import useSWR from 'swr'
import { TagCloud } from 'react-tagcloud'
import { useState } from 'react'

export default function Home({topStories}) {
  // TODO: don't iterate over these twice.  build a nice object that has an array of words to use, the original article headlines, and links to the articles.  then, we can build tags and also build link lists to click on and see
  
  const headlineTags = buildWordCloudData(topStories.map(story => story.title.split(' ')), topStories);

  const categoryTags = buildWordCloudData(topStories.map(story => story.des_facet, topStories), topStories);
  console.log({topStories});
  const [showModal, setShowModal] = useState(false);
  const [tag, setTag] = useState();

  const handleTagClick = (tag) => {
    setShowModal(true);
    setTag(tag);
  }

  return (
    <div className={styles.container}>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.closeModalButton} role="button" aria-pressed="false" onClick={() => setShowModal(false)}>&times;</div>
          <h2>{`"${tag.value}"`}</h2>
          {tag.props.links.map(link => (
            <p key={link.headline}>
              <a href={link.url} target="_blank" rel="noreferrer">{link.headline}</a>
            </p>
          ))}
        </div>
      )}
      <h1>NY Times Top Stories</h1>
      <h2>Headlines</h2>
        <TagCloud
          minSize={99}
          maxSize={150}
          tags={headlineTags}
          className={styles.tagWrapper}
          colorOptions={{luminosity: 'light', hue: 'blue'}}
          onClick={handleTagClick}
          shuffle={false}
        />
      <h2>Categories</h2>
      <TagCloud
        minSize={36}
        maxSize={72}
        tags={categoryTags}
        className={styles.tagWrapper}
        onClick={handleTagClick}
        colorOptions={{luminosity: 'light', hue: 'orange'}}
        shuffle={false}
      />
    </div>
  )
}

const blacklist = ['of', 'to', 'is', 'in', 'on', 'it\'s', 'and', 'the', 'isnt', 'how', 'with', 'has', 'after', 'he', 'she', 'a', 'an', 'about', 'your', 'isnt', 'its', 'this', 'what', 'i', 'have', 'one', 'two', 'had', 'then', 'it', 'from', 'that', 'should', 'when', 'was', 'than', 'internalsubonlynl', 'internalstorylineno', 'some', 'at', 'more', 'where', 'we'];

function buildWordCloudData(stories, topStories) {
  let wordList = [];
  let wordCloudData = [];
  let articleList = [];
  stories.forEach((story, index) => {
    story.forEach(word => {
      let wordKey = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=_`~?’—]|(content type)|(\(.*\))/g,'');
      if (blacklist.includes(wordKey)) return; // bail out here
      let count = wordList[wordKey];
      let isReservedWord = typeof count == 'function';
      let articles = articleList[wordKey];
      let storyArticle = topStories[index];
      if(!isReservedWord) {
        articleList[wordKey] = [
          ...(articles ?? []),
          {headline: storyArticle.title, url: storyArticle.url},
        ];
        wordList[wordKey] = count == undefined ? 1 : count + 1;
      }
      else {
        console.log(`reserved word found: "${wordKey}"`);
      }
    });
  });
  Object.keys(wordList).forEach(key => {
    let count = wordList[key];
    if (count > 1) {
      wordCloudData.push({value: key, count: wordList[key], props: {links: articleList[key]}});
    }
  });
  return wordCloudData;
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