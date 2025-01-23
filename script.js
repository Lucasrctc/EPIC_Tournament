const bracketContainer = document.getElementById('bracket');
const connectionsSVG = document.getElementById('connections');

// Example tournament data
const tournament = [
  ["Song 1", "Song 2", "Song 3", "Song 4", "Song 5", "Song 6", "Song 7", "Song 8"], // First round
  ["", "", "", ""],                                                                // Second round
  ["", ""],                                                                        // Semifinal
  [""]                                                                             // Final
];

// Store DOM references to cells
const cellRefs = [];

// Generate the bracket
function generateBracket(data) {
  const roundPositions = [];
  const totalHeight = 600; // Total height for the bracket container

  data.forEach((round, roundIndex) => {
    const positions = [];
    const roundRefs = [];
    const numCells = round.length;

    // Calculate the vertical spacing for the current round
    const verticalGap = totalHeight / (numCells + 1);

    round.forEach((competitor, index) => {
      // Create the cell
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = competitor || "";

      // Append the cell to the bracket container
      bracketContainer.appendChild(cell);
      roundRefs.push(cell);

      // Calculate position for the cell
      const left = roundIndex * 200 + 20; // Horizontal spacing between rounds
      const top = (index + 1) * verticalGap; // Vertical spacing for cells in the round

      // Apply dynamic positioning
      cell.style.position = "absolute";
      cell.style.top = `${top}px`;
      cell.style.left = `${left}px`;
      cell.style.width = "150px"; // Fixed width
      cell.style.height = "50px"; // Fixed height
      cell.style.lineHeight = "50px"; // Vertically align text
      cell.style.textAlign = "center"; // Horizontally align text
      cell.style.border = "2px solid #007BFF";
      cell.style.borderRadius = "5px";
      cell.style.backgroundColor = "#ffffff";
      cell.style.color = "#007BFF";
      cell.style.fontWeight = "bold";
      cell.style.cursor = "pointer";

      positions.push({ top, left, element: cell });
    });

    cellRefs.push(roundRefs);
    roundPositions.push(positions);
  });

  drawConnections(roundPositions);

  // Attach click listeners after generating the bracket
  attachClickListeners();
}

function adjustSVGSize() {
  // Get the bounding dimensions of the bracket container
  const { offsetWidth, offsetHeight } = bracketContainer;

  // Dynamically update the SVG size to match
  connectionsSVG.setAttribute("width", offsetWidth);
  connectionsSVG.setAttribute("height", offsetHeight);
}

// Draw connections between cells in all rounds
function drawConnections(roundPositions) {
  connectionsSVG.innerHTML = ""; // Clear previous paths
  roundPositions.forEach((round, roundIndex) => {
    if (roundIndex === roundPositions.length - 1) return; // No next round

    const nextRound = roundPositions[roundIndex + 1];

    round.forEach((pos, index) => {
      const nextIndex = Math.floor(index / 2); // Determine the corresponding cell in the next round
      const startX = pos.left + 150; // Right edge of the current cell
      const startY = pos.top + 25;  // Center of the current cell
      const endX = nextRound[nextIndex].left; // Left edge of the next cell
      const endY = nextRound[nextIndex].top + 25; // Center of the next cell

      // Draw the connection between the current and next round cells
      drawPath(startX, startY, endX, endY);
    });
  });
}

// Draw an L-shaped path in the SVG
function drawPath(x1, y1, x2, y2) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const midX = (x1 + x2) / 2; // Horizontal midpoint

  const d = `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;
  path.setAttribute('d', d);
  path.setAttribute('stroke', '#007BFF');
  path.setAttribute('stroke-width', 2);
  path.setAttribute('fill', 'none');
  connectionsSVG.appendChild(path);
}

// Attach click listeners to all cells
function attachClickListeners() {
  cellRefs.forEach((round, roundIndex) => {
    round.forEach((cell, index) => {
      // Ensure every cell has a click listener
      cell.removeEventListener('click', () => handleCellClick(roundIndex, index)); // Remove old listeners
      cell.addEventListener('click', () => handleCellClick(roundIndex, index));
    });
  });
}

// Handle cell click to advance winners
function handleCellClick(roundIndex, index) {
  const selectedCell = cellRefs[roundIndex][index];

  // Prevent clicks on empty cells unless it's Round 1
  if (!selectedCell.textContent && roundIndex !== 0) return;

  // If this is the last round, do nothing
  if (roundIndex === tournament.length - 1) return;

  // Determine the next round's cell index
  const nextIndex = Math.floor(index / 2);
  const nextCell = cellRefs[roundIndex + 1][nextIndex];

  // Mark the selected cell as the winner
  cellRefs[roundIndex].forEach(cell => cell.classList.remove('winner'));
  selectedCell.classList.add('winner');
  selectedCell.style.backgroundColor = "#28a745";
  selectedCell.style.color = "#ffffff";
  nextCell.textContent = selectedCell.textContent; // Set the winner for the next round

  // Reattach listeners to ensure all cells remain interactive
  attachClickListeners();
}

// Generate and render the bracket
generateBracket(tournament);
adjustSVGSize(); // Ensure the SVG covers the entire bracket

// Handle window resizing
window.addEventListener("resize", () => {
  adjustSVGSize();
  drawConnections(roundPositions); // Redraw connections
});
