const blacklist = [
  'of', 'to', 'is', 'in', 'on', 'it\'s', 'and', 'the', 'isnt', 'how', 'with', 'has', 'after', 'he', 'she', 'a', 'an', 'about', 'your', 'isnt', 'its', 'this', 'what', 'i', 'have', 'one', 'two', 'had', 'then', 'it', 'from', 'that', 'should', 'when', 'was', 'than', 'internalstorylineno', 'some', 'at', 'more', 'where', 'we', 'for', 'you', 'quiz', 'my', 'other', 'didnt', 'internal-sub-only-nl', 'be', 'are', 'not', 'gets', 'audio-neutral-informative', 'by', 'his', 'her', 'could', 'can', 'them', 'do', 'as', 'but', 'they', 'their', 'did', 'why', 'really'
];

const buildWordCloudData = (stories, topStories,) => {
  const wordList = [];
  const wordCloudData = [];
  const articleList = [];
  stories?.forEach((story, index,) => {
    story?.forEach((word,) => {
      const wordKey = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=_`~?’—‘]|(content type)|(\(.*\))/g, '',);
      const count = wordList[wordKey];
      const isReservedWord = typeof count === 'function';
      if (blacklist.includes(wordKey) || isReservedWord) return; // bail out here
      const articles = articleList?.[wordKey];
      const storyArticle = topStories?.[index];
      // A word can appear more than once in the same headline
      const isDuplicate = articles?.filter((article => article.headline === storyArticle.title)).length > 0;
      if (!isDuplicate) {
        articleList[wordKey] = [
          ...(articles ?? []),
          { headline: storyArticle.title, url: storyArticle.url, },
        ];
        wordList[wordKey] = count === undefined ? 1 : count + 1;
      }
    },);
  },);
  Object.keys(wordList,).forEach((key,) => {
    const count = wordList[key];
    if (count > 1) {
      wordCloudData.push({
        value: key,
        count: wordList[key],
        props: { links: articleList[key], },
      },);
    }
  },);
  return wordCloudData;
};

export default buildWordCloudData;
