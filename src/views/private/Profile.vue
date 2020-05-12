<template>

    <div id="dashboard" class="private m80b">

        <RegUserHeader v-if="this.$parent.loggedin.role === 'ROLE_REGISTERED_USER'" compTitle="Header"/>
        <CaseOfficerHeader v-if="this.$parent.loggedin.role === 'ROLE_CASE_OFFICER'" compTitle="Header"/>
        <AdminHeader v-if="this.$parent.loggedin.role === 'ROLE_ADMIN'" compTitle="Header"/>

        <section class="loadcontent">
            <div class="container-fluid">
                <div class="row m50t">
                    
                    <section id="profile" class="has-bgwbor col-12">
                        <div class="row each justify-content-between align-items-center">
                            <div class="col-6 col-md-4">
                                <div class="row">
                                    <h4 class="col-12">
                                        View User ID: <strong>#{{ this.$parent.loggedin.id }}</strong>
                                    </h4>
                                </div>
                            </div>
                            
                            <div class="col-6 col-md-auto text-right">
                                <button class="btn bordered secondary" @click="back">Go Back</button>
                                <button class="btn solid primary m10l" @click="editProfile(userid)">Edit</button>
                            </div>
                        </div>

                        <div class="row each">
                            <h4 class="col-12">User Details</h4>
                            <div class="col-12 col-md-6">
                                <div class="row">
                                    <label class="col-12 col-md-4">Username:</label>
                                    <p class="col-12 col-md-6">
                                        {{ this.$parent.loggedin.userName }}
                                    </p>
                                </div>
                                <div class="row">
                                    <label class="col-12 col-md-4">Name:</label>
                                    <p class="col-12 col-md-6">
                                        {{ this.$parent.loggedin.name }}
                                    </p>
                                </div>
                                <div class="row">
                                    <label class="col-12 col-md-4">Email:</label>
                                    
                                    <p class="col-12 col-md-6">{{ this.$parent.loggedin.email }}</p>
                                </div>
                                <div class="row">
                                    <label class="col-12 col-md-4">Phone:</label>
                                    <p class="col-12 col-md-6">
                                        {{ this.$parent.loggedin.phone }}
                                    </p>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="row">
                                    <label class="col-12 col-md-4">Date of Birth:</label>
                                    <p class="col-12 col-md-6">
                                        {{ new Date(this.$parent.loggedin.dob).toLocaleDateString() }}
                                    </p>
                                </div>
                                <div class="row">
                                    <label class="col-12 col-md-4">Role:</label>
                                    <p class="col-12 col-md-6" v-if="this.$parent.loggedin.role === 'ROLE_ADMIN'">Admin</p>
                                    <p class="col-12 col-md-6" v-if="this.$parent.loggedin.role === 'ROLE_CASE_OFFICER'">Case Officer</p>
                                    <p class="col-12 col-md-6" v-if="this.$parent.loggedin.role === 'ROLE_REGISTERED_USER'">Registered User</p>
                                </div>
                                <div class="row">
                                    <label class="col-12 col-md-4">Status:</label>
                                    <p class="col-12 col-md-6">Active</p>
                                </div>
                            </div>
                        </div>

                        <div class="row each" v-if="this.$parent.loggedin.role !== 'ROLE_REGISTERED_USER'">
                            <h4 class="col-12">Account Details</h4>
                            <div class="col-12 col-md-6">
                                <div class="row">
                                    <label class="col-12 col-md-4">Join Date:</label>
                                    <p class="col-12 col-md-6">
                                        {{ new Date(this.$parent.loggedin.joined).toLocaleDateString() }}
                                    </p>
                                </div>
                            </div>
                            <div class="col-12 col-md-6" v-if="this.$parent.loggedin.left">
                                <div class="row">
                                    <label class="col-12 col-md-4">End Date:</label>
                                    <p class="col-12 col-md-6">
                                        {{ new Date(this.$parent.loggedin.left).toLocaleDateString() }}
                                    </p>
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
    import AdminHeader from "@/components/private/admin/Header.vue";
    import CaseOfficerHeader from "@/components/private/caseofficer/Header.vue";
    import RegUserHeader from "@/components/private/registereduser/Header.vue";

    export default {
        name: 'Profile',
        components: {
            AdminHeader,
            CaseOfficerHeader,
            RegUserHeader
        },
        data() {
            return {
                userid: this.$parent.loggedin.id
            }
        },
        mounted() {
            if (!this.$parent.checkLoggedIn()) {
				this.$router.push('/404')
			}
        },
        methods: {
            back() {
                this.$router.push('/reguser')
            },
            editProfile(id) {
                if(this.$parent.loggedin.role === 'ROLE_ADMIN')
                    this.$router.push('/admin/user/edit/' + id)

                if(this.$parent.loggedin.role === 'ROLE_CASE_OFFICER')
                    this.$router.push('/caseofficer/user/edit/' + id)

                if(this.$parent.loggedin.role === 'ROLE_REGISTERED_USER')
                    this.$router.push('/reguser/user/edit/' + id)

                if(this.$parent.loggedin.role === 'ROLE_SPECIAL')
                    this.$router.push('/reguser/user/edit/' + id)
            },
            editProfileCS(id) {
                
            },
            editProfileRU(id) {
                
            },
        }
    }
</script>

<style scoped lang="scss">
	@import '@/styles/theme.scss';
	@import '@/styles/table.scss';


</style>