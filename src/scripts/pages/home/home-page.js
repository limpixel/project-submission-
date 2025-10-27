export default class HomePage {
  async render() {
    return `
      <section id="home-page" class="container" style="
        max-width: 1440px;
        margin: 2rem auto;
        padding: 1.5rem;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        font-family: 'Inter', sans-serif;
      ">
        <h1 style="text-align:center; margin-bottom: 1.5rem; color: #2c3e50;">📚 Daftar Cerita</h1>

        <!-- Filter lokasi dan tombol tambah -->
        <div style="
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        ">
          <div style="flex: 1;">
            <label for="region-filter" style="font-weight: 600; color: #34495e;">Filter berdasarkan daerah:</label>
            <select id="region-filter" style="
              margin-left: 8px;
              padding: 8px 10px;
              border-radius: 6px;
              border: 1px solid #ccc;
              font-size: 14px;
            ">
              <option value="all">Semua Daerah</option>
            </select>
          </div>

          <a href="#/data-add" class="btn-add-story" style="
            background-color: #3498db;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            transition: 0.2s;
          " onmouseover="this.style.backgroundColor='#2980b9'" onmouseout="this.style.backgroundColor='#3498db'">
            + Tambah Cerita
          </a>
        </div>

        <!-- Daftar cerita -->
        <div id="story-list" class="story-list" style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.2rem;
        "></div>

        <h2 style="
          margin-top: 2rem;
          text-align: center;
          color: #2c3e50;
          border-top: 1px solid #eee;
          padding-top: 1rem;
        ">
          🗺️ Peta Lokasi Cerita
        </h2>
        <div id="map" class="map-container" style="
          width: 100%;
          height: 400px;
          margin-top: 1rem;
          border-radius: 8px;
          overflow: hidden;
        "></div>
      </section>
    `;
  }

  async afterRender() {
    const page = document.querySelector("#home-page");
    setTimeout(() => page.classList.add("active"), 50);
    
    

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLXpCQlFEcnJlVE9ZeVBMVEciLCJpYXQiOjE3NjEzMTcyOTB9.wIcMYXX4BZnWCPHneqm0g9gGKvigm5IYu6cYlTaPRcE";

    const limitText = (text, maxLength = 100) =>
      text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

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
      } catch {
        return "Tidak diketahui";
      }
    };

    try {
      const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      const storyListContainer = document.getElementById("story-list");
      storyListContainer.innerHTML = "";

      // 🗺️ Inisialisasi peta
      const map = L.map("map").setView([-2.5, 118], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const regionSet = new Set();

      if (data.listStory?.length) {
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

          // 🎴 Card tampilan
          storyItem.innerHTML = `
            <div class="story-card" style="
              background: #f9fafb;
              border: 1px solid #e1e1e1;
              border-radius: 10px;
              overflow: hidden;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 6px 14px rgba(0,0,0,0.08)';"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
              
              <img src="${story.photoUrl}" alt="${story.name}" style="
                width: 100%;
                height: 180px;
                object-fit: cover;
              "/>
              
              <div style="padding: 0.8rem 1rem;">
                <h3 style="margin-bottom: 0.4rem; color:#2c3e50;">${story.name}</h3>
                <p style="font-size: 14px; color:#555; line-height:1.4;">${limitText(
                  story.description,
                  100
                )}</p>
                <p class="story-location" style="
                  margin-top: 0.5rem;
                  font-size: 13px;
                  color: #777;
                ">
                  📍 ${locationName} (${latitude}, ${longitude})
                </p>
              </div>
            </div>
          `;
          storyListContainer.appendChild(storyItem);

          if (story.lat && story.lon) {
            const marker = L.marker([story.lat, story.lon]).addTo(map);
            const popupContent = `
              <div style="text-align:center; width:160px;">
                <img src="${story.photoUrl}" alt="${story.name}" width="100%" style="border-radius:8px; margin-bottom:4px;"/>
                <h4 style="margin:4px 0;">${story.name}</h4>
                <p style="font-size:12px; color:#555;">${limitText(
                  story.description,
                  80
                )}</p>
                <p style="font-size:11px; color:#777;">📍 ${locationName}</p>
                <p style="font-size:11px; color:#999;">(${latitude}, ${longitude})</p>
              </div>
            `;
            marker.bindPopup(popupContent);
          }
        }

        // Dropdown filter lokasi
        const regionFilter = document.getElementById("region-filter");
        regionSet.forEach((region) => {
          const option = document.createElement("option");
          option.value = region;
          option.textContent = region;
          regionFilter.appendChild(option);
        });

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
        storyListContainer.innerHTML = `<p style="text-align:center;">Tidak ada data story tersedia.</p>`;
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("story-list").innerHTML =
        `<p style="color:red; text-align:center;">Gagal memuat data stories.</p>`;
    }
  }
}
