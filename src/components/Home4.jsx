import React from 'react';
import styles from './Home4.module.css';

const Home4 = () => {
  const quote = {
    text: "Artificial intelligence will not replace doctors, but doctors who use AI will replace doctors who don't.",
    author: "Bertalan Meskó",
    highlight: "doctors who use AI"
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