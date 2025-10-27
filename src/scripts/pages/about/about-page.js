export default class AboutPage {
  async render() {
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
