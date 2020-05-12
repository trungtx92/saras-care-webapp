<template>

  <form id="register" class="needs-validation" @submit="formSubmit">

		<h4>{{ componentTitle }}</h4>

		<div class="row form-group">

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

            <div class="col-12">
                <b-field>
                    <b-input 
                        id="username" v-model="username" 
                        type="text"
                        placeholder="Enter Username  *" 
                        minlength="3"
                        required >
                    </b-input>
                </b-field>

                <b-field>
                    <b-input 
                        id="password" v-model="password" 
                        type="password"
                        placeholder="Enter Password *"
                        required
                        v-model.trim="$v.password.$model" >
                    </b-input>
                    
                </b-field>
                <p class="error" v-if="!$v.password.minLength">Password must have at least {{ $v.password.$params.minLength.min }} letters.</p>

                <b-field>
                    <b-input 
                        id="confirmpassword" v-model="confirmpassword" 
                        type="password"
                        placeholder="Confirm Password *"
                        v-model.trim="$v.confirmpassword.$model">
                    </b-input>
                    
                </b-field>
                <p class="error" v-if="!$v.confirmpassword.sameAsPassword">Passwords must be identical.</p>
            </div>

	  	</div>
	  	<button type="submit" class="btn solid secondary submit w-100">Sign up</button>
	</form>
</template>

<script>
    import { required, sameAs, minLength } from 'vuelidate/lib/validators'

	export default {
	  	name: "RegisterForm",
	  	props: {
	    	componentTitle: String
	  	},
	  	data() {
            return {
                username: '',
                password: '',
                confirmpassword: '',
                role: 'ROLE_REGISTERED_USER',
                name: '',
                phone: '',
                email: '',
                dob: '',
                userAccountID: '',
                contactID: '',
                status_issuccess: false,
                status_istaken: false
            }
        },
        validations: {
            password: {
                minLength: minLength(6)
            },
            confirmpassword: {
                sameAsPassword: sameAs('password')
            }
          },
        methods: {
            formSubmit(e) {
                e.preventDefault();
                this.contactID = this.$parent.$parent.registration.reportedUserID;
                // Step 1 - create user account and retrieve the userAccountId
                axios.post('user-accounts', {
                     username: this.username,
                     password: this.password,
                     roles: this.role,
                })
                .then((response) => {
                    // Step 2 - Create an "Other Contact" by sending the rest
                    // Step 3 - Update Contact with new UserAccountID
                    console.log(response)
                    this.userAccountID = response.data.id;

                    axios.all([
                        this.postOtherContact(),
                        this.postContactUserAccount()
                    ])
					.then(axios.spread((response)  => {
                        this.status_issuccess = true;
					}))
                })
                .catch(error => {
                    this.status_istaken = true;
                })
            },
            postOtherContact() {
                axios.patch('other-contacts', {
                        userAccount: this.userAccountID
                })
            },
            postContactUserAccount() {
                axios.patch('contacts/' + this.contactID, {
                         userAccount: this.userAccountID
                })
            },
        }
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
