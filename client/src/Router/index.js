import Vue from "vue";
import Router from "vue-router";
import homeView from "../components/home.vue";
import adminView from "../views/admin.vue";
import adminDash from "../components/admin/adminDash.vue";
import doctorView from "../views/doctor.vue";
import adminDoc from "../components/admin/doctors.vue";
import nurseView from "../views/nurse.vue";
import adminNurse from "../components/admin/nurses.vue";
import messages from "../components/messages.vue";
import bookings from "../components/bookings.vue";
import patientList from "../components/patient.vue";
import nurseDash from "../components/nurse/dashboard.vue";
import docDash from "../components/doctor/dashboard.vue";
import bedAllotment from "../components/bedAllotment.vue";
import rapport from '../components/rapport.vue';
import prescription from '../components/doctor/prescription.vue';
import profil from '../components/profil.vue';
Vue.use(Router);

const router = new Router({
  // Older browser support for SPA
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: homeView
    },

    {
      path: "/admin",
      name: "admin",
      component: adminView,
      meta: { requiresAuth: true },
      children: [
        {
          path: "adminDash",
          name: "adminDash",
          component: adminDash
        },
        {
          path: "adminDoc",
          name: "adminDoc",
          component: adminDoc
        },
        {
          path: "adminNurse",
          name: "adminNurse",
          component: adminNurse
        },
        {
          path: "messages",
          name: "messages",
          component: messages
        },

        {
          path: "bookings",
          name: "bookings",
          component: bookings
        },

        {
          path: "patientList",
          name: "patientList",
          component: patientList
        },

        {
          path: "bedAllotment",
          name: "bedAllotment",
          component: bedAllotment
        },
        {
          path: "rapport",
          name: "rapport",
          component: rapport
        },

        {
          path: "profil",
          name: "profil",
          component: profil
        }
      ]
    },

    {
      path: "/doctor",
      name: "doctor",
      component: doctorView,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "docDash",
          name: "docDash",
          component: docDash
        },

        {
          path: "bookings",
          name: "bookingsDoc",
          component: bookings
        },
        {
          path: "patientList",
          name: "patientListDoc",
          component: patientList
        },
        {
          path: "messages",
          name: "messages",
          component: messages
        },
        {
          path: "bedAllotment",
          name: "bedAllotmentDoc",
          component: bedAllotment
        },
        {
          path: "prescription",
          name: "prescription",
          component: prescription
        },
        {
          path: "rapport",
          name: "rapportDoc",
          component: rapport
        },
        {
          path: "profil",
          name: "profilDoc",
          component: profil
        }
      ]
    },

    {
      path: "/nurse",
      name: "nurse",
      component: nurseView,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "nurseDash",
          name: "nurseDash",
          component: nurseDash
        },
        {
          path: "bookings",
          name: "bookingsNur",
          component: bookings
        },
        {
          path: "messages",
          name: "messages",
          component: messages
        },
        {
          path: "patientList",
          name: "patientListNur",
          component: patientList
        },
        {
          path: "bedAllotment",
          name: "bedAllotmentNur",
          component: bedAllotment
        },
        {
          path: "rapport",
          name: "rapportNur",
          component: rapport
        },
        {
          path: "profil",
          name: "profilNur",
          component: profil
        }
      ]
    }
  ]
});

// ? If token doest exist, redirect to homepage
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.getItem("accesToken")) {
      next("/");
    } else {
      if (from.path !== to.path) {
        next();
      }
    }
  } else {
    next();
  }
});
export default router;
