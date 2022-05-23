import { TagCloud } from 'react-tagcloud'
import PropTypes from 'prop-types';
import styles from '../styles/Home.module.css'

const WordCloud = ({title, minSize, maxSize, tags, colorHue, onTagClick}) => (
  <>
    <h2>{title}</h2>
    <TagCloud
      minSize={minSize}
      maxSize={maxSize}
      tags={tags}
      className={styles.tagWrapper}
      colorOptions={{luminosity: 'light', hue: colorHue}}
      shuffle={false}
      randomSeed={12}
      onClick={onTagClick}
    />
  </>
);

WordCloud.propTypes = {
  title: PropTypes.string.isRequired,
  minSize: PropTypes.number.isRequired,
  maxSize: PropTypes.number.isRequired,
  tags: PropTypes.array.isRequired,
  colorHue: PropTypes.string.isRequired,
  onTagClick: PropTypes.func.isRequired,
};

export default WordCloud;
