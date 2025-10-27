export default class LoginPage {
  async render() {
    return `
      <section class="auth-container" style="max-width:400px;margin:4rem auto;padding:2rem;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.1);font-family:Inter,sans-serif;">
        <h2 style="text-align:center;margin-bottom:1.5rem;color:#2c3e50;">🔐 Login Akun</h2>

        <form id="login-form" style="display:flex;flex-direction:column;gap:1rem;">
          <input id="email" type="email" placeholder="Email" required style="padding:10px;border:1px solid #ccc;border-radius:6px;">
          <input id="password" type="password" placeholder="Password" required style="padding:10px;border:1px solid #ccc;border-radius:6px;">
          <button type="submit" style="background:#3498db;color:white;padding:10px;border:none;border-radius:6px;font-weight:600;cursor:pointer;">Login</button>
        </form>

        <p style="text-align:center;margin-top:1rem;font-size:14px;">
          Belum punya akun? <a href="#/register" style="color:#3498db;">Daftar disini</a>
        </p>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById("login-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const res = await fetch("https://story-api.dicoding.dev/v1/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          // Simpan token loginResult
          localStorage.setItem("token", data.loginResult.token);
          localStorage.setItem("user", JSON.stringify(data.loginResult));
          alert("✅ Login berhasil!");
          window.location.hash = "#/home";
        } else {
          alert(`❌ Gagal: ${data.message}`);
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ Terjadi kesalahan koneksi.");
      }
    });
  }
}
