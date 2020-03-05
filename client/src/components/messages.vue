<template>
  <v-container>
    <div class="text-center">
      <h2 v-if="chat" class="display-2 font-weight-thin mb-4">Messages</h2>
    </div>
    <v-row no-gutters>
      <v-col
        v-if="sideBar"
        v-bind:class="{ show: chat }"
        class="column"
        cols="12"
        md="3"
      >
        <v-card height="700">
          <v-toolbar color="teal darken-4" dark>
            <v-toolbar-title>
              <v-btn @click="inbox" color="teal darken-4">Inbox</v-btn>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title class="newMessage">
              <v-btn @click="getContacts" color="teal darken-4">Contacts</v-btn>
            </v-toolbar-title>
          </v-toolbar>

        

          <v-list two-line v-if="!contact">
              <div v-if="noMess" class="noMess text-center">
            <h2 class="teal--text">You do not have new messages</h2>
          </div>
            <v-list-item-group v-if="!noMess" v-model="selected" active-class="teal--text">
              <template v-for="(item, index) in items">
                <v-list-item
                  :key="item._id"
                  v-bind:style="[
                    item.userToRead === 'no'
                      ? { fontWeight: 'bold', background: 'rgb(229, 227, 227)' }
                      : ''
                  ]"
                >
                  <v-list-item-content @click="messageDetails(item._id)">
                    <v-list-item-title
                      v-text="item.senderName"
                    ></v-list-item-title>
                    <br />
                    <v-list-item-subtitle
                      v-text="item.time"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider
                  v-if="index + 1 < items.length"
                  :key="index"
                ></v-divider>
              </template>
            </v-list-item-group>
          </v-list>

          <v-list v-if="contact">
            <v-list-item-group active-class="teal--text">
              <template v-for="(item, index) in personel">
                <v-list-item :key="item._id">
                  <template v-slot:default="{}">
                    <v-list-item-content @click="newMess(item._id)">
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-list-item>
                <v-divider :key="index"></v-divider>
              </template>
            </v-list-item-group>
          </v-list>

          <div class="text-center">
            <v-pagination
              v-model="page"
              :length="2"
              color="teal darken-4"
            ></v-pagination>
          </div>
        </v-card>
      </v-col>

      <v-col class="main">
        <v-card
          class="callToAction"
          v-if="!chat"
          align="center"
          justify="center"
          height="700"
        >
          <v-card-text class="display-2 font-weight-thin mb-4">
            <v-icon color="teal darken-4">mail</v-icon>
          </v-card-text>
        </v-card>
        <v-card v-if="chat" class="chat_box" height="700">
          <v-toolbar>
            <v-icon @click="goBack" class="goBack" color="black"
              >arrow_back</v-icon
            >
            <v-spacer></v-spacer>
            <v-toolbar-title>Message</v-toolbar-title>
          </v-toolbar>
          <v-list-item
            v-for="item in receivedMessages"
            :key="item._id"
            three-line
          >
            <v-list-item-content>
              <v-list-item-title class="title mb-1"
                >From: {{ item.senderName || "me" }}</v-list-item-title
              >
              <div class="subtitle-1 black--text">
                To: {{ item.name || "me" }}
              </div>
              <v-divider></v-divider>
              <v-list-item-subtitle class="my-12">
                {{ item.message }}
              </v-list-item-subtitle>
              <br />
              <v-list-item>
                <p class="subtitle-2 black--text">{{ item.time }}</p>
              </v-list-item>
            </v-list-item-content>
            <v-list-item-action v-if="del">
              <v-icon
                color="red darken-4"
                @click="deleteMess(item._id)"
                class="white--text"
                >delete</v-icon
              >
            </v-list-item-action>
          </v-list-item>

          <v-alert v-if="success" type="success"
            >Message {{ messageStatus }}.</v-alert
          >
          <div class="reponse">
            <v-textarea
              outlined
              v-model="message"
              class="mx-2"
              name="input-7-4"
              label="Enter your message"
              auto-grow
              color="teal darken-4"
              rows="2"
            ></v-textarea>

            <v-btn text @click="save" class="btnSend">
              <v-icon color="teal darken-4">send</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    sideBar: true,
    selected: [],
    personel: [],
    user_to: null,
    message: null,
    contact: false,
    chat: false,
    del: false,
    page: 1,
    receivedMessages: [],
    items: [],
    success: false,
    noMess: false,
    messageStatus: "sent"
  }),
  computed: {
    //
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.loadMessages();
  },
  methods: {
    // Get messages
    async loadMessages() {
      await axios
        .get("/messages", {
          params: {
            id: localStorage.getItem("tokenUserId"),
            data: "messages"
          }
        })
        .then(response => {
          if (response.data[0]) {
            this.items = response.data.reverse();
              this.noMess = false;
          } else {
            this.noMess = true;
          }
        })
        .catch(err => {
          throw err;
        });
    },

    inbox() {
      this.chat = false;
      this.contact = false;
      this.loadMessages();
    },

    async messageDetails(id) {
      await axios
        .get("/messages/:id", {
          params: {
            id: id
          }
        })
        .then(response => {
          this.receivedMessages = response.data;
          this.user_to = response.data[0].userFrom;
          this.chat = true;
          this.del = true;
          this.updtateMessage(id);
          this.loadMessages();
        })
        .catch();
    },

    async updtateMessage(id) {
      await axios
        .put("/messages/:id", {
          id: id
        })
        .catch(err => {
          console.log(err);
        });
    },

    async getContacts() {
      await axios
        .get("/personel", {
          params: {
            id: localStorage.getItem("tokenUserId"),
            data: "personel"
          }
        })
        .then(response => {
          this.chat = false;
          this.noMess = false;
          this.contact = true;
          this.receivedMessages = [];
          this.personel = response.data;
        })
        .catch(err => {
          throw err;
        });
    },

    async newMess(id) {
      await axios
        .get("/personel", {
          params: {
            id: id,
            data: "receiver"
          }
        })
        .then(response => {
          if (response.status === 200) {
            this.receivedMessages = response.data;
            this.user_to = response.data[0]._id;
            this.chat = true;
            this.del = false;
          }
        })
        .catch(err => {
          throw err;
        });
    },

    async deleteMess(id) {
      await axios
        .delete("/messages/", {
          data: { id: id }
        })
        .then(response => {
          if (response.status === 200) {
            this.success = true;
            this.messageStatus = "deleted";

            setTimeout(() => {
              this.success = false;
              this.chat = false;
              this.loadMessages();
            }, 3000);
          }
        })
        .catch(err => {
          throw err;
        });
    },

    async save() {
      // format the timestamp
      let date = new Date().toISOString().substring(0, 10);
      let h = new Date().getHours();
      let hour = h < 10 ? "0" + h : h;
      let m = new Date().getMinutes();
      let minute = m < 10 ? "0" + m : m;
      let timestamp = `${date} at ${hour}:${minute}`;

      await axios
        .post("/messages", {
          name: localStorage.getItem("tokenUserName"),
          to: this.user_to,
          from: localStorage.getItem("tokenUserId"),
          time: timestamp,
          message: this.message,
          user_to_read: "no"
        })
        .then(async response => {
          if (response.status === 200) {
            this.message = null;          
             this.success = true;
             setTimeout(() => {
               this.success = false;
               this.chat = false;
             }, 3000);
          }
        })
        .catch(err => {
          throw err;
        });
    },

    goBack() {
      this.chat = false;
      this.sideBar = true;
    }
  }
};
</script>

