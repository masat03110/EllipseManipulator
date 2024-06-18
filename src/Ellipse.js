import React, { useRef, useEffect, useCallback } from 'react';

const Ellipse = ({ ellipses, showNames, onSelectEllipse }) => {
  const canvasRef = useRef(null);
  //const [selectedEllipseIndex, setSelectedEllipseIndex] = useState(null);

  const drawGrid = (ctx, width, height, gridSize) => {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    // Draw horizontal grid lines
    for (let y = -height / 2; y <= height / 2; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(-width / 2, y);
      ctx.lineTo(width / 2, y);
      ctx.stroke();
      if (y % (gridSize * 5) === 0) {
        ctx.fillStyle = 'black';
        ctx.fillText(y, 2, -y - 2);
      }
    }

    // Draw vertical grid lines
    for (let x = -width / 2; x <= width / 2; x += gridSize) {
      if (x === 0) {
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(x, -height / 2);
      ctx.lineTo(x, height / 2);
      ctx.stroke();
      if (x % (gridSize * 5) === 0) {
        ctx.fillStyle = 'black';
        ctx.fillText(x, x + 2, -10);
      }
    }

    // Draw X and Y axes
    // ctx.strokeStyle = 'black';
    ctx.lineWidth = 1.5;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(-width / 2, 0);
    ctx.lineTo(width / 2, 0);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(0, -height / 2);
    ctx.lineTo(0, height / 2);
    ctx.stroke();
  };

  const handleCanvasClick = useCallback((event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const canvasRect = canvas.getBoundingClientRect();
    const canvasX = event.clientX - canvasRect.left;
    const canvasY = event.clientY - canvasRect.top;

    ellipses.forEach(({ x, y, name }, index) => {
      const buttonX = x + width / 2 + 10;
      const buttonY = -y + height / 2 - 30;
      const textWidth = ctx.measureText(name).width;
      const padding = 4;

      if (canvasX >= buttonX && canvasX <= buttonX + textWidth + padding * 2 + 20 &&
          canvasY >= buttonY && canvasY <= buttonY + 20 && showNames) {
        onSelectEllipse(index);
      }
    });
  }, [ellipses, onSelectEllipse, showNames]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Remove previous event listener
    canvas.removeEventListener('click', handleCanvasClick);

    // Add new event listener
    canvas.addEventListener('click', handleCanvasClick);

    // Draw everything
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2); // Translate to center of the canvas
    drawGrid(ctx, width, height, 20);

    ellipses.forEach(({ x, y, rx, ry, rotation, fill, name }, index) => {
      ctx.save();
      ctx.translate(x, -y); // Adjust y to flip the coordinate system
      ctx.rotate(-rotation * Math.PI / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, 2 * Math.PI);
      ctx.lineWidth = 2; // Line width
      ctx.strokeStyle = 'black'; // Line color
      if (fill) {
        ctx.fillStyle = 'black';
        ctx.fill();
      } else {
        ctx.stroke();
      }
      ctx.restore();

      if (showNames) {
        ctx.save();
        ctx.translate(x, -y); // Adjust y to flip the coordinate system
        ctx.font = '16px Arial';
        ctx.fillStyle = 'blue';
        const textWidth = ctx.measureText(name).width;
        const padding = 4;
        ctx.fillRect(10, -26, textWidth + padding * 2, 20);
        ctx.fillStyle = 'white';
        ctx.fillText(name, 10 + padding, -10);
        ctx.restore();
      }
    });
    ctx.restore();

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [ellipses, showNames, handleCanvasClick]);

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid black' }} />
      {/* {selectedEllipseIndex !== null && (
        <p>Selected Ellipse Index: {selectedEllipseIndex}</p>
      )} */}
    </div>
  );
};

export default Ellipse;
