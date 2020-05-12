<template>

    <div id="dashboard" class="private m80b">

        <Header componentTitle="Header"/>

        <section class="loadcontent">
            <div class="container-fluid">
                <div id="boxoffour" class="row justify-content-between" v-if="$route.name == 'admin-dash'">
                    <div class="each col-12 col-md-4">
                        <div class="row h-100 justify-content-between">
                            <div class="left col-7 align-self-center">
                                Inbox
                            </div>
                            <div class="right col-4 align-self-center">
                                {{ inboxcount }}
                            </div>
                        </div>
                    </div>
                    <div class="each col-12 col-md-4">
                        <div class="row h-100 justify-content-between">
                            <div class="left col-7 align-self-center">
                                Issued Cases
                            </div>
                            <div class="right col-4 align-self-center">
                                {{ issuedcount }}
                            </div>
                        </div>
                    </div>
                    <div class="each col-12 col-md-4">
                        <div class="row h-100 justify-content-between">
                            <div class="left col-7 align-self-center">
                                Users
                            </div>
                            <div class="right col-4 align-self-center">
                                {{ userscount }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row m50t">
                    <LatestCases v-if="$route.name == 'admin-dash'" componentTitle="Latest in the Inbox"/>
                    <AllInbox v-if="$route.name == 'admin-inbox'" componentTitle="All in the inbox"/>
                    <AllCases v-if="$route.name == 'admin-cases'" componentTitle="List of Cases"/>
                    <AllUsers v-if="$route.name == 'admin-users'" componentTitle="List of Users"/>
                    <AddUser v-if="$route.name == 'admin-user-add'" componentTitle="Add User"/>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
    import Header from "@/components/private/admin/Header.vue";
    import LatestCases from "@/components/private/admin/LatestCases.vue";
    import AllInbox from "@/components/private/admin/AllInbox.vue";
    import AllCases from "@/components/private/admin/AllCases.vue";
    import AllUsers from "@/components/private/admin/AllUsers.vue";
    import AddUser from "@/components/private/admin/AddUser.vue";
    // import Latest from "@/components/private/admin/Latest.vue";

    export default {
        name: 'admin-dash',
        components: {
            Header,
            LatestCases,
            AllInbox,
            AllCases,
            AllUsers,
            AddUser
        },
        mounted() {
        
          if (!this.$parent.checkLoggedIn()) {
				this.$router.push('/404')
			}
            else {
                console.log('Dashboard mounted.')
                console.log('Parent calling ' + this.$route.name)
                this.getContacts()
                this.getCases()
            }
            
        },
        data() {
            return {
                authenticated: false,
                inboxcount: 0,
                issuedcount: 0,
                userscount: 0,
                data: 0,
            }
        },
        methods: {
            setAuthenticated(status) {
                this.authenticated = status;
            },
            logout() {
                this.authenticated = false;
            },
            getCases(){
                var AuthStr = "Bearer " + this.$parent.mainJWT.data.token;
                var config = {headers: {'Authorization': AuthStr }};
                this.url = 'offenses';
                axios.get(this.url, config)
                .then((response) => {
                    this.data = response.data
                    this.tuneData()
                })
            },
            getContacts(){
                var AuthStr = "Bearer " + this.$parent.mainJWT.data.token;
                var config = {headers: {'Authorization': AuthStr }};
                this.url = 'contacts';
                axios.get(this.url, config)
                .then((response) => {
                    this.userscount = response.data.length
                })
            },
            tuneData() {
                let caseOfficer = "caseOfficer"
                let data = []
                for (var x in this.data) {
                    if(this.data[x].caseOfficer !== null) {
                        data.push(this.data[x])
                    }     
                }
                this.data = data
                this.issuedcount = data.length
            },
        }
    }
</script>

<style scoped lang="scss">
@import '@/styles/theme.scss';

    #boxoffour {
        .each {
            background-color: $white; color: $secondary;
            border: 1px solid rgba($secondary, .3);
            height: 120px;
            -webkit-box-flex: 0;
            -ms-flex: 0 0 32%;
            flex: 0 0 32%;
            max-width: 32%;
            border-radius: $bradius;

            @include bp-md {
                -ms-flex: 0 0 50%;
                flex: 0 0 50%;
                max-width: 50%;
            }

            @include bp-sm {
                -ms-flex: 0 0 32%;
                flex: 0 0 32%;
                max-width: 32%;
            }

            .left { font-size: 18px; line-height: normal; }
            .right { 
                font-size: 35px; font-weight: bold; 
                text-align: right;
            }
        }
    }
</style>