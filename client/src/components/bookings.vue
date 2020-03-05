<template>
  <v-container>
    <div class="calendarView" v-if="showCalendar">
      <v-row align="center" justify="center">
        <v-col>
          <div class="text-center">
            <h1 class="display-2 font-weight-thin mb-4">Bookings</h1>
          </div>

          <v-date-picker
            color="teal darken-4"
            v-model="picker"
            full-width
            :landscape="$vuetify.breakpoint.smAndUp"
            class="mt-4"
          ></v-date-picker>
          <v-col class="text-center" cols="12">
            <v-btn color="teal darken-4" class="white--text mr-4" @click="load">SEARCH</v-btn>
          </v-col>
        </v-col>
      </v-row>
    </div>

    <div class="table" v-if="showTable">
      <div class="text-center titre">
        <h1 class="display-2 font-weight-thin mb-4">Consultations</h1>
      </div>

      <v-data-table
        :headers="headers"
        :items="getAppointments"
        :search="search"
        :sort-by="['rank']"
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
                <v-btn color="teal darken-4" dark class="mb-2" v-on="on" @click="editItem">Add new</v-btn>
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
                          v-model="editedItem.name"
                          label="Name"
                          color="teal darken-4"
                          :rules="nameRules"
                          prepend-icon="account_box"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          color="teal darken-4"
                          :items="genre"
                          v-model="editedItem.sexe"
                          label="Gender"
                          prepend-icon="fas fa-venus-mars"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.telephone"
                          :counter="8"
                          label="Telephone"
                          color="teal darken-4"
                          :rules="telephoneRules"
                          prepend-icon="phone"
                        ></v-text-field>
                      </v-col>
                      </v-row>
                      <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          :items="dispoHours"
                          v-model="editedItem.hour"
                          label="Time"
                          color="teal darken-4"
                          prepend-icon="fas fa-bell"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="picker" readonly label="Day" required></v-text-field>
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
                    <div class="flex-grow-1"></div>
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
        <template v-slot:no-data>
          <h2>0 appointment found</h2>
        </template>
      </v-data-table>
      <v-col class="text-center boutonBox" cols="12">
        <v-btn color="teal darken-4" class="white--text mr-4" @click="backToCalendar">Previous</v-btn>
      </v-col>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data: () => ({
    dialog: false,
    picker: new Date().toISOString().substr(0, 10),
    menu: false,
    showTable: false,
    showCalendar: true,
    error: null,
    success: null,
    search: "",
    zero: false,
    fifteen: 15,
    rank: null,
    indexToDel: null,
    genre: [`Man`, `Woman`],
    getAppointments: [],
    dispoHours: [],
    headers: [
      {
        text: "Name",
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: "Gender", value: "sexe" },
      { text: "Telephone", value: "telephone" },
      { text: "Time", value: "hour" },
      { text: "Doctor", value: "doctor" },
      { text: "Added by", value: "addedBy" },
      { text: "Actions", value: "action", sortable: false }
    ],
    nameRules: [
      v => !!v || "Le nom est requis",
      v => isNaN(v) || "Names should not contain numbers"
    ],
    telephoneRules: [
      v => !!v || "A phone number is required ",
      v => (v && v.length >= 8) || "Phone number should contain 8 numbers min",
      v => !isNaN(v) || "The phone number should only contain numeric values"
    ],
    editedIndex: -1,
    editedItem: {
      name: "",
      sexe: "",
      hour: "",
      telephone: "",
      doctor: "",
      addedBy: ""
    },
    defaultItem: {
      name: "",
      sexe: "",
      hour: "",
      telephone: "",
      doctor: "",
      addedBy: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New item" : "Edit item";
    },

    ...mapGetters({ theList: "getDoctorList" }),
    getDoctorList: {
      get() {
        return this.theList;
      },

      set(list) {
        return list;
      }
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.getAppointments.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.loadHours(this.picker);
      this.docList();
    },

    deleteItem(item) {
      const index = this.getAppointments.indexOf(item);
      this.indexToDel = this.getAppointments[index];

      confirm("Are you sure you want to delete this item?") &&
        this.getAppointments.splice(index, 1);
      this.SupprItem();
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
        this.changeItem();
      } else {
        this.add();
      }
    },

    load() {
      this.showCalendar = false;
      this.loadBookings(this.picker);
      this.showTable = true;
    },

    add() {
      if (
        this.editedItem.name &&
        this.editedItem.telephone &&
        this.editedItem.sexe &&
        this.editedItem.hour &&
        this.picker &&
        this.editedItem.doctor
      ) {
        if (
          new Date(this.picker).getDate() === new Date().getDate() ||
          new Date(this.picker).getTime() > new Date().getTime()
        ) {
          if (
            new Date(this.picker).getDay() === 5 ||
            new Date(this.picker).getDay() === 6
          ) {
            alert("Weekends reserved for emergency");
            this.close();
          } else if (this.editedItem.hour === "Fully booked") {
            alert(
              "We are fully booked for this day, please choose another day"
            );
          } else {
            this.register();
          }
        } else {
          alert("Choosen time is past");
          this.close();
        }
      } else {
        alert("All fields must be filled");
      }
    },

    // retrieve booked hours of the day

    async loadHours(day) {
      // Default hours

      const baseHours = [
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00"
      ];

      await axios
        .get("/reservations", {
          params: { date: [day, `hours`] }
        })
        .then(response => {
          if (response.data.length === 0) {
            // No reservations for that day, send default hours
            this.dispoHours = baseHours;
          } else {
            // if there are reservations for that day, display available hours
            let displayHours = baseHours
              .filter(x => !response.data.includes(x))
              .concat(response.data.filter(x => !baseHours.includes(x)));
            if (!displayHours[0]) {
              //if fully booked
              this.dispoHours.push("Fully booked");
            } else {
              this.dispoHours = displayHours;
            }
          }
        })
        .catch(eroor => {
          this.error = eroor;
        });
    },

    // Add an appointment to dB

    async register() {
      if (this.editedItem.hour) {
        this.setRank(this.editItem.hour);
      }

      await axios
        .post("/reservations", {
          name: this.editedItem.name,
          telephone: this.editedItem.telephone,
          sexe: this.editedItem.sexe,
          date: this.picker,
          time: this.editedItem.hour,
          doctor: this.editedItem.doctor,
          rank: this.rank,
          addedBy: localStorage.getItem("tokenUserName")
        })
        .then(response => {
          if (response && response.status === 200) {
            this.success = "New appointment saved";

            setTimeout(() => {
              this.success = null;
              this.loadBookings(this.picker);
              this.close();
            }, 3000);
          }
        })
        .catch(() => {
          this.error = "There was an error";
        });
    },

    // Edit appointment

    async changeItem() {
      if (this.editedItem.hour) {
        this.setRank(this.editedItem.hour);
      }

      await axios
        .put("/reservations", {
          id: this.editedItem._id,
          name: this.editedItem.name,
          telephone: this.editedItem.telephone,
          sexe: this.editedItem.sexe,
          date: this.picker,
          time: this.editedItem.hour,
          doctor: this.editedItem.doctor,
          rank: this.rank,
          addedBy: localStorage.getItem("tokenUserName")
        })
        .then(response => {
          if (response && response.status === 200) {
            Object.assign(this.editedItem);
            this.success = "An item was edited";
            setTimeout(() => {
              this.loadBookings(this.picker);
              this.success = null;
              this.close();
            }, 3000);
          }
        })
        .catch(() => {
          this.error = "There was an error with the editing of the item";
        });
    },

    // Delete an appointment from dB

    async SupprItem() {
      axios
        .delete("/reservations", {
          data: { id: this.indexToDel._id }
        })
        .catch(() => {
          this.error = "Item could not been deleted";
        });
    },

    // Retrieve bookings

    async loadBookings(picker) {
      await axios
        .get("/reservations", {
          params: { date: picker }
        })
        .then(response => {
          this.getAppointments = response.data;
        })
        .catch(eror => {
          this.error = eror;
        });
    },

    setRank() {
      // Display appointments in ascending order

      const baseHours = [
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00"
      ];

      this.rank = baseHours.indexOf(this.editedItem.hour);
    },
    backToCalendar() {
      this.showCalendar = true;
      this.showTable = false;
    },
    ...mapActions(["docList"]),
    ...mapMutations(["difference"])
  }
};
</script>
<style lang="scss" scoped>
.container {
  .calendarView {
    .text-center {
      margin-bottom: 2rem;

      .v-btn {
        margin-top: 1rem;
      }
    }
    .row {
      width: 70%;
      margin: auto;
      margin-bottom: 3rem;

      @media screen and (max-width: 960px) {
        width: 100%;
      }
    }
  }

  .table {
    .v-data-table {
      margin-bottom: 1rem;
    }
  }

  .formulaire {
    max-width: 90%;
    margin: auto;
    background-color: #ffffff;

    .v-btn {
      margin: 1rem;
    }
  }
  .notFound {
    .v-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
  }
}
</style>
