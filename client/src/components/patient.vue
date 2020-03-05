<template>
  <v-container>
    <div class="text-center">
      <h2 class="display-2 font-weight-thin mb-4">Patients list</h2>
    </div>
    <br />
    <v-data-table
      :headers="headers"
      :items="getPatientsList"
      :search="search"
      sort-by="name"
      class="elevation-1"
      :items-per-page="fifteen"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog persistent v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn @click="editItem" color="teal darken-4" dark class="mb-2" v-on="on">Add patient</v-btn>
            </template>
            <v-card>
              <v-form>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        color="teal darken-4"
                        :rules="nameRules"
                        v-model="editedItem.name"
                        label="Name"
                        prepend-icon="account_box"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        :rules="telephoneRules"
                        v-model="editedItem.telephone"
                        label="Telephone"
                        color="teal darken-4"
                        prepend-icon="phone"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        color="teal darken-4"
                        v-model="editedItem.adresse"
                        label="Adresse"
                        prepend-icon="place"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        prepend-icon="home"
                        color="teal darken-4"
                        v-model="editedItem.city "
                        label="City"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        color="teal darken-4"
                        v-model="editedItem.email"
                        :rules="emailRules"
                        label="Email"
                        prepend-icon="mail"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="editedItem.birthdate"
                            label="Birthday date"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                            color="teal darken-4"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          ref="picker"
                          v-model="date"
                          color="teal darken-4"
                          :max="new Date().toISOString().substr(0, 10)"
                          min="1950-01-01"
                          @change="birth"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.doctor"
                        :items="getDoctorList"
                        label="Doctor"
                        color="teal darken-4"
                        prepend-icon="fa fa-user-md"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <div class="text-center">
                <p v-bind:style="{ color: 'green' }">{{ success }}</p>
                <p v-bind:style="{ color: 'red' }">{{ error }}</p>
              </div>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="teal darken-4" text @click="close">Cancel</v-btn>
                <v-btn color="teal darken-4" text @click="save">Save</v-btn>
              </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
        <v-icon small @click="deleteItem(item)">delete</v-icon>
      </template>
      <template v-slot:no-data></template>
    </v-data-table>
  </v-container>
</template>


<script>
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    dialog: false,
    fifteen: 15,
    success: null,
    error: null,
    search: "",
    indexToDel: null,
    date: null,
    menu: false,
    headers: [
      {
        text: "Name",
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: "Telephone", value: "telephone" },
      { text: "Email", value: "email" },
      { text: "Adresse", value: "adresse" },
      { text: "City", value: "city" },
      { text: "Birthdate", value: "birthdate" },
      { text: "Doctor", value: "doctor" },
      { text: "added by", value: "addedBy" },
      { text: "Actions", value: "action", sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      name: "",
      departement: "",
      telephone: "",
      adresse: "",
      city: "",
      email: "",
      birthdate: "",
      doctor: ""
    },
    defaultItem: {
      name: "",
      departement: "",
      telephone: "",
      adresse: "",
      city: "",
      email: "",
      birthdate: "",
      doctor: ""
    },
    show1: false,
    rules: {
      required: value => !!value || "Required.",
      min: v => v.length >= 3 || "Min 3 characters",
      emailMatch: () => "The email and password you entered don't match"
    },
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ],
    nameRules: [
      v => !!v || "Le nom est requis",
      v => isNaN(v) || "Names should not contain numbers"
    ],
    telephoneRules: [
      v => !!v || "A phone number is required ",
      v => (v && v.length <= 8) || "Phone number should contain 8 numbers max",
      v => !isNaN(v) || "The phone number should only contain numeric values"
    ]
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    ...mapGetters({ theList: "getDoctorList", patients: "getPatientsList" }),
    getDoctorList: {
      get() {
        return this.theList;
      },

      set(list) {
        return list;
      }
    },

    getPatientsList: {
      get() {
        return this.patients;
      },
      set(list) {
        return list;
      }
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },

  created() {
    this.initialize();
    this.loadPatients();
  },

  methods: {
    initialize() {
      this.getPatientsList = [];
    },

    editItem(item) {
      this.docList();
      this.editedIndex = this.getPatientsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.getPatientsList.indexOf(item);
      this.indexToDel = this.getPatientsList[index];
      confirm("Are you sure you want to delete this item?") &&
        this.supprPatient();
    },

    birth(date) {
      this.$refs.menu.save(date);
      if (date) this.editedItem.birthdate = date;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        this.edit();
      } else {
        this.add();
      }
    },

    // retrieve patients

    //add patients

    async add() {
      if (
        this.editedItem.name &&
        this.editedItem.telephone &&
        this.editedItem.adresse &&
        this.editedItem.city &&
        this.editedItem.birthdate &&
        this.editedItem.email
      ) {
        await axios
          .post("/patient", {
            name: this.editedItem.name,
            telephone: this.editedItem.telephone,
            email: this.editedItem.email,
            adresse: this.editedItem.adresse,
            city: this.editedItem.city,
            birthdate: this.editedItem.birthdate,
            doctor: this.editedItem.doctor,
            profil: "patient",
            addedBy: localStorage.getItem("tokenUserName")
          })
          .then(response => {
            if (response && response.status === 200) {
              this.error = null;
              this.success = "Added a new patient";
              setTimeout(() => {
                this.loadPatients();

                this.success = null;
                this.close();
              }, 3000);
            } else {
              this.error = `All fields must be filled`;
              this.dialog = true;
            }
          })
          .catch(() => {
            this.error = "There was a problem";
          });
      }
    },
    async edit() {
      await axios
        .put("/patient", {
          id: this.editedItem._id,
          name: this.editedItem.name,
          telephone: this.editedItem.telephone,
          email: this.editedItem.email,
          adresse: this.editedItem.adresse,
          city: this.editedItem.city,
          birthdate: this.editedItem.birthdate,
          doctor: this.editedItem.doctor,
          profil: "patient",
          addedBy: localStorage.getItem("tokenUserName")
        })
        .then(response => {
          if (response && response.status === 200) {
            this.error = null;
            this.success = "Edited one item";
            setTimeout(() => {
              this.loadPatients();
              this.success = null;
              this.close();
            }, 3000);
          }
        })
        .catch(() => {
          this.error = "There was a problem";
        });
    },

    async supprPatient() {
      await axios
        .delete("/patient", {
          data: this.indexToDel
        })
        .then(response => {
          if (response && response.status === 200) {
            this.loadPatients();
          }
        })
        .catch(() => {
          this.error = true;
        });
    },
    ...mapActions(["docList", "loadPatients"])
  }
};
</script>