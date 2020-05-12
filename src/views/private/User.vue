<template>

    <div id="dashboard" class="private m80b">

        <RegUserHeader v-if="this.$parent.loggedin.role === 'ROLE_REGISTERED_USER'" compTitle="Header"/>
        <CaseOfficerHeader v-if="this.$parent.loggedin.role === 'ROLE_CASE_OFFICER'" compTitle="Header"/>
        <AdminHeader v-if="this.$parent.loggedin.role === 'ROLE_ADMIN'" compTitle="Header"/>

        <section class="loadcontent">
            <div class="container-fluid">
                <div class="row m50t">

                    <section id="user" class="has-bgwbor col-12">
                        <form @submit="formSubmit" v-if="$route.name == 'admin-user-edit' || $route.name == 'cofficer-user-edit' || $route.name == 'reguser-user-edit'">
                            <div class="row each justify-content-between align-items-center">
                                <h4 class="col-6 col-md-auto">
                                    Edit User ID: <strong>#{{ viewUser.id }}</strong>
                                </h4>
                            
                                <div class="col-6 col-md-auto">
                                    <button class="btn bordered secondary" @click="back">Cancel</button>
                                      <button type="submit" :disabled="$v.$invalid" class="btn solid primary m10l">
                                        <span v-if="loading" class="spinner-border spinner-border-sm-inline" role="status" aria-hidden="true"></span>Save</span>
                                    </button>
                                </div>
                            </div>

                            <div class="row each">
                                <b-notification 
                                    class="col-12 w-100"
                                    v-if="issuccess == true"
                                    type="is-success" 
                                    aria-close-label="Close notification">
                                            <i class="fas fa-check-circle"></i> User has been updated successfully.
                                </b-notification>

                                <h4 class="col-12">User Details</h4>
                                <div class="col-12 col-md-6">
                                    <div class="row">
                                        <label class="col-12 col-md-4">Username:</label>
                                        <b-field class="col-12 col-md-6">
                                            <b-input 
                                                v-model="edit_username" 
                                                type="name"
                                                placeholder="Enter new username" 
                                                minlength="3"
                                                >
                                            </b-input>
                                        </b-field>
                                    </div>
                                    <div class="row">
                                        <label class="col-12 col-md-4">Name:</label>
                                        <b-field class="col-12 col-md-6">
                                            <b-input 
                                                v-model="edit_name" 
                                                type="name"
                                                placeholder="Enter new name" 
                                                minlength="3"
                                                >
                                            </b-input>
                                        </b-field>
                                    </div>
                                    <div class="row">
                                        <label class="col-12 col-md-4">Email:</label>
                                        <b-field class="col-12 col-md-6">
                                            <b-input 
                                                v-model="edit_email" 
                                                type="email"
                                                placeholder="Enter new email" 
                                                >
                                            </b-input>
                                        </b-field>
                                    </div>
                                  <div class="row" v-if="this.$parent.loggedin.role === 'ROLE_ADMIN'">
                                    <label class="col-12 col-md-4">User Role:</label>         
                                    <b-field class="col-12 col-md-6" >
                                    <b-select  id="caseOffenseType" expanded
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
                                        <label class="col-12 col-md-4">Phone:</label>
                                        <b-field class="col-12 col-md-6">
                                            <b-input 
                                                v-model="edit_phone" 
                                                type="phone"
                                                placeholder="Enter new phone number" 
                                                minlength="3">
                                            </b-input>
                                        </b-field>
                                    </div>
                                    <div class="row">
                                        <label class="col-12 col-md-4">Date of Birth:</label>
                                        <b-field class="col-12 col-md-6">
                                            <b-input
                                                v-model="edit_dob"
                                                type="date"
                                                placeholder="Enter date of birth">
                                                </b-input>
                                        </b-field>
                                    </div>
                                    <div class="row">
                                        <label class="col-12 col-md-4">New Password:</label>
                                        <b-field class="col-12 col-md-6">
                                            <b-input 
                                                v-model="password" 
                                                type="password"
                                                placeholder="Enter new password" 
                                                v-model.trim="$v.edit_password.$model">
                                            </b-input>
                                        </b-field>
                                        <p class="error col-12" v-if="!$v.edit_password.minLength">Password must have at least {{ $v.edit_password.$params.minLength.min }} letters.</p>
                                    </div>

                                    <div class="row">
                                        <label class="col-12 col-md-4">Confirm Password:</label>
                                        <b-field class="col-12 col-md-6">
                                            <b-input 
                                                v-model="edit_confirmpassword" 
                                                type="password"
                                                placeholder="Repeat new password" 
                                                v-model.trim="$v.edit_confirmpassword.$model">
                                            </b-input>
                                        </b-field>
                                        <p class="error col-12" v-if="!$v.edit_confirmpassword.sameAsPassword">Passwords must be identical.</p>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div v-if="$route.name == 'admin-user-view'">
                            <div class="row each justify-content-between align-items-center">
                                <h4 class="col-6 col-md-auto">
                                    View User ID: <strong>#{{ viewUser.id }}</strong>
                                </h4>
                                
                                <div class="col-6 col-md-auto">
                                    <button class="btn bordered secondary" @click="goBack">Go Back</button>
                                    <button class="btn solid primary m10l" @click="editUser(viewUser.id)">Edit</button>
                                </div>
                            </div>

                            <div class="row each">
                                <h4 class="col-12">User Details</h4>
                                <div class="col-12 col-md-6">
                                    <div class="row">
                                        <label class="col-12 col-md-4">User Name:</label>
                                        <p class="col-12 col-md-6">
                                            {{ viewUser.userAccount.username }}
                                        </p>
                                    </div>
                                    <div class="row">
                                        <label class="col-12 col-md-4">Name:</label>
                                        <p class="col-12 col-md-6">
                                            {{ viewUser.name }}
                                        </p>
                                    </div>
                                    <div class="row">
                                        <label class="col-12 col-md-4">Email:</label>
                                        <p class="col-12 col-md-6">
                                            {{ viewUser.email }}
                                        </p>
                                    </div>
                                    <div class="row">
                                        <label class="col-12 col-md-4">Phone:</label>
                                        <p class="col-12 col-md-6">
                                            {{ viewUser.phoneNumber }}
                                        </p>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6">
                                    <div class="row">
                                        <label class="col-12 col-md-4">Date of Birth:</label>
                                        <p class="col-12 col-md-6">
                                            {{ new Date(viewUser.dateOfBirth).toLocaleDateString() }}
                                        </p>
                                    </div>
                                    <div class="row">
                                        <label class="col-12 col-md-4">Role:</label>
                                        <p class="col-12 col-md-6" v-if="checkAdmin(viewUser.userAccount.roles)">Admin</p>
                                        <p class="col-12 col-md-6" v-if="checkCaseOfficer(viewUser.userAccount.roles)">Case Officer</p>
                                        <p class="col-12 col-md-6" v-if="checkRegUser(viewUser.userAccount.roles)">Registered User</p>
                                    </div>
                                    <div class="row" v-if="checkAdmin(viewUser.userAccount.roles)">
                                        <label class="col-12 col-md-4">Status:</label>
                                        <p class="col-12 col-md-6" > 
                                        {{ this.showStatus(viewUser.isActive) }}
                                        </p>
                                    </div>
                                     <div class="row" v-if="checkCaseOfficer(viewUser.userAccount.roles)">
                                        <label class="col-12 col-md-4">Status:</label>
                                        <p class="col-12 col-md-6" > 
                                        {{ this.showStatus(viewUser.isActive) }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="row each" v-if="!checkRegUser(viewUser.userAccount.roles)">
                                <h4 class="col-12">Account Details</h4>
                                <div class="col-12 col-md-6">
                                    <div class="row">
                                        <label class="col-12 col-md-4">Join Date:</label>
                                        <p class="col-12 col-md-6">
                                            {{ new Date(viewUser.joinDate).toLocaleDateString() }}
                                        </p>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6">
                                    <div class="row" v-if="viewUser.leftDate">
                                        <label class="col-12 col-md-4">End Date:</label>
                                        <p class="col-12 col-md-6">
                                            {{ new Date(viewUser.leftDate).toLocaleDateString() }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    </div>
</template>

<script>

    import AdminHeader from "@/components/private/admin/Header.vue"
    import CaseOfficerHeader from "@/components/private/caseofficer/Header.vue"
    import RegUserHeader from "@/components/private/registereduser/Header.vue";
    import { required, sameAs, minLength } from 'vuelidate/lib/validators'
    import UsersApi from '@/services/UsersApi'
    import { userRoles } from '@/constants/userRoles.js';

    export default {
        name: 'User',
        props: ['id'],
        components: {
            AdminHeader,
            CaseOfficerHeader,
            RegUserHeader
        },
        validations: {
            edit_password: {
                minLength: minLength(6)
            },
            edit_confirmpassword: {
                sameAsPassword: sameAs('edit_password')
            }
        },
        data() {
            return {
                viewUser: '',

                issuccess: false,

                isActive: '',
                edit_userid: '',
                edit_username: '',
                edit_name: '',
                edit_phone: '',
                edit_email: '',
                edit_dob: '',
                edit_password: '',
                edit_confirmpassword: '',
                userAccID: '',
                selected:'',
                allUserRoles: userRoles,
                loading:false
            }
        },
        mounted() {
            if (!this.$parent.checkLoggedIn()) {
				this.$router.push('/404')
			}
            else {
                console.log('Admin User mounted.')
                var AuthStr = "Bearer " + this.$parent.mainJWT.data.token;
                var config = {headers: {'Authorization': AuthStr }};
                UsersApi.fetchSingle(this.id,config).then(response => {
                    this.viewUser = response
                    this.edit_userid = response.id
                    this.edit_name = response.name
                    this.edit_phone = response.phoneNumber
                    this.edit_email = response.email
                    this.edit_dob =  response.dateOfBirth
                    this.edit_username = response.userAccount.username
                    this.userAccID =  response.userAccount.id
                    this.isActive = response.isActive
                    this.selected = response.userAccount.roles && response.userAccount.roles[0]
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },
        methods: {
            // go back by one record, the same as history.back()
            back() { this.$router.go(-1) },
            goBack() { this.$router.go(-2) },

            // button to trigger Edit User actions
            editUser(id) {
                this.$router.push('/admin/user/edit/' + id)
            },
            formSubmit(e) {
                this.loading=true;
                e.preventDefault();
                var AuthStr = "Bearer " + this.$parent.mainJWT.data.token;
				var config = {headers: {'Authorization': AuthStr }};
                axios.patch('contacts/' + this.id, {
                     name: this.edit_name,
                     phoneNumber: this.edit_phone,
                     email: this.edit_email,
                     dateOfBirth: this.edit_dob
                }, config)
                .then((response) => {
                    this.$parent.loggedin.name = this.edit_name
                    this.$parent.loggedin.phone = this.edit_phone
                    this.$parent.loggedin.email = this.edit_email
                    this.$parent.loggedin.dob = this.edit_dob
                    
                    if(this.edit_password===""){
                    axios.patch('user-accounts/' + this.userAccID, {
                         username: this.edit_username,
                         roles: this.selected 
                    }, config)

                    .then((response) => {
                        this.$parent.loggedin.userName = this.edit_username
                    })
                    }else{
                    axios.put('user-accounts/' + this.userAccID, {
                         username: this.edit_username,
                         password: this.edit_password,
                         roles: this.selected 
                    }, config)

                    .then((response) => {
                        this.$parent.loggedin.userName = this.edit_username
                    })
                    }
                    this.issuccess = true
                    this.loading=false;
                }) .catch(error => {
                    this.loading=false;
                })
            },

            checkAdmin(a) {
                if (a.includes("ROLE_ADMIN")) {
                    return true;
                }
                else 
                    return false;
            },

            checkCaseOfficer(a) {
                if (a.includes("ROLE_CASE_OFFICER")) {
                    return true;
                }
                else 
                    return false; 
            },

            checkRegUser(a) {
                if (a.includes("ROLE_REGISTERED_USER")) {
                    return true;
                }
                else 
                    return false; 
            },

            showStatus(status) {
                var statusLabel = 'Inactive';
                if (status) {
                    statusLabel = 'Active';
                }
                return statusLabel;
            }
            
        }
    }
</script>

<style scoped lang="scss">
@import '@/styles/theme.scss';
@import '@/styles/table.scss';

    #boxoffour {
        .each {
            background-color: $white; color: $secondary;
            border: 1px solid rgba($secondary, .3);
            height: 120px;
            -webkit-box-flex: 0;
            -ms-flex: 0 0 24%;
            flex: 0 0 24%;
            max-width: 24%;
            border-radius: $bradius;

            @include bp-md {
                -ms-flex: 0 0 50%;
                flex: 0 0 50%;
                max-width: 50%;
            }

            @include bp-sm {
                -ms-flex: 0 0 100%;
                flex: 0 0 100%;
                max-width: 100%;
            }

            .left { font-size: 18px; line-height: normal; }
            .right { 
                font-size: 35px; font-weight: bold; 
                text-align: right;
            }
        }
    }
</style>