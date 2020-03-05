<template>
  <v-container>
    <div class="text-center">
      <h2 class="display-2 font-weight-thin mb-4">Rapport</h2>
    </div>
    <br />
    <v-data-table
      :headers="headers"
      :items="getRapports"
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
              <v-btn @click="editItem" color="teal darken-4" dark class="mb-2" v-on="on">Add rapport</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form>
                    <v-col cols="12" sm="6" md="12">
                      <v-text-field
                        color="teal darken-4"
                        v-model="editedItem.description"
                        label="Description"
                        prepend-icon="description"
                      ></v-text-field>
                    </v-col>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
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
                              v-model="editedItem.day"
                              label="Date"
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
                            @change="birth"
                            :max="new Date().toISOString().substr(0, 10)"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="editedItem.patient"
                          :items="getPatientsList"
                          label="Patient"
                          color="teal darken-4"
                          prepend-icon="fa fa-user-injured"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-col cols="12" sm="6" md="12">
                      <v-select
                        v-model="editedItem.doctor"
                        :items="getDoctorList"
                        label="Doctor"
                        color="teal darken-4"
                        prepend-icon="fa fa-user-md"
                      ></v-select>
                    </v-col>
                  </v-form>
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
        text: "Description",
        align: "left",
        sortable: false,
        value: "description"
      },
      { text: "Patient", value: "patient" },
      { text: "Doctor", value: "doctor" },
      { text: "Date", value: "day" },
      { text: "Added by", value: "addedBy" },
      { text: "Actions", value: "action", sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      description: "",
      patient: "",
      doctor: "",
      day: "",
      addedBy: ""
    },
    defaultItem: {
      description: "",
      patient: "",
      doctor: "",
      day: "",
      addedBy: ""
    },
    show1: false,
    getRapports: []
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
    this.loadRapports();
  },

  methods: {
    initialize() {
      this.getRapports = [];
    },

    editItem(item) {
      this.docList();
      this.loadPatients("names");
      this.editedIndex = this.getRapports.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.getRapports.indexOf(item);
      this.indexToDel = this.getRapports[index];
      confirm("Are you sure you want to delete this item?") &&
        this.supprRapport();
    },

    birth(date) {
      this.$refs.menu.save(date);
      if (date) this.editedItem.day = date;
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

    // retrieve rapports

    async loadRapports() {
      await axios
        .get("/rapport")
        .then(response => {
          if (response && response.status === 200) {
            this.getRapports = response.data;
          }
        })
        .catch();
    },

    //add patients

    async add() {
      if (
        this.editedItem.description &&
        this.editedItem.patient &&
        this.editedItem.doctor &&
        this.editedItem.day
      ) {
        await axios
          .post("/rapport", {
            description: this.editedItem.description,
            patient: this.editedItem.patient,
            doctor: this.editedItem.doctor,
            day: this.editedItem.day,
            addedBy: localStorage.getItem("tokenUserName")
          })
          .then(response => {
            if (response && response.status === 200) {
              this.error = null;
              this.success = "Added a new rapport";
              setTimeout(() => {
                this.loadRapports();

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
        .put("/rapport", {
          id: this.editedItem._id,
          description: this.editedItem.description,
          patient: this.editedItem.patient,
          doctor: this.editedItem.doctor,
          day: this.editedItem.day,
          addedBy: localStorage.getItem("tokenUserName")
        })
        .then(response => {
          if (response && response.status === 200) {
            this.error = null;
            this.success = "Edited one item";
            setTimeout(() => {
              this.loadRapports();
              this.success = null;
              this.close();
            }, 3000);
          }
        })
        .catch(() => {
          this.error = "There was a problem";
        });
    },

    async supprRapport() {
      await axios
        .delete("/rapport", {
          data: this.indexToDel
        })
        .then(response => {
          if (response && response.status === 200) {
            this.loadRapports();
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