import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddPage from '../pages/add/add-pages';

const routes = {
  '/': new HomePage(),
  '/home': HomePage,
  '/about': new AboutPage(),
  "/data-add" : new AddPage(),
};

export default routes;
