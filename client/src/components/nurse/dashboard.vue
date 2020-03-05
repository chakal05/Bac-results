<template>
  <v-item-group>
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active, toggle }">
            <router-link to="/nurse/patientList">
              <v-card
                :color="active ? 'grey darken-4' : ''"
                class="d-flex align-center"
                height="200"
                @click="toggle"
              >
                <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                  <v-icon>fas fa-user</v-icon>
                  <h3 class="display-2 font-weight-thin">Patients</h3>
                </v-card-text>
              </v-card>
            </router-link>
          </v-item>
        </v-col>

        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active }">
            <router-link to="/nurse/bookings">
              <v-card
                :color="active ? 'grey darken-4' : ''"
                class="d-flex align-center"
                height="200"
              >
                <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                  <v-icon>fas fa-calendar-alt</v-icon>
                  <h3 class="display-2 font-weight-thin">Bookings</h3>
                </v-card-text>
              </v-card>
            </router-link>
          </v-item>
        </v-col>

        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active }">
            <router-link to="/nurse/bedAllotment">
              <v-card
                :color="active ? 'grey darken-4' : ''"
                class="d-flex align-center"
                height="200"
              >
                <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                  <v-icon>fas fa-bed</v-icon>
                  <h3 class="display-2 font-weight-thin">Bed allotment</h3>
                </v-card-text>
              </v-card>
            </router-link>
          </v-item>
        </v-col>
        <v-col cols="12" md="3">
          <v-item v-slot:default="{ active }">
            <router-link to="/nurse/rapport">
              <v-card class="d-flex align-center white--text" height="200">
                <v-card-text class="display-3 flex-grow-1 text-center" v-if="!active">
                  <v-icon>fas fa-book</v-icon>
                  <h3 class="display-2 font-weight-thin">Rapports</h3>
                </v-card-text>
              </v-card>
            </router-link>
          </v-item>
        </v-col>

        <v-col cols="12" md="3">
          <v-item>
            <router-link to="/nurse/profil">
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
  //
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