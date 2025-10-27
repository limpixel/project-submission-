export default class AddPage {
  async render() {
    return `
      <section id="add-page" class="container">
        <h1>Tambah Data Baru</h1>

        <div class="form-group">
          <label>Nama:</label>
          <input type="text" id="nama" />
        </div>

        <div class="form-group">
          <label>Deskripsi:</label>
          <textarea id="deskripsi"></textarea>
        </div>

        <div class="form-group">
          <label>Gambar:</label>
          <input type="file" id="gambar" />
        </div>

        <div class="form-group">
          <label>Latitude:</label>
          <input type="text" id="latitude" />
        </div>

        <div class="form-group">
          <label>Longitude:</label>
          <input type="text" id="longitude" />
        </div>

        <p id="koordinat">Koordinat dipilih: -</p>

        <div id="map"></div>

        <button id="kirim">Kirim Data</button>
      </section>
    `;
  }

  async afterRender() {
    // Tambahkan script Leaflet
    const leafletCss = document.createElement('link');
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCss);

    const leafletJs = document.createElement('script');
    leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJs.onload = () => {
      this.initMap();
    };
    document.body.appendChild(leafletJs);
  }

  initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const map = L.map('map').setView([-6.2, 106.816666], 5); // pusat Indonesia

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    let marker;

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;

      // Hapus marker lama kalau ada
      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([lat, lng]).addTo(map);
      document.getElementById('latitude').value = lat;
      document.getElementById('longitude').value = lng;
      document.getElementById('koordinat').textContent =
        `Koordinat dipilih: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    });
  }
}
