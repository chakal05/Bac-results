import axios from "axios";
const state = {
  personelId: null,
  personelName: null,
  departement: null,
  personelEmail: null,
  personelAdresse: null,
  personelCity: null,
  personelBirth: null,
  personelTelephone: null,
  personelPassword: null,
  personelList: [],
  profil: null,
  if_error: false,
  if_success: false
};

// Todo delete later when unnecessary

const getters = {
  success: state => state.if_success,
  error: state => state.if_error,
  getPersonelList: state => state.personelList
};
const mutations = {
  setPersonel: (state, personel) => (state.personelList = personel),

  setPersonelInfo: (
    state,
    { adresse, city, birth, name, departement, tel, pass, email, id, profil }
  ) => {
    state.personelAdresse = adresse;
    state.personelCity = city;
    state.personelBirth = birth;
    state.personelName = name;
    state.personelEmail = email;
    state.departement = departement;
    state.personelTelephone = tel;
    state.personelId = id;
    state.personelPassword = pass;
    state.profil = profil;
  }
};

const actions = {
  // retrieve doctors

  async loadPersonel({ commit }, profil) {
    await axios
      .get("/personel", {
        params: {
          profil: profil
        }
      })
      .then(response => {
        if (response.status === 200) {
          state.if_success = true;
          if (response.data) {
            commit("setPersonel", response.data);
          }
        }
      })
      .catch(() => {
        state.if_error = true;
      });
  },

  // Add new personel

  async addPersonel() {
    await axios
      .post("/personel", {
        name: state.personelName,
        departement: state.departement,
        telephone: state.personelTelephone,
        adresse: state.personelAdresse,
        city: state.personelCity,
        email: state.personelEmail,
        birthdate: state.personelBirth,
        password: state.personelPassword,
        profil: state.profil
      })
      .then(response => {
        if (response && response.status === 200) {
          state.if_success = true;
        }
      })
      .catch(() => {
        state.if_error = true;
      });
  },

  // Edit personel info

  async editPersonel() {
    await axios
      .put("/personel", {
        id: state.personelId || localStorage.getItem("tokenUserId"),
        name: state.personelName,
        departement: state.departement,
        telephone: state.personelTelephone,
        adresse: state.personelAdresse,
        city: state.personelCity,
        email: state.personelEmail,
        birthdate: state.personelBirth,
        password: state.personelPassword
      })
      .then(response => {
        if (response.status === 200) {
          state.if_success = true;
        }
      })
      .catch(() => {
        state.if_error = true;
      });
  },

  async deletePersonel() {
    await axios
      .delete("/personel", {
        data: { id: state.personelId }
      })
      .then(response => {
        if (response && response.status === 200) {
          state.if_success = true;
        }
      })
      .catch(() => {
        state.if_error = true;
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
