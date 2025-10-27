export default class HomePage {
  async render() {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user")) || {};

    // 🌟 Efek transisi halus
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        const main = document.querySelector("#app");
        if (main) {
          main.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 500,
            easing: "ease-in-out",
          });
        }
      });
    }

    // 🌟 Tampilan halaman utama
    return `
      <section id="home-page" style="
        max-width: 1280px;
        margin: 2rem auto;
        padding: 1.5rem;
        font-family: 'Inter', sans-serif;
      ">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <h1 style="color:#2c3e50;">📚 Daftar Cerita</h1>
          <div id="user-info" style="font-size:15px; color:#34495e;">
            ${
              token
                ? `👋 Halo, <strong>${userData.name || "Pengguna"}</strong>
                   <button id="logout-btn" style="
                     margin-left:10px; background:#e74c3c; color:white; border:none;
                     padding:6px 12px; border-radius:6px; cursor:pointer;
                   ">Keluar</button>`
                : `<button id="open-auth-btn" style="
                     background:#3498db; color:white; border:none; padding:6px 12px;
                     border-radius:6px; cursor:pointer;
                   ">Login / Daftar</button>`
            }
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <div>
            <label for="region-filter" style="font-weight:600; color:#34495e;">Filter lokasi:</label>
            <select id="region-filter" style="
              margin-left:8px; padding:8px; border-radius:6px; border:1px solid #ccc;
            ">
              <option value="all">Semua Daerah</option>
            </select>
          </div>
          ${
            token
              ? `<a href="#/data-add" style="
                   background-color:#3498db; color:white; padding:8px 16px; border-radius:6px;
                   text-decoration:none; font-weight:600;
                 ">+ Tambah Cerita</a>`
              : `<button id="open-auth-btn-2" style="
                   background-color:#95a5a6; color:white; padding:8px 16px; border-radius:6px;
                   font-weight:600; cursor:pointer;
                 ">Login untuk Menambah Cerita</button>`
          }
        </div>

        <div id="story-list" style="
          display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
          gap:1.2rem;
        "></div>

        <h2 style="margin-top:2rem; text-align:center; color:#2c3e50;">🗺️ Peta Lokasi Cerita</h2>
        <div id="map" style="width:100%; height:400px; border-radius:8px; overflow:hidden; margin-top:1rem;"></div>

        <!-- Modal Login/Register -->
        <div id="auth-modal" style="
          display:none; position:fixed; top:0; left:0; width:100%; height:100%;
          background:rgba(0,0,0,0.5); justify-content:center; align-items:center;
          z-index:9999; backdrop-filter: blur(3px);
        ">
          <div style="
            background:white; padding:2rem; border-radius:16px; width:90%; max-width:400px;
            box-shadow:0 4px 20px rgba(0,0,0,0.2); text-align:center;
            overflow:hidden; box-sizing:border-box;
          ">
            <h2 style="color:#2c3e50; margin-bottom:1rem;">Masuk atau Daftar</h2>
            
            <div id="auth-tabs" style="
              display:flex; justify-content:center; margin-bottom:1rem; border-radius:8px; overflow:hidden;
            ">
              <button id="tab-login" class="active" style="
                flex:1; padding:10px; border:none; background:#3498db; color:white;
                font-weight:600; cursor:pointer; transition:background 0.3s;
              ">Login</button>
              <button id="tab-register" style="
                flex:1; padding:10px; border:none; background:#ecf0f1; color:#2c3e50;
                font-weight:600; cursor:pointer; transition:background 0.3s;
              ">Daftar</button>
            </div>

            <form id="login-form" style="display:block; margin-top:1rem;">
              <div style="display:flex; flex-direction:column; gap:10px;">
                <input type="email" id="email" placeholder="Email" required style="
                  width:80%; padding:10px; border:1px solid #ccc; border-radius:6px;
                "/>
                <input type="password" id="password" placeholder="Password" required style="
                  width:80%; padding:10px; border:1px solid #ccc; border-radius:6px;
                "/>
                <button type="submit" style="
                  width:80%; background:#3498db; color:white; border:none;
                  padding:10px; border-radius:6px; cursor:pointer; font-weight:600;
                ">Login</button>
              </div>
            </form>

            <form id="register-form" style="display:none; margin-top:1rem;">
              <div style="display:flex; flex-direction:column; gap:10px;">
                <input type="text" id="name" placeholder="Nama Lengkap" required style="
                  width:80%; padding:10px; border:1px solid #ccc; border-radius:6px;
                "/>
                <input type="email" id="reg-email" placeholder="Email" required style="
                  width:80%; padding:10px; border:1px solid #ccc; border-radius:6px;
                "/>
                <input type="password" id="reg-password" placeholder="Password" required style="
                  width:80%; padding:10px; border:1px solid #ccc; border-radius:6px;
                "/>
                <button type="submit" style="
                  width:80%; background:#2ecc71; color:white; border:none;
                  padding:10px; border-radius:6px; cursor:pointer; font-weight:600;
                ">Daftar</button>
              </div>
            </form>

            <p id="auth-message" style="margin-top:10px; color:#555; font-size:14px;"></p>
            <button id="close-modal" style="
              margin-top:15px; background:#e74c3c; color:white;
              border:none; padding:8px 16px; border-radius:6px; cursor:pointer;
            ">Tutup</button>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem("token");
    const modal = document.getElementById("auth-modal");

    // 🌍 Muat data cerita
    await this.loadStories(token);

    // 🌟 Logout otomatis tanpa refresh manual
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("✅ Anda telah logout!");
        window.location.href = "#/"; // langsung reload ke home tanpa refresh manual
      });
    }

    // 🌟 Tampilkan modal login/register
    const openAuthBtns = document.querySelectorAll("#open-auth-btn, #open-auth-btn-2");
    openAuthBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        modal.style.display = "flex";
        this.initAuthForms(modal);
      });
    });

    // Tutup modal
    const closeModal = document.getElementById("close-modal");
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  initAuthForms(modal) {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const message = document.getElementById("auth-message");
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");

    tabLogin.addEventListener("click", () => {
      tabLogin.style.background = "#3498db";
      tabLogin.style.color = "white";
      tabRegister.style.background = "#ecf0f1";
      tabRegister.style.color = "#2c3e50";
      loginForm.style.display = "block";
      registerForm.style.display = "none";
      message.textContent = "";
    });

    tabRegister.addEventListener("click", () => {
      tabRegister.style.background = "#2ecc71";
      tabRegister.style.color = "white";
      tabLogin.style.background = "#ecf0f1";
      tabLogin.style.color = "#2c3e50";
      registerForm.style.display = "block";
      loginForm.style.display = "none";
      message.textContent = "";
    });

    // 🌟 Login
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      message.textContent = "⏳ Sedang login...";
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      const res = await fetch("https://story-api.dicoding.dev/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("token", result.loginResult.token);
        localStorage.setItem("user", JSON.stringify(result.loginResult));
        alert("✅ Login berhasil, selamat datang " + result.loginResult.name + "!");
        window.location.href = "#/"; // auto update tampilan tanpa refresh manual
      } else {
        alert(`❌ ${result.message}`);
      }
    });

    // 🌟 Register
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value.trim();

      const res = await fetch("https://story-api.dicoding.dev/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const result = await res.json();

      if (res.ok) {
        alert("✅ Registrasi berhasil! Silakan login.");
        tabLogin.click();
      } else {
        alert(`❌ ${result.message}`);
      }
    });
  }

  async loadStories(token) {
    try {
      const res = await fetch("https://story-api.dicoding.dev/v1/stories", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      const storyList = document.getElementById("story-list");
      storyList.innerHTML = "";

      // 🌍 Peta
      const map = L.map("map").setView([-2.5, 118], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      if (data.listStory?.length) {
        for (const s of data.listStory) {
          const div = document.createElement("div");
          div.style.background = "#fff";
          div.style.borderRadius = "10px";
          div.style.border = "1px solid #eee";
          div.innerHTML = `
            <img src="${s.photoUrl}" alt="${s.name}" style="width:100%;height:180px;object-fit:cover;"/>
            <div style="padding:0.8rem 1rem;">
              <h3 style="margin:0;color:#2c3e50;">${s.name}</h3>
              <p style="font-size:14px;color:#555;">${s.description.slice(0,100)}...</p>
            </div>`;
          storyList.appendChild(div);

          if (s.lat && s.lon) {
            const m = L.marker([s.lat, s.lon]).addTo(map);
            m.bindPopup(`<b>${s.name}</b><br>${s.description.slice(0,80)}...`);
          }
        }
      } else {
        storyList.innerHTML = "<p style='text-align:center;'>Tidak ada cerita ditemukan.</p>";
      }
    } catch (err) {
      document.getElementById("story-list").innerHTML =
        "<p style='color:red;text-align:center;'>Gagal memuat cerita.</p>";
    }
  }
}
