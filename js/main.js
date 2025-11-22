// Música on/off
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");

if (musicToggle && bgMusic) {
  let isPlaying = false;

  musicToggle.addEventListener("click", () => {
    if (!isPlaying) {
      bgMusic.play();
      isPlaying = true;
      musicToggle.textContent = "♫ Música ON";
    } else {
      bgMusic.pause();
      isPlaying = false;
      musicToggle.textContent = "♫ Música OFF";
    }
  });
}

// Reseñas
const addReviewBtn = document.getElementById("addReview");
const reviewNameInput = document.getElementById("reviewName");
const reviewTextInput = document.getElementById("reviewText");
const reviewRatingSelect = document.getElementById("reviewRating");
const reviewsList = document.getElementById("reviewsList");

if (addReviewBtn && reviewsList) {
  addReviewBtn.addEventListener("click", () => {
    const name = reviewNameInput.value.trim() || "Anon";
    const text = reviewTextInput.value.trim();
    const rating = reviewRatingSelect.value;

    if (!text) {
      alert("Escribe un comentario para agregar tu reseña.");
      return;
    }

    const card = document.createElement("div");
    card.className = "review-card";

    const header = document.createElement("div");
    header.className = "review-header";

    const nameEl = document.createElement("span");
    nameEl.className = "review-name";
    nameEl.textContent = name;

    const ratingEl = document.createElement("span");
    ratingEl.className = "review-rating";
    ratingEl.textContent = "⭐".repeat(parseInt(rating, 10));

    header.appendChild(nameEl);
    header.appendChild(ratingEl);

    const textEl = document.createElement("p");
    textEl.textContent = text;

    card.appendChild(header);
    card.appendChild(textEl);

    reviewsList.prepend(card);

    reviewTextInput.value = "";
  });
}

/* --- Sopa de Letras Alien Stage Nivel Difícil (15x15) --- */

const sopaTable = document.getElementById("sopa-table");
const wordListContainer = document.getElementById("word-list");
const sopaStatus = document.getElementById("sopa-status");

if (sopaTable && wordListContainer && sopaStatus) {
  const gridSize = 15;

  const words = [
    "CURE",
    "BLACKSORROW",
    "MYCLEMATIS",
    "RULEROFMYHEART",
    "BLINKGONE",
    "ALLIN",
    "KARMA",
    "WIEGE",
    "MIZI",
    "SUA",
    "IVAN",
    "LUKA",
    "HYUNA",
    "TILL"
  ];

  const wordList = [...wordListContainer.getElementsByTagName("li")];

  let grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));

  function placeWord(word) {
    let placed = false;
    let attempts = 0;

    const directions = [
      [1, 0],   // vertical
      [0, 1],   // horizontal
      [1, 1],   // diagonal ↘
      [-1, 1],  // diagonal ↗
    ];

    while (!placed && attempts < 500) {
      attempts++;

      const dir = directions[Math.floor(Math.random() * directions.length)];
      const dr = dir[0];
      const dc = dir[1];

      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      let fits = true;

      for (let i = 0; i < word.length; i++) {
        const r = row + dr * i;
        const c = col + dc * i;

        if (
          r < 0 ||
          r >= gridSize ||
          c < 0 ||
          c >= gridSize ||
          (grid[r][c] !== "" && grid[r][c] !== word[i])
        ) {
          fits = false;
          break;
        }
      }

      if (fits) {
        for (let i = 0; i < word.length; i++) {
          const r = row + dr * i;
          const c = col + dc * i;
          grid[r][c] = word[i];
        }
        placed = true;
      }
    }
  }

  words.forEach(w => placeWord(w));

  function fillGrid() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] === "") {
          grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  }

  fillGrid();

  function buildTable() {
    sopaTable.innerHTML = "";

    for (let r = 0; r < gridSize; r++) {
      const rowEl = document.createElement("tr");

      for (let c = 0; c < gridSize; c++) {
        const cell = document.createElement("td");
        cell.textContent = grid[r][c];
        cell.dataset.row = r;
        cell.dataset.col = c;

        cell.addEventListener("click", () => selectCell(cell));

        rowEl.appendChild(cell);
      }

      sopaTable.appendChild(rowEl);
    }
  }

  let selectedCells = [];

  function selectCell(cell) {
    cell.classList.toggle("selected");

    const key = `${cell.dataset.row}-${cell.dataset.col}`;

    if (selectedCells.includes(key)) {
      selectedCells = selectedCells.filter(k => k !== key);
    } else {
      selectedCells.push(key);
    }

    checkWord();
  }

  function checkWord() {
    const letters = selectedCells
      .map(k => {
        const [r, c] = k.split("-").map(Number);
        return grid[r][c];
      })
      .join("");

    const reversed = letters.split("").reverse().join("");

    words.forEach((word, i) => {
      if (letters === word || reversed === word) {
        markFound(i);
      }
    });
  }

  function markFound(index) {
    const allCells = sopaTable.getElementsByTagName("td");

    [...allCells].forEach(cell => {
      const key = `${cell.dataset.row}-${cell.dataset.col}`;
      if (selectedCells.includes(key)) {
        cell.classList.remove("selected");
        cell.classList.add("found");
      }
    });

    selectedCells = [];

    if (wordList[index]) {
      wordList[index].classList.add("found");
    }

    if (wordList.every(li => li.classList.contains("found"))) {
      sopaStatus.textContent =
        "¡Modo difícil completado! Eres oficialmente Alien Stage PRO 💚👽✨";
    }
  }

  buildTable();
}
