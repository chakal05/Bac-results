<template>
  <v-container id="admin">
    <v-app>
      <v-navigation-drawer
        color="teal darken-4"
        dark
        v-model="drawer"
        :clipped="$vuetify.breakpoint.lgAndUp"
        app
      >
        <div class="logo-gris">
          <v-app-bar-nav-icon
            class="bar"
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>
          <v-toolbar-title class="white--text">
            Manedek
            <v-icon>local_hospital</v-icon>
          </v-toolbar-title>
        </div>

        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>dashboard</v-icon>
            </v-list-item-icon>

            <router-link to="/doctor/docDash">
              <v-list-item-title>Dashboard</v-list-item-title>
            </router-link>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>schedule</v-icon>
            </v-list-item-icon>

            <router-link to="/doctor/bookings">
              <v-list-item-title>Bookings</v-list-item-title>
            </router-link>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>fas fa-user</v-icon>
            </v-list-item-icon>

            <router-link to="/doctor/patientList">
              <v-list-item-title>Patients</v-list-item-title>
            </router-link>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>fas fa-stethoscope</v-icon>
            </v-list-item-icon>

            <router-link to="/doctor/prescription">
              <v-list-item-title>Medication</v-list-item-title>
            </router-link>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>fas fa-book</v-icon>
            </v-list-item-icon>

            <router-link to="/doctor/rapport">
              <v-list-item-title>Rapport</v-list-item-title>
            </router-link>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>fas fa-bed</v-icon>
            </v-list-item-icon>

            <router-link to="/doctor/bedAllotment">
              <v-list-item-title>Bed allotment</v-list-item-title>
            </router-link>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>account_box</v-icon>
            </v-list-item-icon>

            <router-link to="/doctor/profil">
              <v-list-item-title>Profil</v-list-item-title>
            </router-link>
          </v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn color="white" @click="logOut" light block>Logout</v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-app-bar app clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title class="mr-5 align-center">
          Manedek Medical Center
          <v-icon color="teal darken-4">local_hospital</v-icon>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-badge color="teal darken-4">
          <template v-slot:badge>
            <span> {{ newMess }} </span>
          </template>
          <router-link to="/admin/messages">
            <v-icon>mdi-email</v-icon>
          </router-link>
        </v-badge>

        <v-col cols="12" sm="4" md="1" class="mt-7">
          <div class="text-center">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn text v-on="on">
                  {{ userName }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in overflow"
                  :key="index"
                  @click="logOut"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-col>
      </v-app-bar>

      <v-content>
        <v-container fill-height>
          <v-layout justify-center align-center>
            <v-flex>
              <router-view />
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </v-container>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
  name: "admin",
  data: () => ({
    overflow: [{ title: "Log out" }],
    drawer: null,
    show: true,
    userName: localStorage.getItem("tokenUserName")
  }),
  computed: { ...mapGetters(["newMess"]) },
  created() {
    //get number of unread messages
    this.notifyMessages();

    // get number of unread messages every 3 seconds
    this.getUnread();
  },

  methods: {
    ...mapMutations(["logOut", "stopTimer"]),

    ...mapActions(["getUnread", "notifyMessages"])
  },

  beforeDestroy() {
    this.stopTimer();
  }
};
</script>

<style  lang='scss' scoped>
@mixin extraLarge() {
  @media (min-width: 1904px) {
    @content;
  }
}

@mixin medium() {
  @media (min-width: 960px) and (max-width: 1263px) {
    @content;
  }
}

@mixin tablette() {
  @media (min-width: 600px) and (max-width: 959px) {
    @content;
  }
}

@mixin desktop() {
  @media (min-width: 1264px) and (max-width: 1903px) {
    @content;
  }
}

@mixin phone {
  @media (max-width: 600px) {
    @content;
  }
}
.container {
  a {
    text-decoration: none;
    color: white;
  }

  .v-application--wrap {
    .v-navigation-drawer {
      .logo-gris {
        @include extraLarge {
          display: none;
        }

        @include desktop {
          display: none;
        }

        .bar {
          margin-left: 0.5rem;
          margin-top: 0.7rem;
        }

        .v-toolbar__title {
          position: relative;
          top: -2.7rem;
          left: 3.3rem;
          font-size: 2rem;

          .v-icon {
            font-size: 2rem;
            margin-left: 0.5rem;
            margin-top: -0.5rem;
          }
        }
      }
    }

    .v-app-bar {
      .v-toolbar__title {
        margin-left: -1rem;
        font-size: 1.5rem;
        margin-top: 0.3rem;

        @include tablette {
          font-size: 1.3rem;
        }
        .v-icon {
          font-size: 3rem;
          margin-left: 0rem;

          @include tablette {
            font-size: 1.3rem;
          }
        }
      }

      .v-badge {
        //   margin: 2.5rem !important;

        @include phone {
          margin: 0 !important;
          margin-left: 0.5rem !important;
        }

        @include tablette {
          margin: 0 !important;
          margin-top: 0.4rem !important;
        }

        .v-icon {
          margin-right: -0.5rem;
          @include tablette {
            font-size: 1.3rem;
          }
        }
      }

      .mt-7 {
        margin-right: 5rem !important;
        @include desktop {
          margin-right: 7rem !important;
        }

        @include medium {
          margin-right: 9rem !important;
        }

        @include phone {
        }

        @include tablette {
          margin-right: 0 !important;
          margin-top: 2.3rem !important;
          margin-left: 1rem !important;
        }

        .v-btn {
          @include tablette {
            font-size: 0.9rem;
          }
        }
      }
    }
  }
}
</style>