const bracketContainer = document.getElementById("bracket");
const connectionsSVG = document.getElementById("connections");

// Example with 40 competitors
competitors = [
  "#01. The Horse and the Infant",
  "#02. Just a Man",
  "#03. Full Speed Ahead",
  "#04. Open Arms",
  "#05. Warrior of the Mind",
  "#06. Polyphemus",
  "#07. Survive",
  "#08. Remember Them",
  "#09. My Goodbye",
  "#10. Storm",
  "#11. Luck Runs Out",
  "#12. Keep Your Friends Close",
  "#13. Ruthlessness",
  "#14. Puppeteer",
  "#15. Wouldn't You Like",
  "#16. Done For",
  "#17. There Are Other Ways",
  "#18. The Underworld",
  "#19. No Longer You",
  "#20. Monster",
  "#21. Suffering",
  "#22. Different Beast",
  "#23. Scylla",
  "#24. Mutiny",
  "#25. Thunder Bringer",
  "#26. Legendary",
  "#27. Little Wolf",
  "#28. We'll Be Fine",
  "#29. Love in Paradise",
  "#30. God Games",
  "#31. Not Sorry for Loving You",
  "#32. Dangerous",
  "#33. Charybdis",
  "#34. Get in the Water",
  "#35. Six Hundred Strike",
  "#36. The Challenge",
  "#37. Hold Them Down",
  "#38. Odysseus",
  "#39. I Can't Help but Wonder",
  "#40. Would You Fall in Love with Me Again"
];

// Global variables for largest cell dimensions
let largestCellHeight = 35;
let largestCellWidth = 320;

// Calculate the next power of 2
const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(competitors.length)));

// Pad with "Bye" slots
while (competitors.length < nextPowerOf2) {
  competitors.push("Bye");
}

// Shuffle competitors
function shuffleArray(array) {
  // Separate "Bye" and non-"Bye" competitors
  const byes = array.filter(item => item === "Bye");
  const competitors = array.filter(item => item !== "Bye");

  // Shuffle the competitors
  function fisherYatesShuffle(group) {
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]];
    }
  }
  fisherYatesShuffle(competitors);

  // Distribute "Bye" slots uniformly
  const result = [];
  const totalMatches = array.length / 2; // Total number of matches
  const byeSpacing = Math.ceil(totalMatches / byes.length); // Spacing between "Bye" slots

  let byeIndex = 0;
  for (let i = 0; i < array.length; i++) {
    if (byeIndex < byes.length && i % byeSpacing === 0) {
      result.push(byes[byeIndex]); // Insert a "Bye"
      byeIndex++;
    } else if (competitors.length > 0) {
      result.push(competitors.pop()); // Insert a competitor
    }
  }

  // In case there are remaining "Bye" slots, append them at the end
  while (byeIndex < byes.length) {
    result.push(byes[byeIndex++]);
  }

  return result;
}

competitors = shuffleArray(competitors);

// Create the tournament rounds
const tournament = [];
tournament.push(competitors);

// Generate subsequent rounds until only one slot remains (final match)
let currentRound = Array(Math.ceil(competitors.length / 2)).fill("");
while (currentRound.length >= 1) {
  tournament.push(currentRound);
  if (currentRound.length === 1) break; // Stop once the final round is created
  currentRound = Array(Math.ceil(currentRound.length / 2)).fill("");
}

// Store DOM references to cells
const cellRefs = [];

