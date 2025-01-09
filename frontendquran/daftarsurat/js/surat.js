// bagian search form
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

function getURL(e) {
  const pageURL = window.location.search.substring(1);
  const urlVariable = pageURL.split("&");

  for (let i = 0; i < urlVariable.length; i++) {
    const parameterName = urlVariable[i].split("=");
    if (parameterName[0] === e) {
      return parameterName[1];
    }
  }
}

const nomorsurat = getURL("nomorsurat");

function getSurat() {
  fetch(`https://equran.id/api/v2/surat/${nomorsurat}`)
    .then((response) => response.json())
    .then((response) => {
      // title surat
      const titleSurat = document.querySelector("#title-surat");
      titleSurat.textContent = `Surat ${response.data.namaLatin}`;

      // Judul Surat
      const judulSurat = document.querySelector(".judul-surat");
      const suratData = response.data;
      const cardJudulSurat = `
            <strong class="text-end mb-2">${suratData.namaLatin} - ${suratData.nama}</strong>
            <p>Jumlah Ayat: ${suratData.jumlahAyat} (${suratData.arti})</p>
            <button class="btn btn-primary audio-button-play">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
              </svg>
            </button>
            <button class="btn btn-danger hidden-button audio-button-pause">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
              </svg>
            </button>
            <audio id="audio-tag" src="${suratData.audioFull["05"]}"></audio>
            <br>
            <button class="btn btn-primary mt-3" onclick="location.href='tafsir.html?nomorsurat=${suratData.nomor}'">
              Lihat Tafsir
            </button>
            <h3><center>بِسْمِ اللَّهِ الرحمن الرَّحِيمِ</center></h3>
          `;

      judulSurat.innerHTML = cardJudulSurat;

      // Isi Surat
      const surat = suratData.ayat;
      let isiSurat = "";
      surat.forEach((s) => {
        isiSurat += `
            <div class="card mb-3">
              <div class="card-body">
                <p>${s.nomorAyat}</p>
                <h3 class="text-end mb-2">${s.teksArab}</h3>
                <p>${s.teksLatin}</p>
                <p>${s.teksIndonesia}</p>
              </div>
            </div>
          `;
      });

      const cardIsiSurat = document.querySelector(".card-isi-surat");
      cardIsiSurat.innerHTML = isiSurat;

      // play and pause audio
      const audioPlay = document.querySelector(".audio-button-play");
      const audioPause = document.querySelector(".audio-button-pause");
      const audioSuara = document.querySelector("#audio-tag");

      if (audioPlay && audioPause && audioSuara) {
        // Play button
        audioPlay.addEventListener("click", () => {
          audioSuara.play();
          audioPause.classList.remove("hidden-button");
          audioPlay.classList.add("hidden-button");
        });

        // Pause button
        audioPause.addEventListener("click", () => {
          audioSuara.pause();
          audioPause.classList.add("hidden-button");
          audioPlay.classList.remove("hidden-button");
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching surat:", error);
    });
}

getSurat();

// Event listener untuk pencarian ayat
const searchAyatInput = document.querySelector("#search-box");

if (searchAyatInput) {
  searchAyatInput.addEventListener("input", () => {
    const searchTerm = searchAyatInput.value.toLowerCase();
    filterAyat(searchTerm);
  });
}

function filterAyat(searchTerm) {
  fetch(`https://equran.id/api/v2/surat/${nomorsurat}`)
    .then((response) => response.json())
    .then((response) => {
      const surat = response.data.ayat;

      // Filter ayat berdasarkan nomor
      const filteredAyat = surat.filter((s) =>
        s.nomorAyat.toString().includes(searchTerm)
      );

      // Tampilkan ayat yang difilter
      let isiSurat = "";
      filteredAyat.forEach((s) => {
        isiSurat += `
            <div class="card mb-3">
              <div class="card-body">
                <p>${s.nomorAyat}</p>
                <h3 class="text-end mb-2">${s.teksArab}</h3>
                <p>${s.teksLatin}</p>
                <p>${s.teksIndonesia}</p>
              </div>
            </div>
          `;
      });

      const cardIsiSurat = document.querySelector(".card-isi-surat");
      cardIsiSurat.innerHTML = isiSurat;

      // Jika tidak ada hasil
      if (filteredAyat.length === 0) {
        cardIsiSurat.innerHTML = `<p class="text-center">Ayat tidak ditemukan untuk kata kunci "${searchTerm}"</p>`;
      }
    })
    .catch((error) => {
      console.error("Error fetching ayat:", error);
    });
}

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
