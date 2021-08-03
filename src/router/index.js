import { createRouter, createWebHistory } from 'vue-router'
import store from '../store';
import Home from '../views/Home.vue'
// import axios from "axios";
// import cookie from "@/static/cookie";

// import ProductDetail from '../views/ProductDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/:category_slug',
    name: 'Products',
    component: () => import('../views/Products.vue')
  },
  {
    path: '/:category_slug/:product_slug',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/shopping-cart',
    name: 'Cart',
    component: () => import('../views/Cart.vue'),
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/check-out',
    name: 'CheckOut',
    component: () => import('../views/CheckOut.vue'),
    meta: {
      requireLogin: true,
    }
  },
  {
    path: '/user-home',
    name: 'UserPage',
    component: () => import('../views/UserPage.vue'),
    children: [
      {
        path: '/user-orders',
        name: 'UserOrders',
        component: () => import('../views/UserOrders.vue'),
        meta: {
          requireLogin: true
        }
      },
      {
        path: '/user-address',
        name: 'UserAddress',
        component: () => import('../views/UserAddress.vue'),
        meta: {
          requireLogin: true
        }
      },
      {
        path: '/user-fav',
        name: 'UserFav',
        component: () => import('../views/UserFav.vue'),
        meta: {
          requireLogin: true
        }
      },
      {
        path: '/user-profile',
        name: 'UserProfile',
        component: () => import('../views/UserProfile.vue'),
        meta: {
          requireLogin: true
        }
      },
    ],
    meta: {
      requireLogin: true
    }
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  store.commit("isTokenExpired");
  if (to.matched.some(record => record.meta.requireLogin) && store.state.tokenTimeDiff > 1800) {
    // var refresh_token = {
    //   refresh: localStorage.getItem("refresh"),
    // };

    // console.log('treid again+++++++++++++++++++++++')

    // if (
    //   refresh_token.refresh !== null &&
    //   store.state.tokenTimeDiff < 1800
    // ) {
    //   axios.post("/login/refresh/", refresh_token).then((res) => {
    //     cookie.delCookie("token");
    //     cookie.setCookie("token", res.data.access, 7);

    //     store.commit("setToken");
    //   });
    // }
    next({ name: 'Login', query: { to: to.path } })
  } else {
    next()
  }
});

export default router
