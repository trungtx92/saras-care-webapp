<template>
	<section id="user" class="add has-bgwbor col-12">
        <div class="row each justify-content-between align-items-center">
            <h4 class="col-6 col-md-4">
                {{ componentTitle }}
            </h4>
            
            <div class="col-6 col-md-4 text-right">
                <button class="btn bordered secondary" @click="back">Go Back</button>
                 <button type="button" :disabled="$v.$invalid"  @click="formSubmit" class="btn solid primary m10l">
                    <span v-if="loading" class="spinner-border spinner-border-sm-inline" role="status" aria-hidden="true"></span>Save</span>
                </button>
            </div>

        </div>

        <form id="adduser" class="row each" novalidate  enctype="multipart/form-data">
            <b-notification 
                class="col-12 w-100"
                v-if="status_issuccess == true"
                type="is-success" 
                aria-close-label="Close notification">
                <i class="fas fa-check-circle"></i> User has been created successfully.
            </b-notification>

            <b-notification 
                class="col-12 w-100"
                v-if="status_istaken == true"
                type="is-warning" 
                aria-close-label="Close notification">
                <i class="fas fa-times-circle"></i> Username has been taken. Please try another. 
            </b-notification>  

            <div class="col-12 col-md-6">
                <div class="row">
                    <label class="col-12 col-md-4">Name:</label>
                    <b-field class="col-12 col-md-6">
                        <b-input 
                            id="newUserName" v-model="newUserName" 
                            type="newUserName"
                            placeholder="Enter Name" 
                            minlength="3"
                            value=""
                            >
                        </b-input>
                    </b-field>
                </div>
                <div class="row">
                    <label class="col-12 col-md-4">Email:</label>
                    <b-field class="col-12 col-md-6">
                        <b-input 
                            id="newUserEmail" v-model="newUserEmail" 
                            type="email"
                            placeholder="Enter Email" 
                             @input="$v.newUserEmail.$touch"
                            >
                        </b-input>
                    </b-field>
                </div>
                <div class="row" >
                    <label class="col-12 col-md-4">Phone:</label>
                    <b-field class="col-12 col-md-6" >
                        <b-input 
                            id="newUserPhoneNumber" v-model="newUserPhoneNumber" 
                            type="newUserPhoneNumber"
                            placeholder="Enter Phone" 
                            value=""
                              v-model.trim="$v.newUserPhoneNumber.$model"
                            >
                        </b-input>
                    </b-field>
                     <div id="phone-error" v-if="$v.newUserPhoneNumber.$dirty" >
               <p id="phoneError" v-if="!$v.newUserPhoneNumber.checkValid">Please enter a phone number.</p>
            </div>
                </div>

            <div class="row" >
                <label class="col-12 col-md-4">User Role:</label>         
                    <b-field class="col-12 col-md-6" >
                    <b-select  placeholder="Choose an User Role*" id="caseOffenseType" expanded
                        v-model="selected">
                        <option v-for="type in allUserRoles" v-bind:value="type.apiRole">
                            {{ type.value }}
                        </option>
                    </b-select>
                </b-field>
            </div>

            </div>
            <div class="col-12 col-md-6">
                <div class="row">
                    <label class="col-12 col-md-4">User Name:</label>
                    <b-field class="col-12 col-md-6">
                        <b-input 
                            id="newUserUsername" v-model="newUserUsername" 
                            type="newUserUsername"
                            placeholder="Enter User Name" 
                            minlength="3"
                            value=""
                            >
                        </b-input>
                    </b-field>
                </div>
                <div class="row">
                    <label class="col-12 col-md-4">Password:</label>
                    <b-field class="col-12 col-md-6">
                        <b-input 
                            id="newUserPassword" v-model="newUserPassword" 
                            type="password"
                            placeholder="Enter Password" 
                            value=""
                             v-model.trim="$v.newUserPassword.$model"
                            >
                        </b-input>
                    </b-field>
                     <div v-if="$v.newUserPassword.$dirty">
          <p id="passError" v-if="!$v.newUserPassword.checkValue" >Password must have a letter, a number, special character, and be more than 8 characters long.</p>
        </div>
                </div>
                <div class="row">
                    <label class="col-12 col-md-4">Confirm Password:</label>
                    <b-field class="col-12 col-md-6">
                        <b-input 
                            id="newUserConfirmPassword" v-model="newUserConfirmPassword" 
                            type="password"
                            placeholder="Confirm Password" 
                            value=""
                             v-model.trim="$v.newUserConfirmPassword.$model"
                            >
                        </b-input>
                    </b-field>
                    <p id="confirmPass" v-if="!$v.newUserConfirmPassword.sameAsPassword">Passwords must be identical.</p>
                </div>
            </div>
        </form>
	</section>
