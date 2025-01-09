const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");
const searchButton = document.querySelector("#search-button");

searchButton.onclick = (e) => {
  searchForm.classList.toggle("active");
  searchBox.focus();
  e.preventDefault();
};

document.addEventListener("click", function (e) {
  if (!searchButton.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove("active");
  }
});

function getURL(param) {
  const pageURL = window.location.search.substring(1);
  const urlVariables = pageURL.split("&");

  for (const variable of urlVariables) {
    const [key, value] = variable.split("=");
    if (key === param) {
      return value;
    }
  }
  return null;
}

const nomorsurat = getURL("nomorsurat");

function getSurat(nomorSurat) {
  fetch("http://127.0.0.1:8000/api/suratall")
    .then((response) => response.json())
    .then((response) => {
      const suratDataArray = response.data;
      const suratData = suratDataArray.find(
        (surat) => surat.nomor === nomorSurat
      );

      if (!suratData) {
        console.error(`Nomor surat ${nomorSurat} tidak ditemukan.`);
        return;
      }

      const titleSurat = document.querySelector("#title-surat");
      if (titleSurat) {
        titleSurat.textContent = `Surat ${suratData.nama_latin}`;
      }

      const judulSurat = document.querySelector(".judul-surat");
      const audioUrl = suratData.audio_full
        ? JSON.parse(suratData.audio_full)["05"]
        : null;
      const cardJudulSurat = `
        <div class="judul-surat-container text-center mb-4">
          <h2 class="text mb-2">${suratData.nama_latin} (${suratData.nama})</h2>
          <p class="text-muted">Jumlah Ayat: ${suratData.jumlah_ayat} | Arti: ${
        suratData.arti
      }</p>
          <p class="text-muted">Tempat Turun: ${suratData.tempat_turun}
          <p class="text-muted">${suratData.deskripsi}
      }</p>
          ${
            audioUrl
              ? `
          <div class="audio-controls mt-3">
            <button class="btn btn-primary audio-button-play">Play</button>
            <button class="btn btn-danger hidden-button audio-button-pause">Pause</button>
            <audio id="audio-tag" src="${audioUrl}"></audio>
          </div>
          `
              : "<p class='text-warning'>Audio tidak tersedia</p>"
          }
          <button class="btn btn-secondary mt-3" onclick="location.href='tafsir.html?nomorsurat=${
            suratData.nomor
          }'">
            Lihat Tafsir
          </button>
          <h1 class="mt-5"><center>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</center></h1>
        </div>
      `;

      if (judulSurat) {
        judulSurat.innerHTML = cardJudulSurat;
      }

      fetch(`http://127.0.0.1:8000/api/ayat/${nomorSurat}`)
        .then((response) => response.json())
        .then((response) => {
          const suratAyat = response.data;
          let isiSurat = "";

          suratAyat.forEach((ayat) => {
            const audioObj = ayat.audio ? JSON.parse(ayat.audio) : null;
            const audioAyat = audioObj ? audioObj["05"] : null;

            isiSurat += `
              <div class="card mb-3">
                <div class="card-body">
                  <p>Ayat ${ayat.nomor_ayat}</p>
                  <h1 class="text-end mb-2">${ayat.teks_arab}</h1>
                  <p>${ayat.teks_latin}</p>
                  <p>${ayat.teks_indo}</p>
                  ${
                    audioAyat
                      ? `
                    <button class="btn btn-primary audio-button-play">Play</button>
                    <button class="btn btn-danger hidden-button audio-button-pause">Pause</button>
                    <audio id="audio-tag" src="${audioAyat}"></audio>
                  `
                      : "<p>Audio tidak tersedia untuk ayat ini.</p>"
                  }
                </div>
              </div>
            `;
          });

          const cardIsiSurat = document.querySelector(".card-isi-surat");
          if (cardIsiSurat) {
            cardIsiSurat.innerHTML = isiSurat;

            // Tambahkan event listener untuk tombol Play/Pause dan pemutaran berurutan
            function addAudioEventListeners() {
              const audioElements = document.querySelectorAll("audio");
              audioElements.forEach((audio, index) => {
                const parentElement = audio.parentElement;
                const playButton =
                  parentElement.querySelector(".audio-button-play");
                const pauseButton = parentElement.querySelector(
                  ".audio-button-pause"
                );

                // Tombol Play
                playButton.addEventListener("click", () => {
                  audio.play();
                  playButton.classList.add("hidden-button");
                  pauseButton.classList.remove("hidden-button");
                });

                // Tombol Pause
                pauseButton.addEventListener("click", () => {
                  audio.pause();
                  playButton.classList.remove("hidden-button");
                  pauseButton.classList.add("hidden-button");
                });

                // Pemutaran berurutan ketika audio selesai
                audio.addEventListener("ended", () => {
                  playButton.classList.remove("hidden-button");
                  pauseButton.classList.add("hidden-button");

                  // Cek apakah ada elemen audio berikutnya
                  const nextAudio = audioElements[index + 1];
                  if (nextAudio) {
                    const nextParent = nextAudio.parentElement;
                    const nextPlayButton =
                      nextParent.querySelector(".audio-button-play");
                    nextPlayButton.click(); // Mainkan audio berikutnya secara otomatis
                  }
                });
              });
            }
          }
        })
        .catch((error) => console.error("Error fetching ayat:", error));
    })
    .catch((error) => console.error("Error fetching surat:", error));
}