// Generate the bracket
function generateBracket(data) {
  const numCompetitors = data[0].length; // Number of competitors in Round 1
  const numRounds = data.length; // Total number of rounds
  const horizontalGap = 100; // Gap between rounds
  const verticalGapBase = 40; // Base vertical gap

  // Pre-render Round 1 to calculate the largest cell size
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.visibility = "hidden";
  document.body.appendChild(tempContainer);

  data[0].forEach(competitor => {
    const tempCell = document.createElement("div");
    tempCell.className = "cell";
    tempCell.textContent = competitor;
    tempContainer.appendChild(tempCell);

    const tempStyles = window.getComputedStyle(tempCell);
    const tempHeight = tempCell.offsetHeight + parseFloat(tempStyles.paddingTop) + parseFloat(tempStyles.paddingBottom);
    const tempWidth = tempCell.offsetWidth + parseFloat(tempStyles.paddingLeft) + parseFloat(tempStyles.paddingRight);

    if (tempHeight > largestCellHeight) largestCellHeight = tempHeight;
    if (tempWidth > largestCellWidth) largestCellWidth = tempWidth;
  });

  document.body.removeChild(tempContainer); // Remove the temporary container

  // Set reasonable limits for cell sizes
  largestCellHeight = Math.min(largestCellHeight, 100); // Max height 100px
  largestCellWidth = Math.max(largestCellWidth, 180); // Min width 180px

  // Calculate total height and width of the bracket
  const totalHeight = numCompetitors * (largestCellHeight + verticalGapBase);
  const totalWidth = numRounds * (largestCellWidth + horizontalGap);

  // Set dimensions of the bracket container and SVG
  bracketContainer.style.position = "relative";
  bracketContainer.style.width = `${totalWidth}px`;
  bracketContainer.style.height = `${totalHeight}px`;
  connectionsSVG.setAttribute("width", totalWidth);
  connectionsSVG.setAttribute("height", totalHeight);

  const roundPositions = [];

  data.forEach((round, roundIndex) => {
    const positions = [];
    const roundRefs = [];
    const numCells = round.length;

    // Dynamically calculate vertical spacing for this round
    const verticalGap = (totalHeight - numCells * largestCellHeight) / (numCells + 1);

    round.forEach((competitor, index) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = competitor || "";

      // Append the cell to the bracket container
      bracketContainer.appendChild(cell);
      roundRefs.push(cell);

      // Position the cell dynamically
      const left = roundIndex * (largestCellWidth + horizontalGap); // Horizontal position
      const top = (index + 1) * verticalGap + index * largestCellHeight; // Vertical position

      // Apply styles dynamically
      cell.style.position = "absolute";
      cell.style.top = `${top}px`;
      cell.style.left = `${left}px`;
      cell.style.width = `${largestCellWidth}px`;
      cell.style.height = `${largestCellHeight}px`;
      cell.style.padding = "5px"; // Reduce padding for better fit
      cell.style.lineHeight = "1.2"; // Tighten line spacing

      // Center the text horizontally and vertically
      cell.style.display = "flex"; // Use flexbox
      cell.style.justifyContent = "center"; // Center horizontally
      cell.style.alignItems = "center"; // Center vertically

      cell.style.border = "2px solid #007bff";
      cell.style.borderRadius = "5px";
      cell.style.backgroundColor = "#ffffff";
      cell.style.color = "#007bff";
      cell.style.fontWeight = "bold";
      cell.style.cursor = "pointer";
      cell.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.1)";

      positions.push({ top, left, element: cell });
    });

    cellRefs.push(roundRefs);
    roundPositions.push(positions);
  });

  // Automatically advance winners for "Bye" slots
  autoAdvanceByes();

  // Recalculate and redraw the connectors
  drawConnections(roundPositions);

  // Attach click listeners to all cells
  attachClickListeners();
}

// Update connectors to reflect new cell sizes
function drawConnections(roundPositions) {
  // Clear existing SVG paths only if valid positions are available
  const hasValidPositions = roundPositions.every(round =>
    round.every(pos => pos && !isNaN(pos.left) && !isNaN(pos.top))
  );

  if (!hasValidPositions) {
    console.warn("Invalid positions detected. Connectors not drawn.");
    return;
  }

  // Clear existing connectors
  connectionsSVG.innerHTML = "";

  // Draw new connections
  roundPositions.forEach((round, roundIndex) => {
    if (roundIndex === roundPositions.length - 1) return; // Skip last round (no next round)

    const nextRound = roundPositions[roundIndex + 1];

    round.forEach((pos, index) => {
      const nextIndex = Math.floor(index / 2); // Determine the corresponding cell in the next round
      const nextCell = nextRound[nextIndex];

      // Validate positions of both the current and next cells
      if (!pos || !nextCell || isNaN(pos.left) || isNaN(pos.top) || isNaN(nextCell.left) || isNaN(nextCell.top)) {
        console.warn("Skipping invalid connector positions:", { pos, nextCell });
        return;
      }

      console.log("cell sizes: ", largestCellWidth)
      const startX = pos.left + largestCellWidth + 13; // Right edge of the current cell
      const startY = pos.top + largestCellHeight / 2; // Center of the current cell
      const endX = nextCell.left; // Left edge of the next cell
      const endY = nextCell.top + largestCellHeight / 2; // Center of the next cell

      // Draw the path between cells
      drawPath(startX, startY, endX, endY);
    });
  });
}

