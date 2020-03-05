<template>
  <v-container>
    <div class="text-center">
      <h2 class="display-2 font-weight-thin mb-4">Bed allotment</h2>
    </div>
    <br />
    <v-data-table
      :headers="headers"
      :items="getBookedBeds"
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
              <v-btn
                @click="editItem"
                color="teal darken-4"
                dark
                class="mb-2"
                v-on="on"
              >Add bed allotment</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form>
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="editedItem.bedNumber"
                          :items="bedsList"
                          label="Bed number"
                          color="teal darken-4"
                          prepend-icon="hotel"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-select
                          v-model="editedItem.patient"
                          :items="getPatientsList"
                          label="Patients"
                          color="teal darken-4"
                          prepend-icon="fa fa-user-injured"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        :return-value.sync="date"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="editedItem.dateIn"
                            label="Allotment date"
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
                          @change="dayIn"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-menu
                        ref="menu2"
                        v-model="menu2"
                        :close-on-content-click="false"
                        :return-value.sync="datum"
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="editedItem.dateOut"
                            label="Discharge date"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                            color="teal darken-4"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          ref="picker2"
                          v-model="datum"
                          color="teal darken-4"
                          @change="dayOut"
                          max="2026-01-01"
                          :min="new Date().toISOString().substr(0, 10)"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    </v-row>
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
import { mapGetters, mapActions } from "vuex";
export default {
  data: () => ({
    dialog: false,
    fifteen: 15,
    success: null,
    error: null,
    search: "",
    indexToDel: null,
    date: new Date().toISOString().substr(0, 10),
    datum: new Date().toISOString().substr(0, 10),
    menu: false,
    menu2: false,
    bedsList: [],
    headers: [
      {
        text: "Bed number",
        align: "left",
        sortable: false,
        value: "bedNumber"
      },
      { text: "Patient", value: "patient" },
      { text: "Allotment Date ", value: "dateIn" },
      { text: "Discharge Date", value: "dateOut" },
      { text: "Added by", value: "addedBy" },
      { text: "Actions", value: "action", sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      number: "",
      patient: "",
      dateIn: "",
      dateOut: "",
      addedBy: ""
    },
    defaultItem: {
      number: "",
      patient: "",
      dateIn: "",
      dateOut: "",
      addedBy: ""
    },
    show1: false,
    getBookedBeds: []
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },

    ...mapGetters({ patients: "getPatientsList" }),
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
    },

    menu2(val) {
      val && setTimeout(() => (this.$refs.picker2.activePicker = "YEAR"));
    }
  },

  created() {
    this.loadBedAllotment();
    this.initialize();
  },

  methods: {
    initialize() {
      this.getBookedBeds = [];
    },

    editItem(item) {
      this.loadPatients("names");
      this.availableBeds();
      this.editedIndex = this.getBookedBeds.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.getBookedBeds.indexOf(item);
      this.indexToDel = this.getBookedBeds[index];
      confirm("Are you sure you want to delete this item?") && this.suppr();
    },

    dayIn(date) {
      this.$refs.menu.save(date);
      if (date) this.editedItem.dateIn = date;
    },

    dayOut(datum) {
      this.$refs.menu2.save(datum);
      if (datum) this.editedItem.dateOut = datum;
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

    // retrieve bed allotments

    async loadBedAllotment() {
      await axios.get("/bedAll").then(response => {
        if (response && response.status === 200) {
          this.getBookedBeds = response.data;
        }
      });
    },

    //add bedAllotment

    async add() {
      if (
        this.editedItem.bedNumber &&
        this.editedItem.patient &&
        this.editedItem.dateIn &&
        this.editedItem.dateOut
      ) {
        await axios
          .post("/bedAll", {
            bedNumber: this.editedItem.bedNumber,
            patient: this.editedItem.patient,
            dateIn: this.editedItem.dateIn,
            dateOut: this.editedItem.dateOut,
            addedBy: localStorage.getItem("tokenUserName")
          })
          .then(response => {
            if (response && response.status === 200) {
              this.error = null;
              this.success = "Added a new bedAllotment";
              setTimeout(() => {
                this.loadBedAllotment();

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
        .put("/bedAll", {
          id: this.editedItem._id,
          bedNumber: this.editedItem.bedNumber,
          patient: this.editedItem.patient,
          dateIn: this.editedItem.dateIn,
          dateOut: this.editedItem.dateOut,
          addedBy: localStorage.getItem("tokenUserName")
        })
        .then(response => {
          if (response && response.status === 200) {
            this.error = null;
            this.success = "Edited one item";
            setTimeout(() => {
              this.loadBedAllotment();
              this.success = null;
              this.close();
            }, 3000);
          }
        })
        .catch(() => {
          this.error = "There was a problem";
        });
    },

    async suppr() {
      await axios
        .delete("/bedAll", {
          data: this.indexToDel
        })
        .then(response => {
          if (response && response.status === 200) {
            this.loadBedAllotment();
          }
        })
        .catch(() => {
          this.error = true;
        });
    },

    async availableBeds() {
      let allBeds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

      await axios
        .get("/bedAll", {
          params: {
            data: "beds"
          }
        })
        .then(response => {
          if (response.data.length === 0) {
            this.bedsList = allBeds;
          } else {
            let avaiBeds = allBeds
              .filter(x => !response.data.includes(x))
              .concat(response.data.filter(x => !allBeds.includes(x)));

            if (!avaiBeds[0]) {
              this.bedsList.push("No available beds");
            } else {
              this.bedsList = avaiBeds;
            }
          }
        });
    },

    ...mapActions(["loadPatients"])
  }
};
</script>