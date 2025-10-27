export default class AboutPage {
  async render() {

    const token = localStorage.getItem("token");

    // 🌟 Efek transisi halus antar halaman
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        const main = document.querySelector('#app');
        if (main) {
          main.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 500,
            easing: "ease-in-out",
          });
        }
      });
    }

    return `
      <section id="about-page" class="container">
        <h1>About Page</h1>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
    const page = document.querySelector("#about-page");
    setTimeout(() => {
      page.classList.add('active');
    }, 50);
  }
}
