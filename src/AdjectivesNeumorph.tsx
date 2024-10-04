import { useState } from "react";
import adjectivesMap from "./adjectives.json";
import imagesMapImport from "./images.json";

const imagesMap = (imagesMapImport as Record<string, string[]>)

const styles = `
  .container {
    display: flex;
    height: 100vh;
    background-color: #e0e5ec;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #6a7c92;
  }

  .left-panel, .right-panel {
    width: 50%;
    padding: 2rem;
    overflow-y: auto;
    box-sizing: border-box;
  }

  .card {
    background-color: #e0e5ec;
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 
      8px 8px 15px #a3b1c6, 
      -8px -8px 15px #ffffff;
  }

  .title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #4a5568;
    letter-spacing: -1px;
    text-shadow: 2px 2px 4px rgba(255,255,255,0.5);
  }

  .subtitle {
    font-size: 1.1rem;
    color: #718096;
    margin-bottom: 1rem;
    font-style: italic;
  }

  .handwriting-image {
    width: 100%;
    border-radius: 15px;
    box-shadow: 
      5px 5px 10px #a3b1c6, 
      -5px -5px 10px #ffffff;
  }

  .category-title {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #4a5568;
    text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
  }

  .adjective-chip {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
    background-color: #e0e5ec;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 0.5rem;
    color: #4a5568;
    font-weight: 600;
    box-shadow:
      5px 5px 10px #a3b1c6,
      -5px -5px 10px #ffffff;
  }

  .adjective-chip:hover {
    color: #2d3748;
    transform: scale(1.05);
    box-shadow:
      7px 7px 15px #a3b1c6,
      -7px -7px 15px #ffffff;
  }

  .adjective-chip.selected {
    color: #2d3748;
    transform: scale(0.98);
    box-shadow:
      inset 3px 3px 5px #a3b1c6,
      inset -3px -3px 5px #ffffff;
    background-image: linear-gradient(145deg, #d1d9e6, #f3f4f6);
  }

  .tooltip .tooltip-text {
    background-color: rgba(74, 85, 104, 0.9);
    color: #ffffff;
    padding: 8px;
    font-size: 0.8rem;
    border-radius: 8px;
  }

  .button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    color: #4a5568;
    background-color: #e0e5ec;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
    box-shadow:
      5px 5px 10px #a3b1c6,
      -5px -5px 10px #ffffff;
    position: relative;
    overflow: hidden;
    background-image: linear-gradient(145deg, #e6e6e6, #ffffff);
  }

  .button:hover {
    color: #2d3748;
    background-image: linear-gradient(145deg, #f0f0f0, #e6e6e6);
    animation: soft-pulse 1.5s infinite;
  }

  .button:active {
    box-shadow:
      inset 3px 3px 5px #a3b1c6,
      inset -3px -3px 5px #ffffff;
    background-image: linear-gradient(145deg, #d1d9e6, #f3f4f6);
  }

  .download-button {
    background-image: linear-gradient(145deg, #e6e6e6, #c2e9fb);
  }

  .download-button:hover {
    background-image: linear-gradient(145deg, #c2e9fb, #a1c4fd);
  }

  .next-button {
    background-image: linear-gradient(145deg, #e6e6e6, #fdcbf1);
  }

  .next-button:hover {
    background-image: linear-gradient(145deg, #fdcbf1, #e6dee9);
  }

  .action-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
  }

  .button-text {
    position: relative;
    z-index: 1;
  }

  .button-icon {
    margin-right: 8px;
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .button::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: radial-gradient(circle, #a3b1c6 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform .5s, opacity 1s;
  }

  .button:active::after {
    transform: scale(0, 0);
    opacity: .3;
    transition: 0s;
  }

  @keyframes soft-pulse {
    0% {
      box-shadow:
        5px 5px 10px #a3b1c6,
        -5px -5px 10px #ffffff;
    }
    50% {
      box-shadow:
        8px 8px 15px #a3b1c6,
        -8px -8px 15px #ffffff;
    }
    100% {
      box-shadow:
        5px 5px 10px #a3b1c6,
        -5px -5px 10px #ffffff;
    }
  }
`;

const HandwritingMeasurement = () => {
  const [authorIndex, setAuthorIndex] = useState(0);
  const [selectedAdjectives, setSelectedAdjectives] = useState<Record<string, string>>({});

  const authors = Object.keys(imagesMap);

  const selectAdjective = (category: string, adjective: string) => {
    setSelectedAdjectives((prev) => ({
      ...prev,
      [category]: adjective,
    }));
  };

  const downloadJson = () => {
    const jsonString = JSON.stringify(selectedAdjectives, null, 2);
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
