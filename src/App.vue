<template>
    <div id="app">
        <!-- <router-view /> -->
        <router-view @authenticated="setAuthenticated" />
    </div>
</template>

<script type="text/javascript">
    export default {
        name: 'App',
        data() {
            return {
                authenticated: true,
                mainJWT: '',
                mainName: '',
                mainUserName: '',
                mainContactId: '',
                mainUserRoles: '',

                registration: {
                    asNew: true,
                    reportedUserID: '',
                },
                
                loggedin: {
                    id: '',
                    name: '',
                    userName: '',
                    email: '',
                    phone: '',
                    dob: '',
                    joined: '',
                    left: '',
                    isActive: '',
                    role: '',
                }
            }
        },
        mounted() {
            if(!this.authenticated) {
                console.log("hit app.vue");
                this.$router.replace({ name: "login" });
            }
        },
        methods: {
            setAuthenticated(status) {
                this.authenticated = status;
            },
            
            checkLoggedIn() {
                if (this.loggedin.role.length > 0) {
                    return true;
                }
                else {
                    return false;
                }
            },
            
            logout() {
                this.authenticated = false;
                this.mainJWT = '';
                this.mainName = '';
                this.mainUserName = '';
                this.mainContactId = '';
                this.mainUserRoles = '';
				this.loggedin.id = '';
				this.loggedin.name = '';
				this.loggedin.userName = '';
				this.loggedin.email = '';
				this.loggedin.phone = '';
				this.loggedin.dob = '';
				this.loggedin.joined = '';
				this.loggedin.left = '';
				this.loggedin.isActive = '';
				this.loggedin.role = '';
            }
        }
    }
</script>
