import React, { useState } from 'react';
import Ellipse from './Ellipse';
import './App.css';

function App() {
  const [ellipses, setEllipses] = useState([
    { x: 0, y: 0, rx: 100, ry: 50, rotation: 0, fill: false, name: 'Ellipse 1' }
  ]);
  const [selectedEllipseIndex, setSelectedEllipseIndex] = useState(0);
  const [showNames, setShowNames] = useState(true);

  const isPositionOccupied = (x, y, threshold = 150) => {
    return ellipses.some(ellipse => {
      const dx = ellipse.x - x;
      const dy = ellipse.y - y;
      return Math.sqrt(dx * dx + dy * dy) < threshold;
    });
  };

  const findAvailablePosition = () => {
    if (!isPositionOccupied(0, 0)) {
      return { x: 0, y: 0 };
    }

    const offsets = [
      { x: 100, y: 0 },
      { x: 200, y: 0 },
      { x: -100, y: 0 },
      { x: -200, y: 0 },
      { x: 0, y: 100 },
      { x: 0, y: 200 },
      { x: 0, y: -100 },
      { x: 0, y: -200 }
    ];

    for (let i = 0; i < offsets.length; i++) {
      const { x, y } = offsets[i];
      if (!isPositionOccupied(0 + x, 0 + y)) {
        return { x: 0 + x, y: 0 + y };
      }
    }

    return { x: (Math.random()-0.5) * 400, y: (Math.random()-0.5) * 300 };
  };

  const addEllipse = () => {
    const { x, y } = findAvailablePosition();
    const newEllipse = {
      x,
      y,
      rx: 100,
      ry: 50,
      rotation: 0,
      fill: false,
      name: `Ellipse ${ellipses.length + 1}`
    };
    setEllipses([...ellipses, newEllipse]);
    setSelectedEllipseIndex(ellipses.length);
  };

  const paintallEllipse = () => {
    const newEllipses = ellipses.map((ellipse) => {
      ellipse.fill = true;
      return ellipse;
    });
    setEllipses(newEllipses);
  }

  const paintcancelallEllipse = () => {
    const newEllipses = ellipses.map((ellipse) => {
      ellipse.fill = false;
      return ellipse;
    });
    setEllipses(newEllipses);
  }

  const updateEllipse = (index, key, value) => {
    const newEllipses = ellipses.map((ellipse, i) =>
      i === index ? { ...ellipse, [key]: value } : ellipse
    );
    setEllipses(newEllipses);
  };

  const deleteEllipse = (index) => {
    const newEllipses = ellipses.filter((_, i) => i !== index);
    // Update names of ellipses
    newEllipses.forEach((ellipse, i) => {
      ellipse.name = `Ellipse ${i + 1}`;
    });
    setEllipses(newEllipses);
    setSelectedEllipseIndex(newEllipses.length > 0 ? 0 : -1);
  };

  return (
    <div className="App">
      <div className="controls">
        <h1 class="large-text">Ellipse Manipulator2</h1>
        <p class="small-text">楕円を追加、大きさや位置の変更、黒塗りすることができます。</p>
        <br></br>
        <button onClick={addEllipse}>楕円を追加する</button>
        <button onClick={paintallEllipse}>全楕円を黒く塗る</button>
        <button onClick={paintcancelallEllipse}>全楕円を白くする</button>
        <label>
          各楕円の名前を表示:
          <input
            type="checkbox"
            checked={showNames}
            onChange={(e) => setShowNames(e.target.checked)}
          />
        </label>
        {/* <label>
          全ての楕円を黒く塗りつぶす:
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked){
                ellipses.map(ellipse => {
                  ellipse.fill = true;
                  return ellipse;
                })
                setEllipses([...ellipses]);
              };
            }}
          />
        </label> */}
        {ellipses.length > 0 && (
          <>
            <label>
              操作する楕円:
              <select
                value={selectedEllipseIndex}
                onChange={(e) => setSelectedEllipseIndex(Number(e.target.value))}
              >
                {ellipses.map((_, index) => (
                  <option key={index} value={index}>
                    {`Ellipse ${index + 1}`}
                  </option>
                ))}
              </select>
              <p class="small-text">(青い名前部分をクリックしても選べます)</p>
            </label>
            <div key={selectedEllipseIndex}>
              <h2>{`Ellipse ${selectedEllipseIndex + 1}`}</h2>
              <label>
                X (横方向の位置):
                <input
                  type="number"
                  step="10"
                  defaultValue={ellipses[selectedEllipseIndex].x}
                  onChange={(e) => updateEllipse(selectedEllipseIndex, 'x', Number(e.target.value))}
                />
              </label>
              <label>
                Y (縦方向の位置):
                <input
                  type="number"
                  step="10"
                  defaultValue={ellipses[selectedEllipseIndex].y}
                  onChange={(e) => updateEllipse(selectedEllipseIndex, 'y', Number(e.target.value))}
                />
              </label>
              <label>
                Radius X (横幅):
                <input
                  type="number"
                  step="10"
                  min="0"
                  defaultValue={ellipses[selectedEllipseIndex].rx}
                  onChange={(e) => {
                    if (Number(e.target.value) < 0) return;
                    updateEllipse(selectedEllipseIndex, 'rx', Number(e.target.value));
                  }}
                />
              </label>
              <label>
                Radius Y (縦幅):
                <input
                  type="number"
                  step="10"
                  min="0"
                  defaultValue={ellipses[selectedEllipseIndex].ry}
                  onChange={(e) => {
                    if (Number(e.target.value) < 0) return;
                    updateEllipse(selectedEllipseIndex, 'ry', Number(e.target.value));
                  }}
                />
              </label>
              <label>
                Rotation (回転角度) [-360° ~ 360°]:
                <input
                  type="number"
                  step="10"
                  min="-360"
                  max="360"
                  defaultValue={ellipses[selectedEllipseIndex].rotation}
                  onChange={(e) => updateEllipse(selectedEllipseIndex, 'rotation', Number(e.target.value))}
                />
              </label>
              <label>
                Paint black (黒く塗りつぶす):
                <input
                  type="checkbox"
                  checked={ellipses[selectedEllipseIndex].fill}
                  onChange={(e) => updateEllipse(selectedEllipseIndex, 'fill', e.target.checked)}
                />
              </label>
              <button onClick={() => deleteEllipse(selectedEllipseIndex)}>楕円を削除する</button>
            </div>
          </>
        )}
      </div>
      <div className="canvas-container">
        <Ellipse ellipses={ellipses} showNames={showNames} onSelectEllipse={setSelectedEllipseIndex} />
      </div>
    </div>
  );
}

export default App;
