// JavaScript
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");

document.querySelector("#search-button").onclick = (e) => {
  searchForm.classList.toggle("active");
  searchBox.focus();
  e.preventDefault();
};

const sb = document.querySelector("#search-button");

document.addEventListener("click", function (e) {
  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }
});

// Ambil parameter nomor surat dari URL
const urlParams = new URLSearchParams(window.location.search);
const nomorSurat = urlParams.get("nomorsurat");

// Ambil data tafsir dari API lokal
function getTafsir() {
  fetch(`http://127.0.0.1:8000/api/tafsir/${nomorSurat}`)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.data) {
        const tafsirData = data.data;
        if (tafsirData.length > 0) {
          const { nomor_surah, teks } = tafsirData[0];
          const namaLatin = `Surah ${nomor_surah}`;

          // Tampilkan nama surat
          document.getElementById("nama-surat").innerHTML = `
            <h2>Tafsir ${namaLatin}</h2>
          `;

          // Tampilkan isi tafsir
          let tafsirHTML = "";
          tafsirData.forEach((ayat, index) => {
            tafsirHTML += `
              <div class="card mb-4">
                <div class="card-header">
                  Ayat ${ayat.nomor_ayat}
                </div>
                <div class="card-body">
                  <p class="card-text">${ayat.teks}</p>
                </div>
              </div>
            `;
          });

          // Masukkan isi tafsir ke kontainer
          document.getElementById("tafsir-content").innerHTML = tafsirHTML;
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching tafsir:", error);
    });
}

getTafsir();

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Cek tema yang disimpan di localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.classList.add(savedTheme);
  themeToggle.textContent = savedTheme === "dark-mode" ? "🌙" : "☀️";
} else {
  body.classList.add("dark-mode"); // Default ke gelap
}

// Event Listener untuk mengganti tema
themeToggle.addEventListener("click", () => {
  if (body.classList.contains("dark-mode")) {
    body.classList.replace("dark-mode", "light-mode");
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "light-mode");
  } else {
    body.classList.replace("light-mode", "dark-mode");
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark-mode");
  }
});