const urlParams = new URLSearchParams(window.location.search);
const nomorSurat = parseInt(urlParams.get("nomorsurat"));
if (!isNaN(nomorSurat)) {
  getSurat(nomorSurat);
} else {
  console.error("Nomor surat tidak valid di URL.");
}

// Event listener untuk pencarian ayat
const searchAyatInput = document.querySelector("#search-box");

if (searchAyatInput) {
  searchAyatInput.addEventListener("input", () => {
    const searchTerm = searchAyatInput.value.toLowerCase();
    filterAyat(searchTerm);
  });
}

function filterAyat(searchTerm) {
  fetch(`http://127.0.0.1:8000/api/ayat/${nomorsurat}`) // Gunakan API lokal
    .then((response) => response.json())
    .then((response) => {
      const surat = response.data;

      // Filter ayat berdasarkan nomor atau teks
      const filteredAyat = surat.filter((s) =>
        s.nomor_ayat.toString().includes(searchTerm)
      );

      // Tampilkan ayat yang difilter
      let isiSurat = "";
      filteredAyat.forEach((ayat) => {
        const audioObj = ayat.audio ? JSON.parse(ayat.audio) : null;
        const audioAyat = audioObj ? audioObj["05"] : null;

        isiSurat += `
          <div class="card mb-3">
            <div class="card-body">
              <p>Ayat ${ayat.nomor_ayat}</p>
              <h1 class="text-end mb-2">${ayat.teks_arab}</h1>
              <p>${ayat.teks_latin}</p>
              <p>${ayat.teks_indo}</p>
              ${
                audioAyat
                  ? `
                <button class="btn btn-primary audio-button-play">Play</button>
                <button class="btn btn-danger hidden-button audio-button-pause">Pause</button>
                <audio id="audio-tag" src="${audioAyat}"></audio>
              `
                  : "<p>Audio tidak tersedia untuk ayat ini.</p>"
              }
            </div>
          </div>
        `;
      });

      const cardIsiSurat = document.querySelector(".card-isi-surat");
      cardIsiSurat.innerHTML = isiSurat;

      // Tambahkan event listener untuk tombol Play/Pause
      addAudioEventListeners();

      // Jika tidak ada hasil
      if (filteredAyat.length === 0) {
        cardIsiSurat.innerHTML = `<p class="text-center">Ayat tidak ditemukan untuk kata kunci "${searchTerm}"</p>`;
      }
    })
    .catch((error) => {
      console.error("Error fetching ayat:", error);
    });
}

function addAudioEventListeners() {
  const audioElements = document.querySelectorAll("audio");
  audioElements.forEach((audio, index) => {
    const parentElement = audio.parentElement;
    const playButton = parentElement.querySelector(".audio-button-play");
    const pauseButton = parentElement.querySelector(".audio-button-pause");

    // Tombol Play
    playButton.addEventListener("click", () => {
      audio.play();
      playButton.classList.add("hidden-button");
      pauseButton.classList.remove("hidden-button");
    });

    // Tombol Pause
    pauseButton.addEventListener("click", () => {
      audio.pause();
      playButton.classList.remove("hidden-button");
      pauseButton.classList.add("hidden-button");
    });
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
