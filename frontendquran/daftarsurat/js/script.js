document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.getElementById("search-box");
  const surahContainer = document.querySelector(".card-surat-list");
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Fetch daftar surah dari API
  let surahList = [];
  if (surahContainer) {
    fetch("https://equran.id/api/v2/surat")
      .then((response) => response.json())
      .then((data) => {
        surahList = data.data;
        displaySurahs(surahContainer, surahList);

        // Filter surah berdasarkan input pencarian
        if (searchInput) {
          searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredSurahs = surahList.filter(
              (surah) =>
                surah.namaLatin.toLowerCase().includes(searchTerm) ||
                surah.nomor.toString().includes(searchTerm)
            );
            displaySurahs(surahContainer, filteredSurahs, searchTerm);
          });
        }
      })
      .catch((error) => console.error("Error fetching surah data:", error));
  }

  // Fungsi untuk menampilkan surah
  function displaySurahs(container, surahs, searchTerm = "") {
    if (surahs.length === 0) {
      container.innerHTML = `<div class="col-12 text-center"><p>No surah found for "${searchTerm}"</p></div>`;
      return;
    }

    const surahCards = surahs
      .map(
        (surah) => `
          <div class="col-lg-3 col-md-4 col-sm-12">
            <div class="card mb-4 card-surat" onclick="location.href='surat.html?nomorsurat=${surah.nomor}'">
              <div class="card-body">
                <h6 class="card-title">${surah.nomor} ${surah.namaLatin}</h6>
                <h3 class="card-subtitle mb-2 text-muted text-end">${surah.nama}</h3>
                <p class="card-text">${surah.arti}</p>
              </div>
            </div>
          </div>`
      )
      .join("");
    container.innerHTML = surahCards;
  }

  // Tampilkan/matikan kolom pencarian
  searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    searchForm.classList.toggle("active");
    if (searchForm.classList.contains("active")) {
      searchInput.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (!searchButton.contains(e.target) && !searchForm.contains(e.target)) {
      searchForm.classList.remove("active");
    }
  });

  // Pengaturan tema
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.classList.add(savedTheme);
    themeToggle.textContent = savedTheme === "dark-mode" ? "☀️" : "🌙";
  } else {
    body.classList.add("dark-mode"); // Default tema gelap
  }

  themeToggle.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
      body.classList.replace("dark-mode", "light-mode");
      themeToggle.textContent = "🌙";
      localStorage.setItem("theme", "light-mode");
    } else {
      body.classList.replace("light-mode", "dark-mode");
      themeToggle.textContent = "☀️";
      localStorage.setItem("theme", "dark-mode");
    }
  });
});
