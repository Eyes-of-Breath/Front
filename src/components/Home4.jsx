import React from 'react';
import styles from './Home4.module.css';

const Home4 = () => {
  const quote = {
    text: "We find that large scale training trumps inductive bias, showing that pure Transformers can surpass convolutional networks when given sufficient data.",
    author: "Alexey Dosovitskiy et al., ViT (ICLR 2021)",
    highlight: "large scale training"
  };

  const renderQuoteText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ?
        <span key={index} className={styles.highlight}>{part}</span> :
        part
    );
  };

  return (
    <div className={`${styles.container} scene-content`}>
      <div className={styles.quoteContainer}>
        <div className={styles.quoteContent}>
          <div className={styles.quoteText}>
            {renderQuoteText(quote.text, quote.highlight)}
          </div>
          <div className={styles.author}>
            – {quote.author}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home4;