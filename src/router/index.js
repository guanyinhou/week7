import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/front/Home.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/front/Login.vue")
  },
  {
    path: "/admin",
    name: "Nav",
    component: () => import("../views/back/layout/Nav.vue"),
    children: [
      {
        name: "Products",
        path: "products",
        component: () => import("../views/back/Products.vue"),
        meta: { requiresAuth: true }
      },
      {
        name: "Coupon",
        path: "coupon",
        component: () => import("../views/back/Coupon.vue"),
        meta: { requiresAuth: true }
      },
      {
        name: "Pictures",
        path: "pictures",
        component: () => import("../views/back/Pictures.vue"),
        meta: { requiresAuth: true }
      },
      {
        name: "Orders",
        path: "orders",
        component: () => import("../views/back/Orders.vue"),
        meta: { requiresAuth: true }
      },
      {
        name: "Animate",
        path: "animate",
        component: () => import("../views/back/Animate.vue"),
        meta: { requiresAuth: true }
      },
      {
        name: "CheckoutResult",
        path: "checkout_result/:orderId",
        component: () => import("../views/back/CheckoutResult.vue"),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
