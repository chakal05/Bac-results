<template>
  <v-container>
    <div class="text-center">
      <h2 class="display-2 font-weight-thin mb-4">Manage profil</h2>
    </div>
    <v-row no-gutters justify="center">
      <v-col class="edit" cols="12" md="5">
        <v-card height="450">
          <v-toolbar>
            <v-toolbar-title>Edit profil</v-toolbar-title>
          </v-toolbar>
          <v-form>
            <v-row align="center" justify="center">
              <v-col cols="12" md="5">
                <v-text-field
                  prepend-icon="account_box"
                  color="teal darken-4"
                  v-model="name"
                  label="Name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                  color="teal darken-4"
                  v-model="telephone"
                  :rules="telephoneRules"
                  label="Telephone"
                  prepend-icon="phone"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  color="teal darken-4"
                  v-model="email"
                  :rules="nameRules"
                  label="Email"
                  prepend-icon="mail"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  color="teal darken-4"
                  v-model="adresse"
                  label="Adresse"
                  prepend-icon="place"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  color="teal darken-4"
                  v-model="city"
                  label="City"
                  prepend-icon="home"
                ></v-text-field>
              </v-col>
            </v-row>

            <div class="text-center">
              <p
                v-bind:style="{ color: 'green' }"
                v-if="successPr"
                color="teal darken-4"
              >
                {{ isSuccessPr }}
              </p>
              <p v-bind:style="{ color: 'red' }" v-if="errorPr">
                {{ isErrorPr }}
              </p>
            </div>

            <v-card-actions>
              <v-col align="center">
                <v-btn
                  @click="updateProfil"
                  color="teal darken-4"
                  class="white--text"
                  >Update profil</v-btn
                >
              </v-col>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>

      <v-col class="pass" cols="12" md="5">
        <v-card height="450">
          <v-toolbar color="teal darken-4">
            <v-spacer></v-spacer>
            <v-toolbar-title class="white--text">Edit password</v-toolbar-title>
          </v-toolbar>
          <v-row align="center" justify="center">
            <v-col cols="12" md="5">
              <v-text-field
                v-model="pass"
                color="teal darken-4"
                prepend-icon="lock"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                label="Current password"
                @click:append="showPass = !showPass"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="5">
              <v-text-field
                prepend-icon="lock"
                color="teal darken-4"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                v-model="newPass"
                label="New password"
                @click:append="showPass = !showPass"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="10">
              <v-text-field
                prepend-icon="lock"
                color="teal darken-4"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                v-model="confPass"
                label="Confirm new password"
                @click:append="showPass = !showPass"
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="text-center">
            <p
              v-bind:style="{ color: 'green' }"
              v-if="successPa"
              color="teal darken-4"
            >
              {{ isSuccessPa }}
            </p>
            <p v-bind:style="{ color: 'red' }" v-if="errorPa">
              {{ isErrorPa }}
            </p>
          </div>
          <v-card-actions>
            <v-col align="center">
              <v-btn
                @click="updatePass"
                color="teal darken-4"
                class="white--text"
                >Update password</v-btn
              >
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import axios from "axios";
export default {
  data: () => ({
    name: null,
    telephone: null,
    adresse: null,
    city: null,
    email: null,
    pass: null,
    newPass: null,
    confPass: null,
    telephoneRules: [],
    nameRules: [],
    isSuccessPr: null,
    isErrorPr: null,
    isSuccessPa: null,
    isErrorPa: null,
    successPa: false,
    errorPa: false,
    successPr: false,
    errorPr: false,
    showPass: false
  }),
  computed: {
    //
  },
  watch: {},
  created() {},
  methods: {
    async updateProfil() {
      if (
        this.name === null &&
        this.email === null &&
        this.telephone === null &&
        this.adresse === null &&
        this.city === null
      ) {
        this.errorPr = true;
        this.isErrorPr = "Nothing to update";
        setTimeout(() => {
          this.errorPr = false;
          this.isErrorPr = null;
        }, 3000);
      } else {
        await axios
          .put("/personel/:id", {
            id: localStorage.getItem("tokenUserId"),
            name: this.name,
            email: this.email,
            telephone: this.telephone,
            adresse: this.adresse,
            city: this.city,
            flag: "updateProfil"
          })
          .then(response => {
            if (response.status === 200) {
              this.successPr = true;
              this.isSuccessPr = response.data;
              setTimeout(() => {
                this.successPr = false;
                this.isSuccessPr = null;
                this.name = null;
                this.email = null;
                this.telephone = null;
                this.adresse = null;
                this.city = null;
              }, 3000);
            }
          })
          .catch(() => {
            this.errorPr = true;
            setTimeout(() => {
              this.isErrorPr = "There was a problem, please check later";
            }, 3000);
          });
      }
    },

    async updatePass() {
      if (this.pass && this.newPass && this.confPass) {
        if (this.newPass === this.confPass) {
          await axios
            .put("/personel/:id", {
              id: localStorage.getItem("tokenUserId"),
              pass: this.pass,
              newPass: this.newPass,
              confPass: this.confPass,
              flag: "updatePass"
            })
            .then(response => {
              if (response.status === 200) {
                this.successPa = true;
                this.isSuccessPa = response.data;
                setTimeout(() => {
                  this.successPa = false;
                  this.isSuccessPa = null;
                  this.pass = null;
                  this.newPass = null;
                  this.confPass = null;
                }, 3000);
              }
            })
            .catch(() => {
              this.errorPa = true;
              this.isErrorPa = "There was a problem. Please, try later";
              setTimeout(() => {
                this.error = false;
                this.isErrorPa = null;
              }, 3000);
            });
        } else {
          this.errorPa = true;
          this.isErrorPa = "The new password must be the same";
          setTimeout(() => {
            this.errorPa = false;
            this.isErrorPa = null;
          }, 3000);
        }
      } else {
        this.errorPa = true;
        this.isErrorPa = "All fields must be filled";
        setTimeout(() => {
          this.errorPa = false;
          this.isErrorPa = null;
        }, 3000);
      }
    },
    ...mapMutations(["setPersonelInfo"]),
    ...mapActions(["editPersonel"])
  }
};
</script>

<style lang="scss">
@mixin medium {
  @media (max-width: 960px) {
    @content;
  }
}
.container {
  .row {
    .edit {
      margin-right: 1rem;
      @include medium {
        margin-bottom: 2rem;
      }

      .v-card {
        @include medium {
          height: 570px !important;
        }
        .row {
          padding-top: 1.5rem;

          @include medium {
            padding-top: 1rem;
          }

          .col-12 {
            @include medium {
              max-width: 90%;
              padding: 0;
              margin: 0 auto;
            }
          }
        }

        .v-card__actions {
          @include medium {
            margin-top: 2rem;
          }
        }
      }
    }

    .pass {
      margin-right: 1rem;

      .v-card {
        @include medium {
          height: 450px !important;
        }
        .row {
          padding-top: 1.5rem;

          @include medium {
            padding: 1rem;
          }

          .col-12 {
            @include medium {
              padding: 0;
            }
          }
        }

        .v-card__actions {
          @include medium {
            margin-top: 1rem;
          }

          .col {
            .v-btn {
              margin: 0 auto;
              width: 175px;
            }
          }
        }
      }
    }
  }
}
</style>
