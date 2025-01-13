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
    fetch("http://127.0.0.1:8000/api/suratall")
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
                surah.nama_latin.toLowerCase().includes(searchTerm) ||
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
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="card card-surat shadow-lg h-100" 
          onclick="location.href='surat.html?nomorsurat=${surah.nomor}'" 
          style="cursor: pointer; border-radius: 15px;">
          <div class="card-body text-center">
            <h5 class="card-title fw-bold">${surah.nomor}. ${surah.nama_latin}</h5>
            <h4 class="card-subtitle mb-2 text-muted">${surah.nama}</h4>
            <p class="card-text">${surah.arti}</p>
          </div>
        </div>
      </div>`
      )
      .join("");
    container.innerHTML = surahCards;
  }

  // Tampilkan/matikan kolom pencarian
  if (searchButton) {
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
  }

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
