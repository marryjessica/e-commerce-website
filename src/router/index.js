import { createRouter, createWebHistory } from 'vue-router'
import store from '../store';
import Home from '../views/Home.vue'

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
    path: '/shopping_cart',
    name: 'Shopping_cart',
    component: () => import('../components/Shopping_cart.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/products',
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
    path: '/user-profile',
    name: 'UserProfile',
    component: ()=> import('../views/UserProfile.vue'),
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
  if (to.matched.some(record => record.meta.requireLogin) && !store.state.userInfo.name) {
    next({ name: 'Login', query: { to: to.path } })
  } else {
    next()
  }
});

export default router
