<template>
	<header id="private">
	    <div class="container-fluid h-100">
	        <div class="row h-100">
			    <nav class="col navbar-expand-lg w-100">
			    	<div class="row justify-content-between align-content-center">
			            <router-link to="/" class="navbar-logo col-6 col-md-4 align-self-center">
			                <img src="@/assets/sarascare-logo.png" alt="Sarascare" id="logo"/>
			            </router-link>

				        <button class="navbar-toggler col-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				            <span class="navbar-toggler-icon">
				            	<i class="fas fa-bars"></i>
				            </span>
				        </button>

				        <div class="collapse navbar-collapse col-12 col-md-8 justify-content-end" id="navbarSupportedContent">
				            <ul class="navbar-nav">
				                <li class="nav-item">
					                <router-link to="/" class="nav-link col">Report a crime</router-link>
					            </li>
					            <li class="nav-item">
					                <router-link to="/reguser/profile" class="nav-link col user">
					            		<i class="fas fa-user-circle"></i> {{ this.$parent.$parent.loggedin.name }}
					            	</router-link>
					            </li>
					            <li class="nav-item">
					                <router-link to="/login" v-on:click.native="logout()" replace class="nav-link col">
					                	<i class="fas fa-sign-out-alt"></i> Logout
					                </router-link>
					            </li>
				            </ul>
				        </div>
				    </div>
			    </nav>       
	        </div>
	    </div>
	</header>
</template>

<script>
    export default {
        name: 'Header',
        props: {
            componentTitle: String
        },
        mounted() {
            console.log('Header component mounted.')
		},
		beforeDestroy(){
			this.$store.commit('setReportByExistingUser');
		},
        data() {
            return {
                // authenticated: true
            }
        },
        methods: {
            setAuthenticated(status) {
                this.authenticated = status;
            },
            logout() {
                this.$parent.$parent.logout();
            }
        }
        
    }
</script>

<style lang="scss">
	@import '@/styles/theme.scss';
	@import '@/styles/private/header.scss';
</style>