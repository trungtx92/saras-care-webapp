<template>
  <div class="hero">
    <div class="has-overlay"></div>
    <div class="hero-content">
      <div class="container h-100">
        <!-- Modal -->
        <b-modal :active.sync="isCardModalActive" :can-cancel="false" has-modal-card>
          <div class="modal-card" style="width: auto">
            <section class="modal-card-body">
              <p>Please Choose your default Language</p>
              <b-field>
                <b-select placeholder="Default Language" icon="earth" v-model="language">
                  <option value="en">English (en)</option>
                  <option value="hi">हिंदी (हिं)</option>
                </b-select>
              </b-field>
            </section>
            <footer class="modal-card-foot">
              <button class="button" :disabled="language===null" type="button" @click="isCardModalActive=false">Save</button>
            </footer>
          </div>
        </b-modal>

        <div class="row h-100 align-items-center justify-content-between">
          <div class="col-12 col-lg-5 left">
            <div class="row top">
              <div class="col">
			      	<a href="https://saras.care" target="_blank">
                <img src="../assets/sarascare-logo.png" alt="Sarascare" id="logo" />
				      </a>
              </div>
            </div>

            <div class="row bottom">
              <div class="col">
                <h1 v-if="formstep === 1">
                  Together we build a safer society
                  <br />
                </h1>
                <h1 v-if="formstep === 2">
                  Let us know who is involved in the offense
                  <br />
                </h1>
                <h1 v-if="formstep === 3">
                  Offense reported to Sarascare
                  <br />
                </h1>

                <p
                  v-if="formstep === 1"
                >We can achieve that with your help. Take action today and report an abuse.</p>
                <p
                  v-if="formstep === 2"
                >This will help us identify all the parties and tackle the issue prompt & accurately.</p>
                <p
                  v-if="formstep === 3"
                >Thanks for reporting to us, and believing in making a difference.</p>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-6 right">
            <HeroForm  v-if="!isRegisteredUserAccess" :language.sync="language" :componentTitle="$t('formTitle')" />
            <RegisteredHeroForm v-else :componentTitle="$t('formTitle')" />
            <div v-if="!isRegisteredUserAccess" class="accountinfo text-center">
              <router-link to="/login">Click here to Login or Register</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HeroForm from "@/components/public/HeroForm.vue";
import RegisteredHeroForm from "@/components/private/registereduser/RegisteredHeroForm.vue";

export default {
  name: "Home",
  components: {
    HeroForm,
    RegisteredHeroForm
  },
  data() {
    return {
      formstep: 1,
      selected: null,
      language: null,
      modalShow: false,
      isCardModalActive: false,
      isRegisteredUserAccess:false,
      languages: [
        { value: null, text: "Please Choose Default Language" },
        { value: "en", text: "English" },
        { value: "hi", text: "हिंदी" }
      ]
    };
  },
  watch: {
    language: function(value) {
      if (value != null && value!="") {
        localStorage.setItem("language", JSON.stringify(this.language));
        this.$locale = value;
      }
    }
  },
  mounted() {
    if (
      localStorage.getItem("language") != "undefined" &&
      localStorage.getItem("language") != null && localStorage.getItem("language") != ""
    ) {
      this.language = JSON.parse(localStorage.getItem("language"));
    } else {
      //this.isCardModalActive = true;
    }

    this.isRegisteredUserAccess = this.$store.getters.getReportByExistingUser;
  }
};
</script>

<style lang="scss">
@import "@/styles/theme.scss";
@import "@/styles/public/default.scss";
</style>
