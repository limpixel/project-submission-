export default class AddPage {
  async render() {
    return `
      <section id="add-page" class="container">
        <h1>Tambah Data Baru</h1>

        <form id="add-form" enctype="multipart/form-data">
          <div class="form-group">
            <label>Deskripsi:</label>
            <textarea id="deskripsi" required></textarea>
          </div>

          <div class="form-group">
            <label>Gambar:</label>
            <input type="file" id="gambar" accept="image/*" required />
          </div>

          <div class="form-group">
            <label>Latitude:</label>
            <input type="text" id="latitude" readonly />
          </div>

          <div class="form-group">
            <label>Longitude:</label>
            <input type="text" id="longitude" readonly />
          </div>

          <p id="koordinat">Koordinat dipilih: -</p>

          <div id="map" style="height: 300px; margin-top: 10px; border-radius: 10px; overflow: hidden;"></div>

          <button type="submit" id="kirim">Kirim Data</button>
        </form>

        <p id="response-message" style="margin-top: 10px;"></p>
      </section>
    `;
  }

  async afterRender() {
    // Ambil token user
    const token = localStorage.getItem("token");

    // Proteksi halaman jika belum login
    if (!token) {
      alert("Anda harus login terlebih dahulu!");
      window.location.hash = "#/login";
      console.warn("User not authenticated. Redirecting to login.");
      return;
    }

    // Tambahkan CSS Leaflet
    const leafletCss = document.createElement("link");
    leafletCss.rel = "stylesheet";
    leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(leafletCss);

    // Tambahkan JS Leaflet dan jalankan map setelah load
    const leafletJs = document.createElement("script");
    leafletJs.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    leafletJs.onload = () => {
      this.initMap();
      this.handleFormSubmit(token);
    };
    document.body.appendChild(leafletJs);
  }

  initMap() {
    const mapElement = document.getElementById("map");
    if (!mapElement) {
      console.error("Elemen map tidak ditemukan.");
      return;
    }

    // Inisialisasi peta
    const map = L.map("map").setView([-6.2, 106.816666], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    let marker;

    // Event klik untuk ambil koordinat
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;

      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map);

      document.getElementById("latitude").value = lat.toFixed(5);
      document.getElementById("longitude").value = lng.toFixed(5);
      document.getElementById("koordinat").textContent = `Koordinat dipilih: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    });

    console.log("Peta berhasil diinisialisasi.");
  }

  handleFormSubmit(token) {
    const form = document.getElementById("add-form");
    const message = document.getElementById("response-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const deskripsi = document.getElementById("deskripsi").value.trim();
      const gambar = document.getElementById("gambar").files[0];
      const lat = document.getElementById("latitude").value;
      const lon = document.getElementById("longitude").value;

      // 🔍 Validasi manual tambahan
      if (deskripsi.length < 10) {
        message.textContent = "Deskripsi minimal 10 karakter.";
        message.style.color = "red";
        return;
      }


      if (!deskripsi || !gambar) {
        message.textContent = "Deskripsi dan gambar wajib diisi.";
        message.style.color = "red";
        return;
      }

      if (gambar.size > 1024 * 1024) {
        message.textContent = "Ukuran gambar maksimal 1MB.";
        message.style.color = "red";
        return;
      }

      const formData = new FormData();
      formData.append("description", deskripsi);
      formData.append("photo", gambar);
      if (lat && lon) {
        formData.append("lat", parseFloat(lat));
        formData.append("lon", parseFloat(lon));
      }

      message.textContent = "Mengirim data...";
      message.style.color = "gray";

      try {
        const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          message.textContent = "✅ Data berhasil dikirim!";
          message.style.color = "green";
          form.reset();
        } else {
          message.textContent = `❌ Gagal: ${result.message}`;
          message.style.color = "red";
        }
      } catch (error) {
        message.textContent = `⚠️ Terjadi kesalahan: ${error.message}`;
        message.style.color = "red";
      }
    });
  }
}
