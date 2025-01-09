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

// Ambil data tafsir dari API
function getTafsir() {
  fetch(`https://equran.id/api/v2/tafsir/${nomorSurat}`)
    .then((response) => response.json())
    .then((response) => {
      if (response && response.data) {
        const { namaLatin, tafsir } = response.data;

        // Tampilkan nama surat
        document.getElementById(
          "nama-surat"
        ).textContent = `Tafsir Surat ${namaLatin}`;

        // Tampilkan isi tafsir
        let tafsirHTML = "";
        tafsir.forEach((ayat, index) => {
          tafsirHTML += `
            <div class="ayat">
              <h5>Ayat ${ayat.ayat}</h5>
              <p>${ayat.teks}</p>
            </div>
            ${index < tafsir.length - 1 ? "<hr>" : ""}
          `;
        });

        // Masukkan isi tafsir ke kontainer
        document.getElementById("tafsir-content").innerHTML = tafsirHTML;
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
