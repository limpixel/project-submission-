import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    // Kriteria 1 - Animation 
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];
    
    // Transisi Halaman
    this.#content.innerHTML = await page.render();
    await new Promise((resolve) => setTimeout(resolve, 20)); // Delay kecil untuk memastikan render selesai sebelum afterRender dipanggil

    this.#content.innerHTML = await page.render();

    // after content has been load, animation will be coming 
    this.#content.classList.remove('fade-out');
    this.#content.classList.add('fade-in');
    
    await page.afterRender();

    // Reset animation 
    setTimeout(()=> {
      this.#content.classList.remove('fade-in');
    }, 400)
  }
}

export default App;