</template>

<script>
import {  required,sameAs,minLength, email, and } from "vuelidate/lib/validators";
import { userRoles } from '@/constants/userRoles.js';

    export default {
        name: 'AddUser',
        props: {
            componentTitle: String
        },
        mounted() {
            console.log('Admin User - Add mounted.')
        }, 
        data: function() {
            return {
                email:'',
                newUserName: '',
                newUserDateOfBirth: '', 
                newUserPhoneNumber: '',
                newUserEmail: '',
                newUserAccount: '',
                newUserJoinDate: '',
                newUserLeftDate: '',
                newUserisActive: true,
                newUserUsername: '',
                newUserPassword: '',
                newUserConfirmPassword: '',
                newUserRoles: ['ROLE_REGISTERED_USER'],
                selected:null,
                newUserStaffID: '',
                newUserAccountID: '',
                status_issuccess: false,
                status_istaken: false,
                allUserRoles: userRoles,
                loading: false
            }
        },

    validations: {
        newUserPassword: {
        required,
        checkValue(newUserPassword) {
            if (
                /[a-z]/.test(newUserPassword) &&
                /[0-9]/.test(newUserPassword) &&
                /\W|_/.test(newUserPassword) &&
                newUserPassword.length >= 8
            ) {
          return true;
            }
        return false;
        }
        },
    selected:{
        required: required
    },
    newUserConfirmPassword: {
      sameAsPassword: sameAs("newUserPassword")
    },
    newUserEmail: {
      newUserEmail: email,
      required: required
    },
    newUserUsername: {
      required: required
    },
    newUserPhoneNumber: {
      required: required,
      checkValid (newUserPhoneNumber) {
       if( (/[0-9]/.test(newUserPhoneNumber))  && newUserPhoneNumber.length==10 && !(/[a-z]/.test(newUserPhoneNumber)) && !(/[A-Z]/.test(newUserPhoneNumber)) && !(/\W|_/.test(newUserPhoneNumber))){
           return true;
        }
          return false;
        }
    }
  },
    methods: {
        back() {
                this.$router.push('/admin/users')
        },
        formSubmit() {
                let currentObj = this;
                this.loading = true;    
                 axios.all([
                    this.postStaff(),
                    this.postUserAccount()
                ])
                .then(axios.spread((staffResponse, userAccountResponse) => {
                    this.newUserStaffID = staffResponse.data.id
                    this.newUserAccountID = userAccountResponse.data.id
                    axios.all([
                        this.updateStaffUserAccount() 
                    ])
                    .then(axios.spread((updateStaffUserAccountResponse) => {
                        this.loading = false;    
                        this.status_issuccess = true;
                    })).catch(error => {
                        this.loading = false;    
                    })
                }))
        },
        postStaff() {
                var AuthStr = "Bearer " + this.$parent.$parent.mainJWT.data.token;
				var config = {headers: {'Authorization': AuthStr }};
				return axios.post('staff',{
                    name: this.newUserName,
                    phoneNumber: this.newUserPhoneNumber,
                    email: this.newUserEmail
                }, config)
        },
        postUserAccount() {
                var AuthStr = "Bearer " + this.$parent.$parent.mainJWT.data.token;
                var config = {headers: {'Authorization': AuthStr }};
                this.newUserRoles.push(this.selected);

				return axios.post('user-accounts', {
                    username: this.newUserUsername,
                    password: this.newUserPassword,
                    roles: this.newUserRoles
                }, config)
                .catch(error => {
                    this.status_istaken = true;
                })
            },
            updateStaffUserAccount() {
                var AuthStr = "Bearer " + this.$parent.$parent.mainJWT.data.token;
				var config = {headers: {'Authorization': AuthStr }};
				return axios.patch('staff/' + this.newUserStaffID, {
                    userAccount: this.newUserAccountID
                }, config)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '@/styles/theme.scss';
    @import '@/styles/table.scss';

    #passError{
       
    text-align: right;
    font-size: 12px;
    color: red;
    /* left: -38px; */
    margin-left: 280px;
    margin-top: -10px;

    }

    #confirmPass{
    text-align: right;
    font-size: 12px;
    color: red;
    /* left: -38px; */
    margin-left: 280px;
    margin-top: -10px;
    }

    #phoneError{
    text-align: right;
    font-size: 12px;
    color: red;
    /* left: -38px; */
    margin-left: 280px;
    margin-top: -10px;
    }
</style>
