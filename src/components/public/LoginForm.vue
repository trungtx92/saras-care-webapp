<template>
<div>
  <form id="login" class="needs-validation">
		<h4>{{ componentTitle }}</h4>

		<div class="m25b">
			<b-field>
	            <b-input 
	            	v-model="input.email" 
	            	@click="clearUserCheckMessage"
	            	placeholder="Enter Username"
	                maxlength="30">
	            </b-input>
	        </b-field>

	        <b-field>
	            <b-input 
	            	v-model="input.password" 
	            	@click="clearUserCheckMessage"
					@keyup.native.enter="login"
	            	placeholder="Enter Password"
	                type="password">
	            </b-input>
	        </b-field>
			<p class="error" v-if="userCheckMessage">{{ userCheckMessage }} </p>
	  	</div>
	  	<button type="button" class="btn solid secondary submit w-100" v-on:click="login()">Sign In</button>
		<div class="text-center" v-if="loading">
      		<b-spinner variant="primary" label="Text Centered"></b-spinner>
   	    </div>
	</form>

<LoginModal :open="this.setActive" :phone="this.phone"  @close="closeChild" :method="routing"/>
	<div>
	</div>

</div> 
</template>

<script>
	import VueJwtDecode from 'vue-jwt-decode';
import { loadavg } from 'os';
import LoginModal from '../customComponents/LoginModal.vue';
	export default {
	  	name: "LoginForm",
	  	props: {
	    	componentTitle: String
		  },
		   components:{
			  LoginModal,
		  },
	  	data() {
            return {
                input: {
                    email: "",
                    password: ""
                },
                info: null,
				baseURL: axios.defaults.baseURL,
				url: '',
				jwt: '',
				jwtDecoded: '',
				userName: '',
				userRoles: '',
				AuthStr: '',
				userCheckMessage: '',
				loading: false,
				setActive:false,
				phone:""
            }
        },
		
        methods: {
			closeChild () {
				this.setActive=false;
    		},
            login() {
				let currentObj = this;
				this.$parent.$parent.mainUserName = ''
				this.$parent.$parent.mainContactId = ''
				this.$parent.$parent.mainUserRoles = ''
				this.$parent.$parent.mainName  = ''
				this.$parent.$parent.mainJWT = ''
				
                if(this.input.email != "" && this.input.password != "") {
					this.loading = true;
					axios.all([this.getProfile()])
					.then(axios.spread((response)  => {
						this.jwt = response
	
						this.$parent.$parent.mainJWT = response
						this.doRouting()
						// this.doCheckSecured()
				
						
					}))

					.catch((error) => {
						console.log('ERROR_LOGIN')
						this.loading= false;
						this.userCheckMessage = "User [" + this.input.email + "] not found or password incorrect"
						
					});

                } else {
					this.userCheckMessage = "An email and password must be present";
                }
				
            },
			getProfile() {
				this.url = this.baseURL + '/tokens';
				return axios.post(
                    this.url, {}, {
                            auth: {
                                username: this.input.email,
                                password: this.input.password
                            }
                        }
					)
			},
			getName() {
				var AuthStr = "Bearer " + this.$parent.$parent.mainJWT.data.token;
				var config = {headers: {'Authorization': AuthStr }};
				this.url = this.baseURL + '/contacts/' + this.jwtDecoded.contactId;
				return  axios.get(this.url, config)  
			},
			doRouting() {

				this.jwtDecoded = VueJwtDecode.decode(this.jwt.data.token)
				this.userName = this.jwtDecoded.username
				this.userRoles = this.jwtDecoded.roles
				
				this.$parent.$parent.mainUserName = this.userName 
				this.$parent.$parent.mainContactId = this.jwtDecoded.contactId
				this.$parent.$parent.mainUserRoles = this.userRoles

				axios.all([this.getName()])
					.then(axios.spread((response)  => {
						// can be deleted
						this.$parent.$parent.mainName = response.data.name

						// remain
						this.$parent.$parent.loggedin.id = response.data.id
						this.$parent.$parent.loggedin.name = response.data.name
						this.$parent.$parent.loggedin.userName = response.data.userAccount.username
						this.$parent.$parent.loggedin.email = response.data.email
						this.$parent.$parent.loggedin.phone = response.data.phoneNumber
						this.$parent.$parent.loggedin.dob = response.data.dateOfBirth
						this.$parent.$parent.loggedin.joined = response.data.joinDate
						this.$parent.$parent.loggedin.left = response.data.leftDate
						this.$parent.$parent.loggedin.isActive = response.data.isActive
						this.$parent.$parent.loggedin.role = response.data.userAccount.roles["0"]
						this.$parent.$parent.authenticated = true
						this.goForth() 

					}))

				// this.userCheckMessage = 'Cannot authenticate user'						

			},
			openOtpModal() {
			this.phone= this.$parent.$parent.loggedin.phone;
			this.setActive= true;

            axios.post("genOTP/", {
			    phone_number: this.$parent.$parent.loggedin.phone,
                email: this.$parent.$parent.loggedin.email,
                country_code: '+61'
              })
              .then(response => {
                this.loading = true;
                var msg = response && response.data;
                if (msg.status === "TOKEN-SENT") {
					this.$store.commit('setAuthyId',msg.authyID);
					this.loading = false;
                }
              })
              .catch(error => {
                console.log(error);
                this.loading = false;
                this.otpError = true;
              });
    		},
			goForth () {
					if (this.userName != '' && this.userRoles != '') {
						if (this.userRoles.includes("ROLE_ADMIN") && this.$parent.$parent.loggedin.phone != null) {
							this.openOtpModal()
						}
					else if (this.userRoles.includes("ROLE_ADMIN")) {
						if (this.$parent.$parent.loggedin.phone == null) {
							this.userCheckMessage = ''
						this.$emit("authenticated", true)
						this.$router.replace({ name: "admin-dash" })
						}
					}
					else if (this.userRoles.includes("ROLE_CASE_OFFICER")) {
						this.openOtpModal()
					}
					else if (this.userRoles.includes("ROLE_REGISTERED_USER") || this.userRoles.includes("ROLE_SPECIAL")) {
						this.userCheckMessage = ''
						this.$emit("authenticated", true)
						this.$router.replace({ name: "reguser-dash" })
					}
					}
			},
			routing(){
				if (this.userName != '' && this.userRoles != '') {
					if (this.userRoles.includes("ROLE_ADMIN")) {
						this.userCheckMessage = ''
						this.$emit("authenticated", true)
						this.$router.replace({ name: "admin-dash" })
					}
					else if (this.userRoles.includes("ROLE_CASE_OFFICER")) {
						this.userCheckMessage = ''
						this.$emit("authenticated", true)
						this.$router.replace({ name: "cofficer-dash" })
					}
					else if (this.userRoles.includes("ROLE_REGISTERED_USER") || this.userRoles.includes("ROLE_SPECIAL")) {
						this.userCheckMessage = ''
						this.$emit("authenticated", true)
						this.$router.replace({ name: "reguser-dash" })
					}
				} 
			},
			doCheckSecured() {

				// alert('doCheckSecured')
				axios.all([this.checkProtectedArea()])

				.then(axios.spread((response)  => {
					console.log('Z_SECURED')
					console.log(response)						
				}))

				.catch((error) => {
					console.log('ERROR_SECURED')
					console.log(error)
					alert(error)
				});
			},
			checkProtectedArea() {
				this.url = this.baseURL + '/staff';
				this.AuthStr = "Bearer " + this.$parent.$parent.mainJWT.data.token;

				// alert(this.AuthStr);
			
				var config = {
					headers: {'Authorization': this.AuthStr }
				};

				return axios.get(this.url,config)


			},
			clearUserCheckMessage: function(evt) {
				this.userCheckMessage = '';
			}
        }
	};
</script>

<style scoped lang="scss">

</style>
