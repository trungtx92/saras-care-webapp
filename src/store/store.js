import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        reportByExistingUser: false,
        openPopupModal: false,
        authyId:0
      },
      mutations: {
        setReportByExistingUser(state) {
          state.reportByExistingUser = true;
        },
        setOpenPopupModal(state) {
          state.openPopupModal = true;
        },
        setAuthyId(state,id) {
          state.authyId = id
        }
      },
      getters: {
        getReportByExistingUser: state => { 
         return state.reportByExistingUser
        },
        getAuthyId: state => {
          return state.authyId
        }
      }
});
