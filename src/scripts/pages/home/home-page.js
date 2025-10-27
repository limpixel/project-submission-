

export default class HomePage {
  async render() {
    return `
      <section id="home-page" class="container">
        <h1>Daftar Cerita</h1>

        <!-- Filter lokasi -->
        <div style="margin: 1rem 0;">
          <label for="region-filter"><b>Filter berdasarkan daerah:</b></label>
          <select id="region-filter" style="margin-left: 8px; padding: 6px;">
            <option value="all">Semua Daerah</option>
          </select>
        </div>

        <div id="story-list" class="story-list"></div>

        <h2 style="margin-top: 2rem;">Peta Lokasi Cerita</h2>
        <div id="map" class="map-container"></div>
      </section>
    `;
  }

  async afterRender() {
    const page = document.querySelector("#home-page");
    setTimeout(() => page.classList.add("active"), 50);

    // 🪪 Token login
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLXpCQlFEcnJlVE9ZeVBMVEciLCJpYXQiOjE3NjEzMTcyOTB9.wIcMYXX4BZnWCPHneqm0g9gGKvigm5IYu6cYlTaPRcE";

    // 🔤 Fungsi membatasi panjang teks agar rapi
    const limitText = (text, maxLength = 100) =>
      text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

    // 🌍 Fungsi untuk mendapatkan nama lokasi dari lat/lon
    const getLocationName = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();
        return (
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county ||
          "Tidak diketahui"
        );
      } catch (err) {
        console.error("Reverse geocoding error:", err);
        return "Tidak diketahui";
      }
    };

    try {
      // 🔽 Ambil data story dari API Dicoding
      const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      const storyListContainer = document.getElementById("story-list");
      storyListContainer.innerHTML = "";

      // 🗺️ Inisialisasi peta
      const map = L.map("map").setView([-2.5, 118], 5); // pusat Indonesia
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // 🗂️ Kumpulan nama daerah unik untuk filter dropdown
      const regionSet = new Set();

      if (data.listStory && data.listStory.length > 0) {
        for (const story of data.listStory) {
          const storyItem = document.createElement("div");
          storyItem.classList.add("story-item");

          let locationName = "Tidak diketahui";
          if (story.lat && story.lon) {
            locationName = await getLocationName(story.lat, story.lon);
            regionSet.add(locationName);
          }

          const latitude = story.lat ? story.lat.toFixed(5) : "-";
          const longitude = story.lon ? story.lon.toFixed(5) : "-";

          // 🎴 Render card list
          storyItem.innerHTML = `
            <div class="story-card">
              <img src="${story.photoUrl}" alt="${story.name}" class="story-image" />
              <div class="story-info">
                <h3>${story.name}</h3>
                <p>${limitText(story.description, 100)}</p>
                <p class="story-location">📍 ${locationName} (${latitude}, ${longitude})</p>
              </div>
            </div>
          `;
          storyListContainer.appendChild(storyItem);

          // 📍 Tambahkan marker pada peta
          if (story.lat && story.lon) {
            const marker = L.marker([story.lat, story.lon]).addTo(map);

            // 💬 Popup detail pada marker
            const popupContent = `
              <div style="text-align:center; width:160px;">
                <img src="${story.photoUrl}" alt="${story.name}" width="100%" style="border-radius:8px; margin-bottom:4px;"/>
                <h4 style="margin:4px 0;">${story.name}</h4>
                <p style="font-size:12px; color:#555;">${limitText(story.description, 80)}</p>
                <p style="font-size:11px; color:#777;">📍 ${locationName}</p>
                <p style="font-size:11px; color:#999;">(${latitude}, ${longitude})</p>
              </div>
            `;
            marker.bindPopup(popupContent);
          }
        }

        // 🧩 Isi dropdown filter daerah
        const regionFilter = document.getElementById("region-filter");
        regionSet.forEach((region) => {
          const option = document.createElement("option");
          option.value = region;
          option.textContent = region;
          regionFilter.appendChild(option);
        });

        // 🔍 Event filter lokasi
        regionFilter.addEventListener("change", (e) => {
          const selected = e.target.value.toLowerCase();
          document.querySelectorAll(".story-item").forEach((card) => {
            const locationText = card
              .querySelector(".story-location")
              .textContent.toLowerCase();
            card.style.display =
              selected === "all" || locationText.includes(selected)
                ? "block"
                : "none";
          });
        });
      } else {
        storyListContainer.innerHTML = `<p>Tidak ada data story tersedia.</p>`;
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("story-list").innerHTML =
        `<p>Gagal memuat data stories.</p>`;
    }
  }
}
