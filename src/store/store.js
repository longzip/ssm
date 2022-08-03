import Vue from "vue";
import { firebaseAuth, firebaseDb } from "boot/firebase";
import {} from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "firebase/auth";

let messagesRef;

const state = {
  userDetails: {},
  users: {},
  messages: {}
};
const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload;
  },
  addUser(state, payload) {
    Vue.set(state.users, payload.userId, payload.userDetails);
  },
  updateUser(state, payload) {
    Object.assign(state.users[payload.userId], payload.userDetails);
  },
  addMessage(state, payload) {
    Vue.set(state.messages, payload.messageId, payload.messageDetails);
  },
  clearMessages(state) {
    state.messages = {};
  }
};
const actions = {
  // eslint-disable-next-line no-empty-pattern
  registerUser({}, payload) {
    firebaseAuth
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        console.log(response);
        let userId = firebaseAuth.currentUser.uid;
        firebaseDb.ref("users/" + userId).set({
          name: payload.name,
          email: payload.email,
          online: true
        });
      })
      .catch(error => {
        console.log(error.message);
      });
  },
  // eslint-disable-next-line no-empty-pattern
  loginUser({}, { email, password }) {
    signInWithEmailAndPassword(firebaseAuth, email, password);
  },
  logoutUser() {
    const auth = getAuth();
    signOut(auth);
  },
  handleAuthStateChanged({ commit }) {
    console.log("sjdfkjdskfjkd");
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (user) {
        // User is logged in.
        const userId = auth.currentUser.uid;

        const db = getDatabase();
        onValue(ref(db, "/users/" + userId), snapshot => {
          if (snapshot.exists()) {
            let userDetails = snapshot.val();
            // commit("setUserDetails", {
            //   name: userDetails.name,
            //   email: userDetails.email,
            //   smsText: userDetails.smsText,
            //   maXa: userDetails.maXa,
            //   userId: userId
            // });
            commit("setUserDetails", { ...userDetails, userId });
          }
        });
        // dispatch("firebaseUpdateUser", {
        //   userId: userId,
        //   updates: {
        //     online: true
        //   }
        // });
        // dispatch("firebaseGetUsers");
        const query = Object.assign({}, this.$router.query);
        this.$router.push("/", query);
      } else {
        // User is logged out.
        // dispatch("firebaseUpdateUser", {
        //   userId: state.userDetails.userId,
        //   updates: {
        //     online: false
        //   }
        // });
        commit("setUserDetails", {});
        this.$router.replace("/auth");
      }
    });
  },

  // eslint-disable-next-line no-empty-pattern
  firebaseUpdateUser({}, { userId, updates }) {
    if (userId) {
      const db = getDatabase();
      set(ref(db, "users/" + userId), updates);
    }
  },
  firebaseGetUsers({ commit }) {
    firebaseDb.ref("users").on("child_added", snapshot => {
      let userDetails = snapshot.val();
      let userId = snapshot.key;
      commit("addUser", {
        userId,
        userDetails
      });
    });
    firebaseDb.ref("users").on("child_changed", snapshot => {
      let userDetails = snapshot.val();
      let userId = snapshot.key;
      commit("updateUser", {
        userId,
        userDetails
      });
    });
  },
  firebaseGetMessages({ commit, state }, otherUserId) {
    let userId = state.userDetails.userId;
    messagesRef = firebaseDb.ref("chats/" + userId + "/" + otherUserId);
    messagesRef.on("child_added", snapshot => {
      let messageDetails = snapshot.val();
      let messageId = snapshot.key;
      commit("addMessage", {
        messageId,
        messageDetails
      });
    });
  },
  firebaseStopGettingMessages({ commit }) {
    if (messagesRef) {
      messagesRef.off("child_added");
      commit("clearMessages");
    }
  },
  // eslint-disable-next-line no-empty-pattern
  firebaseSendMessage({}, payload) {
    firebaseDb
      .ref("chats/" + state.userDetails.userId + "/" + payload.otherUserId)
      .push(payload.message);

    payload.message.from = "them";
    firebaseDb
      .ref("chats/" + payload.otherUserId + "/" + state.userDetails.userId)
      .push(payload.message);
  }
};
const getters = {
  users: state => {
    let usersFiltered = {};
    Object.keys(state.users).forEach(key => {
      if (key !== state.userDetails.userId) {
        usersFiltered[key] = state.users[key];
      }
    });
    return usersFiltered;
  },

  findUser: state => userId => state.users[userId]
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
