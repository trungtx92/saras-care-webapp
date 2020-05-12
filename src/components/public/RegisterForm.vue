<template>
  <form id="register" class="needs-validation" @submit.prevent>
    <h4 class="or">
      <span>Or</span>
    </h4>

    <h4>{{ componentTitle }}</h4>

    <div class="row form-group">
      <div class="col-12">
        <b-notification
          class="col-12 w-100"
          has-icon
          v-show="status_istaken == true"
          :active.sync="status_istaken"
          type="is-warning"
          aria-close-label="Close notification"
        >Username is already taken, please try again.</b-notification>

        <b-notification
          class="col-12 w-100"
          v-show="status_issuccess == true"
          :active.sync="status_issuccess"
          has-icon
          type="is-success"
          aria-close-label="Close notification"
        >Registered successfully. Please use above form to login.</b-notification>

        <b-field>
          <b-input
            id="name"
            v-model="name"
            type="name"
            placeholder="Enter Name *"
            minlength="3"
            required
          ></b-input>
        </b-field>

        <b-field>
          <b-input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter Email *"
            required
            @input="$v.email.$touch"
          ></b-input>
        </b-field>

        <b-field>
          <b-field>
             <b-input
                v-bind:placeholder="$t('countryCode')"
                icon="earth"
                :disabled="true"
                v-model="country_code"
              >
              </b-input>
          </b-field>
          <div id="parent" style="width:100%">
            <div>
              <b-input
                id="phone"
                v-model.trim="$v.phone.$model"
                type="phone"
                placeholder="Enter Phone Number"
                expanded
              ></b-input>
            </div>
            <div id="phone-error" v-if="$v.phone.$dirty" style="margin:9px">
               <p class="error" v-if="!$v.phone.checkValid">Please enter a phone number.</p>
            </div>
          </div>
        </b-field>
        <hr />

        <b-field>
          <b-input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter Username *"
            minlength="3"
            required
          ></b-input>
        </b-field>

        <b-field>
          <b-input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter Password *"
            required
            v-model.trim="$v.password.$model"
          ></b-input>
        </b-field>
        <div v-if="$v.password.$dirty">
          <p class="error" v-if="!$v.password.checkValue">Password must have a letter, a number, special character, and be more than 8 characters long.</p>
        </div>

        <b-field>
          <b-input
            id="confirmpassword"
            v-model="confirmpassword"
            type="password"
            placeholder="Confirm Password *"
            v-model.trim="$v.confirmpassword.$model"
          ></b-input>
        </b-field>
        <p class="error" v-if="!$v.confirmpassword.sameAsPassword">Passwords must be identical.</p>
      </div>
    </div>

    <button
      :disabled="$v.$invalid"
      @click="formSubmit()"
      class="btn bordered primary w-100"
    >Sign up</button>
    <div class="text-center" v-if="loading">
      <b-spinner variant="primary" label="Text Centered"></b-spinner>
    </div>


    <p class="error" v-if="otpError">OTP could not be generated.</p>
  </form>
</template>

<script>
import {  required,sameAs,minLength, email, and } from "vuelidate/lib/validators";


export default {
  name: "RegisterForm",
  props: {
    componentTitle: String
  },
 
  data: function() {
    return {
      username: "",
      password: "",
      confirmpassword: "",
      role: "ROLE_REGISTERED_USER",
      name: "",
      phone: "",
      email: "",
      dob: "",
      userAccountID: "",
      status_istaken: false,
      status_issuccess: false,
      showModal: false,
      loading: false,
      otpError: false,
      country_code: "+91",
    };
  },
  validations: {
    password: {
      required,
      checkValue(password) {
        if (
          /[a-z]/.test(password) &&
          /[0-9]/.test(password) &&
          /\W|_/.test(password) &&
          password.length >= 8
        ) {
          return true;
        }
        return false;
      }
    },
    confirmpassword: {
      sameAsPassword: sameAs("password")
    },
    email: {
      email: email,
      required: required
    },
    username: {
      required: required
    },
    phone: {
      required: required,
      checkValid (phone) {
       if( (/[0-9]/.test(phone))  && phone.length==10 && !(/[a-z]/.test(phone)) && !(/[A-Z]/.test(phone)) && !(/\W|_/.test(phone))){
           return true;
        }
          return false;
        }
    },
    country_code: {
      required: required
    }
  },
  methods: {
    formSubmit() {
      // Step 1 - create user account and retrieve the userAccountId
      this.loading = true;
      axios
        .post("user-accounts", {
          username: this.username,
          password: this.password,
          roles: this.role
        })
        .then(response => {
          // Step 2 - set returned ID as userAccountID
          this.userAccountID = response.data.id;

          // Step 3 - Create an "Other Contact" by sending the rest
          axios
            .post("other-contacts", {
              name: this.name,
              phoneNumber: this.phone,
              email: this.email,
              userAccount: this.userAccountID
            })
            .then(response => {
              this.loading = false;              
              this.status_istaken = false;
              this.status_issuccess = true;
            })
            .catch(error => {
              this.loading = false;     
            });
        })
        .catch(error => {
           this.loading = false;              
          this.status_issuccess = false;
          this.status_istaken = true;
        });
    },
  }
};
</script>

<style scoped>
#register > p {
  font-size: 15px;
  margin-top: 15px;
}
</style>