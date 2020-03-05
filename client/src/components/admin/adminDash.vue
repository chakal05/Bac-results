<template>
  <v-item-group>
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active}">
            <router-link to="/admin/adminDoc">
              <v-card
                :color="active ? 'grey lighten-2' : ''"
                class="d-flex align-center"
                height="200"
              >
                <v-scroll-y-transition>
                  <v-card-text class="display-3 flex-grow-1 text-center">
                    <v-icon>fas fa-user-md</v-icon>
                    <h3 class="display-2 font-weight-thin">Doctors</h3>
                  </v-card-text>
                </v-scroll-y-transition>
              </v-card>
            </router-link>
          </v-item>
        </v-col>

        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active }">
            <router-link to="/admin/bookings">
              <v-card
                :color="active ? 'grey darken-4' : ''"
                class="d-flex align-center"
                height="200"
              >
                <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                  <v-icon>fas fa-calendar-alt</v-icon>
                  <h3 class="display-2 font-weight-thin">Bookings </h3>
                </v-card-text>
              </v-card>
            </router-link>
          </v-item>
        </v-col>

        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active }">
            <router-link to="/admin/patientList">
              <v-card
                :color="active ? 'grey darken-4' : ''"
                class="d-flex align-center"
                height="200"
              >
                <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                  <v-icon>fas fa-user</v-icon>
                  <h3 class="display-2 font-weight-thin">Patients</h3>
                </v-card-text>
                <div>
                  <div v-if="active" class="display-3 text-center white--text">coming soon</div>
                </div>
              </v-card>
            </router-link>
          </v-item>
        </v-col>

        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active }">
            <router-link to="/admin/adminNurse">
              <v-card
                :color="active ? 'grey darken-4' : ''"
                class="d-flex align-center"
                height="200"
              >
                <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                  <v-icon>fas fa-plus-square</v-icon>
                  <h3 class="display-2 font-weight-thin">Nurses</h3>
                </v-card-text>
              </v-card>
            </router-link>
          </v-item>
        </v-col>

        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active }">
            <router-link to="/admin/rapport">
              <v-card
                :color="active ? 'grey darken-4' : ''"
                class="d-flex align-center white--text"
                height="200"
              >
                <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                  <v-icon>fas fa-book</v-icon>
                  <h3 class="display-2 font-weight-thin">Rapports</h3>
                </v-card-text>
              </v-card>
            </router-link>
          </v-item>
        </v-col>
        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active}">
            <router-link to="/admin/bedAllotment">
              <v-card
                :color="active ? 'grey darken-4' : ''"
                class="d-flex align-center"
                height="200"
              >
                <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                  <v-icon>fas fa-bed</v-icon>
                  <h3 class="display-2 font-weight-thin">Beds</h3>
                </v-card-text>
              </v-card>
            </router-link>
          </v-item>
        </v-col>

        <v-col cols="12" md="3">
          <v-item>
            <router-link to="/admin/profil">
              <v-card class="d-flex align-center white--text" height="200">
                <v-card-text class="display-3 flex-grow-1 text-center">
                  <v-icon>account_box</v-icon>
                  <h3 class="display-2 font-weight-thin">Profil</h3>
                </v-card-text>
              </v-card>
            </router-link>
          </v-item>
        </v-col>

        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active, toggle }">
            <v-card
              :color="active ? 'grey darken-4' : ''"
              class="d-flex align-center"
              height="200"
              @click="toggle"
            >
              <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                <v-icon>fas fa-flask</v-icon>
                <h3 class="display-2 font-weight-thin">Laboratory</h3>
              </v-card-text>
              <div v-if="active" class="display-3 flex-grow-1 white--text text-center">Coming soon</div>
            </v-card>
          </v-item>
        </v-col>

        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active, toggle }">
            <v-card
              :color="active ? 'grey darken-4' : ''"
              class="d-flex align-center"
              height="200"
              @click="toggle"
            >
              <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                <v-icon>fas fa-coins</v-icon>
                <h3 class="display-2 font-weight-thin">Finances</h3>
              </v-card-text>
              <div v-if="active" class="display-3 flex-grow-1 white--text text-center">Coming soon</div>
            </v-card>
          </v-item>
        </v-col>

        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active, toggle }">
            <v-card
              :color="active ? 'grey darken-4' : ''"
              class="d-flex align-center"
              height="200"
              @click="toggle"
            >
              <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                <v-icon>fas fa-baby</v-icon>
                <h3 class="display-2 font-weight-thin">Birth</h3>
              </v-card-text>
              <div v-if="active" class="display-3 flex-grow-1 white--text text-center">Coming soon</div>
            </v-card>
          </v-item>
        </v-col>

        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active, toggle }">
            <v-card
              :color="active ? 'grey darken-4' : ''"
              class="d-flex align-center"
              height="200"
              @click="toggle"
            >
              <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                <v-icon>fas fa-credit-card</v-icon>
                <h3 class="display-2 font-weight-thin">Payments</h3>
              </v-card-text>
              <div v-if="active" class="display-3 flex-grow-1 white--text text-center">Coming soon</div>
            </v-card>
          </v-item>
        </v-col>

        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active, toggle }">
            <v-card
              :color="active ? 'grey darken-4' : ''"
              class="d-flex align-center"
              height="200"
              @click="toggle"
            >
              <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                <v-icon>fas fa-tint</v-icon>
                <h3 class="display-2 font-weight-thin">Blood bank</h3>
              </v-card-text>
              <div v-if="active" class="display-3 flex-grow-1 white--text text-center">Coming soon</div>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>

<script>
export default {
  name: "adminDash",
  methods: {}
};
</script>

<style lang='scss' scoped>
@mixin bigScreen {
  @media all and (max-width: 1903px) and (min-width: 960px) {
    @content;
  }
}
.container {
  *a {
    text-decoration: none;
  }
  .row {
    .v-card {
      .v-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      .display-2 {
        @include bigScreen{
          font-size: 2rem !important;
        }
      }
    }
  }
}
</style> 
