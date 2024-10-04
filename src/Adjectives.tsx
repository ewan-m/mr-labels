import { useState } from "react";
import adjectivesMap from "./adjectives.json";
import imagesMap from "./images.json";

const styles = `

:root {
  --bg-color: #f7f9fc; /* Soft light blue-gray for background */
  --card-bg: #ffffff; /* White for cards */
  --text-primary: #1a202c; /* Darker grayish blue for primary text */
  --text-secondary: #4a5568; /* Medium gray for secondary text */
  --accent-1: #5a67d8; /* Subtle blue for accents */
  --accent-2: #9f7aea; /* Light violet for secondary accents */
  --shadow-color: rgba(0, 0, 0, 0.05); /* Softer shadow for a more subtle look */
}

  body {
    background-color: var(--bg-color);
    font-family: 'Helvetica';
  }

  .container {
    display: flex;
    min-height: 100vh;
    gap: 2rem;
  }

  .left-panel {
    flex: 1;
    position: sticky;
    height: calc(100vh - 4rem);
    padding: 2rem;
    overflow-y: auto;
  }

  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow-y: auto;
    padding: 2rem;
    height: calc(100vh - 4rem);
  }

  .card {
    background-color: var(--card-bg);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px var(--shadow-color);
    transition: all 0.3s ease;
  }

  .card:hover {
    box-shadow: 0 8px 15px var(--shadow-color);
  }

  .title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, var(--accent-1), var(--accent-2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }

  .handwriting-image {
    width: 100%;
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  .handwriting-image:hover {
    transform: scale(1.02);
  }

  .category-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  .adjective-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .adjective-chip {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    background-color: var(--bg-color);
    color: var(--text-primary);
    border: 1px solid var(--shadow-color);
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    margin-right: 0.3rem;
  }

  .adjective-chip:hover {
    background: linear-gradient(45deg, var(--accent-1), var(--accent-2));
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px var(--shadow-color);
  }

  .adjective-chip.selected {
    background: linear-gradient(45deg, var(--accent-1), var(--accent-2));
    color: white;
    transform: scale(0.98);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .tooltip .tooltip-text {
    background-color: var(--text-primary);
    color: var(--card-bg);
    padding: 0.5rem;
    font-size: 0.8rem;
    border-radius: 6px;
  }

  .button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    color: var(--text-primary);
    background-color: var(--bg-color);
    border: 2px solid var(--shadow-color);
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
    z-index: 1;
    box-shadow: 
      5px 5px 10px rgba(163, 177, 198, 0.6),
      -5px -5px 10px rgba(255, 255, 255, 0.5);
  }

  .button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, var(--accent-1), var(--accent-2));
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  .button:hover::before {
    opacity: 1;
  }

  .button:hover {
    color: white;
    transform: translateY(-2px);
    box-shadow: 
      8px 8px 15px rgba(163, 177, 198, 0.6),
      -8px -8px 15px rgba(255, 255, 255, 0.5);
  }

  .button:active {
    transform: translateY(0);
    box-shadow: inset 3px 3px 5px rgba(163, 177, 198, 0.6),
                inset -3px -3px 5px rgba(255, 255, 255, 0.5);
  }

  .action-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
  }

  .button-icon {
    margin-right: 8px;
    position: relative;
    z-index: 2;
  }

  .button-text {
    position: relative;
    z-index: 2;
  }

  /* Fix for shadow clipping */
  .card, .adjective-chip, .button {
    transform: translate3d(0, 0, 0);
  }
`;

const HandwritingMeasurement = () => {
  const [authorIndex, setAuthorIndex] = useState(0);
  const [selectedAdjectives, setSelectedAdjectives] = useState({});

  const authors = Object.keys(imagesMap);

  const selectAdjective = (category, adjective) => {
    setSelectedAdjectives((prev) => ({
      ...prev,
      [category]: adjective,
    }));
  };

  const downloadJson = () => {
    const data = { selectedAdjectives };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${imagesMap[authors[authorIndex]][0]}_adjectives.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const nextAuthor = () => {
    setAuthorIndex((a) => (a + 1) % authors.length);
    setSelectedAdjectives({});
  };

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="left-panel">
          <div className="card">
            <h1 className="title">Script Analysis</h1>
            <p className="subtitle">
              Classify {imagesMap[authors[authorIndex]][0]}'s handwriting
              attributes
            </p>
            <img
              className="handwriting-image"
              src={`/images/${imagesMap[authors[authorIndex]][0]}.png`}
              alt="Handwriting sample"
            />
          </div>
        </div>

        <div className="right-panel">
          {Object.entries(adjectivesMap).map(([category, adjectives]) => (
            <div key={category} className="card adjective-category">
              <h2 className="category-title">{category}</h2>
              <div className="adjective-list">
                {Object.entries(adjectives).map(([adjective, description]) => (
                  <div key={adjective} className="tooltip">
                    <button
                      className={`adjective-chip ${selectedAdjectives[category] === adjective ? "selected" : ""}`}
                      onClick={() => selectAdjective(category, adjective)}
                    >
                      {adjective}
                    </button>
                    <span className="tooltip-text">{description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="action-buttons">
            <button onClick={downloadJson} className="button download-button">
              <span className="button-text">
                <span className="button-icon">↓</span>
                Export Data
              </span>
            </button>
            <button onClick={nextAuthor} className="button next-button">
              <span className="button-text">
                <span className="button-icon">→</span>
                Next Sample
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HandwritingMeasurement;
