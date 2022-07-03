const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "sign-in",
        name: "signIn",
        component: () => import("pages/SignInPage.vue"),
      },
      {
        path: "sign-up",
        name: "signUp",
        component: () => import("pages/SignUpPage.vue"),
      },
      {
        path: "forgot-password",
        name: "forgotPassword",
        component: () => import("pages/ForgotPasswordPage.vue"),
      },
      {
        path: "update-password",
        name: "updatePassword",
        meta: { requiresAuth: false },
        component: () => import("pages/UpdatePasswordPage.vue"),
      },
      {
        path: "contact",
        name: "contact-us",
        meta: { requiresAuth: false },
        component: () => import("pages/ContactPage.vue"),
      },
      {
        path: "panel",
        name: "Panel",
        component: () => import("pages/PanelPage.vue"),
      },
    ],
  },
  {
    path: "/admin/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "voters",
        name: "Voters",
        component: () => import("pages/admin/VotersPage.vue"),
      },
      {
        path: "dashboard",
        name: "Dashbaord",
        meta: { requiresAuth: false },
        component: () => import("pages/admin/DashboardPage.vue"),
      },
      {
        path: "volunteers",
        name: "Volunteers",
        component: () => import("pages/admin/VolunteersPage.vue"),
      },
      {
        path: "candidates",
        name: "Candidates",
        component: () => import("pages/admin/VolunteersPage.vue"),
      },
      {
        path: "cities",
        name: "Cities",
        component: () => import("pages/admin/CitiesPage.vue"),
      },
      {
        path: "areas",
        name: "Areas",
        component: () => import("pages/admin/AreasPage.vue"),
      },
      {
        path: "wards",
        name: "Wards",
        component: () => import("pages/admin/WardsPage.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
