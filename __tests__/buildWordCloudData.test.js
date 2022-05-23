import '@testing-library/jest-dom';
import buildWordCloudData from '../utils/buildWordCloudData';

describe('buildWordCloudData', () => {
  it('returns an array of tag objects for trends of 2 or more', () => {
    const data = [
      ['Adventure', 'Romantic Comedy'],
      ['Science Fiction', 'Adventure'],
      ['Documentary', 'Crime'],
      ['Drama', 'Crime'],
      ['Thriller'],
      ['Adventure'],
    ];

    const topStories = [
      { title: 'The Lost City', url: 'https://www.nytimes.com' },
      { title: 'Star Wars: The Last Jedi', url: 'https://www.nytimes.com' },
      { title: 'The Jinx', url: 'https://www.nytimes.com' },
      { title: 'The Departed', url: 'https://www.nytimes.com' },
      { title: 'Parasite', url: 'https://www.nytimes.com' },
      { title: 'Onward', url: 'https://www.nytimes.com' },
    ];

    const wordCloudData = buildWordCloudData(data, topStories);
    expect(wordCloudData.length).toBe(2); // Adventure and Crime only
    expect(wordCloudData[0].value).toBe('adventure');
    expect(wordCloudData[0].count).toBe(3); // 3 instances of Adventure
    expect(wordCloudData[0].props.links).toHaveLength(3);
    expect(wordCloudData[1].value).toBe('crime');
    expect(wordCloudData[1].count).toBe(2); // 2 instances of Crime
    expect(wordCloudData[1].props.links).toHaveLength(2);
  });

  it('considers matches regardless of punctuation', () => {
    const data = [
      ['Summer'],
      ['Summer:'],
      ['Summer,'],
    ];

    const topStories = [
      { title: 'Summer Travel Stagnates as Covid Cases Rise', url: 'https://www.nytimes.com' },
      { title: 'Barbecue Dishes for Summer: Our Top Picks', url: 'https://www.nytimes.com' },
      { title: 'Winter, Spring, Summer, Fall', url: 'https://www.nytimes.com' },
    ];

    const wordCloudData = buildWordCloudData(data, topStories);
    expect(wordCloudData.length).toBe(1);
    expect(wordCloudData[0].value).toBe('summer');
    expect(wordCloudData[0].count).toBe(3);
    expect(wordCloudData[0].props.links).toHaveLength(3);
  });

  it('does not include blacklisted words as trends', () => {
    const data = [
      ['Of', 'mice', 'and', 'men'],
      ['The', 'mice'],
      ['The', 'men'],
      ['The', 'Men', 'and', 'Women', 'of', 'Steinbeck', 'Novels'],
      ['John', 'Steinbeck'],
    ];

    const topStories = [
      { title: 'Of mice and men', url: 'https://www.nytimes.com' },
      { title: 'The mice', url: 'https://www.nytimes.com' },
      { title: 'The men', url: 'https://www.nytimes.com' },
      { title: 'The Men and Women of Steinbeck Novels', url: 'https://www.nytimes.com' },
      { title: 'John Steinbeck', url: 'https://www.nytimes.com' },
    ];

    const wordCloudData = buildWordCloudData(data, topStories);
    expect(wordCloudData.length).toBe(3); // Mice, Men, Steinbeck
    expect(wordCloudData[0].value).toBe('mice');
    expect(wordCloudData[0].count).toBe(2);
    expect(wordCloudData[0].props.links).toHaveLength(2);
    expect(wordCloudData[1].value).toBe('men');
    expect(wordCloudData[1].count).toBe(3);
    expect(wordCloudData[1].props.links).toHaveLength(3);
    expect(wordCloudData[2].value).toBe('steinbeck');
    expect(wordCloudData[2].count).toBe(2);
    expect(wordCloudData[2].props.links).toHaveLength(2);
  });

  it('does not include instances of more than 1 word per headline', () => {
    const topStories = [
      { title: 'Dan Levy Presents Award to Father Eugene Levy', url: 'https://www.nytimes.com' },
    ];

    const wordCloudData = buildWordCloudData(topStories.map(story => story.title.split(' ')), topStories);
    expect(wordCloudData.length).toBe(0);
  });
});
