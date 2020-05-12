<template>
  <div class="login">  		
		<div class="container">
			<div class="row text-center p25t p25b">
				<router-link to="/" class="col">
				    <img src="@/assets/sarascare-logo.png" alt="Sarascare" id="logo"/>
				</router-link>
			</div>
			<div class="row text-center align-items-center justify-content-center">
				<div class="col-12 col-sm-10 col-md-6" v-if="registerAsNew == true">
					<LoginForm componentTitle="Login to your account"/>
					<RegisterForm componentTitle="Register an account"/>
				</div>
				<div class="col-12 col-sm-10 col-md-6" v-if="registerAsNew == false">
					<RegisterAsReporter componentTitle="Register an account"/>
				</div>
			</div>
		</div>
  </div>
</template>

<style lang="scss">
@import '@/styles/theme.scss';

	.login {
		padding: 50px 0;
		background-color: #fff;

		#logo { margin: 0 0 25px; max-height: 60px; }

		.left {
			h1 {
				line-height: 1;
				small { 
					display: block; 
					padding-top: 15px;
				}
			}
		}

		form {
			margin-bottom: 25px; 

			h4 {
				margin-bottom: 25px; 

				&.or {
					position: relative;

					span {
						position: relative;
						background-color: white;
						width: 100px; display: inline-block;
						z-index: 1;
					}

					&:before {
						content: '';
						position: absolute; top: 50%; left: 0;
						width: 100%; height: 1px;
						background-color: $dark;
					    @include transform(translateY(-50%));
					}
				}
			}

		} 
	}
</style>

<script>
	// @ is an alias to /src
	import LoginForm from "@/components/public/LoginForm.vue";
	import RegisterForm from "@/components/public/RegisterForm.vue";
	import RegisterAsReporter from "@/components/public/RegisterAsReporter.vue";
	// https://www.thepolyglotdeveloper.com/2018/04/simple-user-login-vuejs-web-application/

	export default {
  		name: "Login",
  		components: {
  			LoginForm,
  			RegisterForm,
  			RegisterAsReporter
  		},
  		data() {
            return {
                registerAsNew: this.$parent.registration.asNew,
            }
        },
        methods: {
            // login() {
            //     if(this.input.email != "" && this.input.password != "") {
            //         if(this.input.email == this.$parent.mockAccount.email && this.input.password == this.$parent.mockAccount.password) {
            //             this.$emit("authenticated", true);
            //             this.$router.replace({ name: "Dashboard" });
            //         } else {
            //             console.log("The email and / or password is incorrect");
            //         }
            //     } else {
            //         console.log("An email and password must be present");
            //     }
            // }
        }
	};
</script>