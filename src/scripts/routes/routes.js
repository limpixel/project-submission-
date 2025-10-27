import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddPage from '../pages/add/add-pages';
import LoginPage from '../pages/login/login';
import RegisterPage from '../pages/register/register';

/**
 * Middleware: cek apakah user sudah login
 * - Kalau belum login, arahkan ke /login dan tampilkan alert
 * - Kalau sudah login, lanjut render halaman normal
 */
function withAuth(pageInstance) {
  return {
    async render() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Anda harus login terlebih dahulu!");
        window.location.hash = "#/login";
        return ""; // jangan render halaman
      }
      return pageInstance.render ? await pageInstance.render() : "";
    },
    async afterRender() {
      const token = localStorage.getItem("token");
      if (!token) return; // tidak perlu lanjut
      if (pageInstance.afterRender) await pageInstance.afterRender();
    }
  };
}

const routes = {
  '/': new HomePage(),
  '/register': new RegisterPage(),
  '/login': new LoginPage(),
  '/home': new HomePage(),
  '/about': new AboutPage(),

  // 🚧 Halaman ini hanya bisa diakses jika sudah login
  '/data-add': withAuth(new AddPage()),
};

export default routes;
