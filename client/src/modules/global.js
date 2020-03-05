import axios from "axios";
import router from "../Router/index";
const state = {
  unreadMessages: null,
  doctorList: [],
  patientsList: [],
  timer: null,
  newMessages: null
};

const getters = {
  getDoctorList: state => state.doctorList,
  getPatientsList: state => state.patientsList,
  newMess: state => state.newMessages
};
const mutations = {
  logOut() {
    localStorage.clear();
    axios.defaults.headers.common["authorization"] = null;
    router.replace("/");
  },

  setDoctorList: (state, list) => (state.doctorList = list),
  setPatientsList: (state, list) => (state.patientsList = list),
  setUnreadMessages: (state, unread) => (state.newMessages = unread),
  stopTimer: (state) => (clearInterval(state.timer))
};
const actions = {
  async docList({ commit }) {
    await axios
      .get("/personel", {
        params: {
          profil: "doctor",
          data: "doctorList"
        }
      })
      .then(response => {
        if (response.status === 200) {
          commit("setDoctorList", response.data);
        }
      })
      .catch(err => {
        throw err;
      });
  },

  getUnread({ commit }) {
    state.timer = setInterval(async () => {
      await axios
        .get("/messages", {
          params: {
            id: localStorage.getItem("tokenUserId"),
            data: "unread"
          }
        })
        .then(response => {
          commit("setUnreadMessages", response.data);
        })
        .catch(err => {
          throw err;
        });
    }, 3000);
  },

  async notifyMessages({commit}) {
    await axios
      .get("/messages", {
        params: {
          id: localStorage.getItem("tokenUserId"),
          data: "unread"
        }
      })
      .then(response => {
        commit("setUnreadMessages", response.data);
      })
      .catch(err => {
        throw err;
      });
  },

  async loadPatients({ commit }, names) {
    await axios
      .get("/patient", {
        params: {
          data: names
        }
      })
      .then(response => {
        if (response.status === 200) {
          commit("setPatientsList", response.data);
        }
      })
      .catch(err => {
        throw err;
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
