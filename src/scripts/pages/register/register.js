export default class RegisterPage {
  async render() {
    return `
      <section class="auth-container" style="max-width:400px;margin:4rem auto;padding:2rem;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.1);font-family:Inter,sans-serif;">
        <h2 style="text-align:center;margin-bottom:1.5rem;color:#2c3e50;">📝 Daftar Akun</h2>

        <form id="register-form" style="display:flex;flex-direction:column;gap:1rem;">
          <input id="name" type="text" placeholder="Nama Lengkap" required style="padding:10px;border:1px solid #ccc;border-radius:6px;">
          <input id="email" type="email" placeholder="Email" required style="padding:10px;border:1px solid #ccc;border-radius:6px;">
          <input id="password" type="password" placeholder="Password" required style="padding:10px;border:1px solid #ccc;border-radius:6px;">
          <button type="submit" style="background:#2ecc71;color:white;padding:10px;border:none;border-radius:6px;font-weight:600;cursor:pointer;">Daftar</button>
        </form>

        <p style="text-align:center;margin-top:1rem;font-size:14px;">
          Sudah punya akun? <a href="#/login" style="color:#3498db;">Login disini</a>
        </p>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById("register-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const res = await fetch("https://story-api.dicoding.dev/v1/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          alert("✅ Registrasi berhasil! Silakan login.");
          window.location.hash = "#/login";
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