// Automatically advance competitors that face "Bye"
function autoAdvanceByes() {
  const round1 = cellRefs[0];
  const round2 = cellRefs[1];

  round1.forEach((cell, index) => {
    if (cell.textContent === "Bye") {
      // Automatically advance the opponent to Round 2
      const opponentIndex = index % 2 === 0 ? index + 1 : index - 1;
      const nextIndex = Math.floor(index / 2);

      if (round1[opponentIndex] && round2[nextIndex]) {
        const opponentCell = round1[opponentIndex];

        // Dim both the "Bye" and the opponent
        cell.classList.add("dimmed");
        cell.style.backgroundColor = "#f5f5f5";
        cell.style.color = "#cccccc";

        opponentCell.classList.add("dimmed");
        opponentCell.style.backgroundColor = "#28a745"; // Winner's green background
        opponentCell.style.color = "#ffffff";

        // Advance the winner to the next round
        round2[nextIndex].textContent = opponentCell.textContent;
      }
    }
  });
}


// Draw an L-shaped path between two points
function drawPath(x1, y1, x2, y2) {
  if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
    console.error("Invalid connector positions:", { x1, y1, x2, y2 });
    return; // Skip invalid paths
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const midX = (x1 + x2) / 2; // Midpoint for horizontal connector

  const d = `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;
  path.setAttribute("d", d);
  path.setAttribute("stroke", "#007bff");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("fill", "none");
  connectionsSVG.appendChild(path);
}

// Attach click listeners to all cells
function attachClickListeners() {
  cellRefs.forEach((round, roundIndex) => {
    round.forEach((cell, index) => {
      cell.removeEventListener("click", () => handleCellClick(roundIndex, index)); // Remove old listeners
      cell.addEventListener("click", () => handleCellClick(roundIndex, index)); // Attach new listeners
    });
  });
}

// Handle cell click to advance winners
function handleCellClick(roundIndex, index) {
  const selectedCell = cellRefs[roundIndex][index];

  // Prevent clicks on empty cells or "Bye"
  if (!selectedCell.textContent || selectedCell.textContent === "Bye") return;

  // If this is the last round, do nothing
  if (roundIndex === tournament.length - 1) return;

  // Determine the match pair
  const pairStartIndex = index % 2 === 0 ? index : index - 1;
  const pair = [cellRefs[roundIndex][pairStartIndex], cellRefs[roundIndex][pairStartIndex + 1]];

  // Dim both cells in the pair
  pair.forEach(cell => {
    cell.classList.remove("winner");
    cell.classList.add("dimmed");
    cell.style.backgroundColor = "#f5f5f5"; // Dimmed gray background
    cell.style.color = "#cccccc"; // Dimmed gray text
  });

  // Highlight the selected cell as the winner and dim it
  selectedCell.classList.add("winner");
  selectedCell.classList.add("dimmed");
  selectedCell.style.backgroundColor = "#28a745"; // Green background for winner
  selectedCell.style.color = "#ffffff"; // White text for winner

  // Determine the next round's cell index
  const nextIndex = Math.floor(index / 2);
  const nextCell = cellRefs[roundIndex + 1][nextIndex];

  // Update the next round's cell
  nextCell.textContent = selectedCell.textContent;

  // Redraw connectors to reflect updates
  drawConnections(cellRefs);
}

// Generate and render the bracket
generateBracket(tournament);
