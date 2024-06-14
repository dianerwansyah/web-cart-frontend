import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import UserLogin from '../views/UserLogin.vue';
import ProfilePage from '../views/ProfilePage.vue';
import UserRegister from '../views/UserRegister.vue';
import ProductDetail from '../views/widget/ProductDetail.vue';
import SummaryPage from '../views/SummaryPage.vue'; // Import SummaryPage
import CartPage from '../views/CartPage.vue'; // Import CartPage
import HistoryPage from '../views/HistoryPage.vue'; // Import HistoryPage
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: UserRegister
  },
  {
    path: '/product',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/cart',
    name: 'CartPage',
    component: CartPage,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/summary',
    name: 'SummaryPage',
    component: SummaryPage,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/history',
    name: 'HistoryPage',
    component: HistoryPage,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/profile',
    name: 'ProfilePage',
    component: ProfilePage,
    meta: {
      requiresAuth: true,
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn;
  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
