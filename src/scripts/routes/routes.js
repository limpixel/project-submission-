import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddPage from '../pages/add/add-pages';
import LoginPage from '../pages/login/login';
import RegisterPage from '../pages/register/register';

const routes = {
  '/': new HomePage(),
  '/register' : new RegisterPage(),
  '/login' : new LoginPage(),
  '/home': HomePage,
  '/about': new AboutPage(),
  "/data-add" : new AddPage(),
};

export default routes;