<style lang="scss">
@mixin desktop {
  @media (max-width: 960px) {
    @content;
  }
}
.container {
  .text-center {
    margin-bottom: 2rem;
  }
  .row {
    .show {
      @include desktop {
        display: none;
      }
    }
    .column {
      .v-card {
        color: rgba(0, 128, 0, 0.589);
        position: relative;
        .v-pagination {
          position: absolute;
          bottom: 0.5rem;
          left: -0.1rem;
        }

        .noMess {
          margin-top: 50%;

          h2 {
            font-size: 2rem;
          }
        }

        .newMessage {
          float: right;
        }
      }
    }
    .main {
      .callToAction {
        .v-card__text {
          position: absolute;
          top: 37%;

          .v-icon {
            font-size: 7rem;
          }
        }

        @include desktop {
          display: none;
        }
      }
      .chat_box {
        .v-toolbar {
          .goBack {
            font-size: 1.5rem;
            font-weight: bold;
            display: none;

            @include desktop {
              display: block;
            }
          }
        }
        .v-list-item {
          .v-list-item__content {
            .theme--light {
              p {
                margin-left: -1rem;
                margin-bottom: 5rem;
              }
            }
          }
          .v-list-item__action {
            position: absolute;
            top: 7rem;
            right: 5rem;
            .v-icon {
              font-size: 2rem;
            }
          }
        }

        .reponse {
          position: absolute;
          bottom: -2rem;
          left: -0.5rem;
          width: 100%;
          .mx-2 {
            width: 100%;
          }

          .btnSend {
            position: absolute;
            right: 1rem;
            bottom: 2.7rem;
          }
        }
      }
    }
  }
}
</style>
