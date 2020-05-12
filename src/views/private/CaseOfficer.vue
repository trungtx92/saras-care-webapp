<template>

    <div id="dashboard" class="private m80b">

        <Header componentTitle="Header"/>

        <section class="loadcontent">
            <div class="container-fluid">
                <div class="row m50t">
                    <AssignedCases componentTitle="List of Assigned Cases"/>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
    import Header from "@/components/private/caseofficer/Header.vue";
    import AssignedCases from "@/components/private/caseofficer/AssignedCases.vue";

    export default {
        name: 'Case Officer Dashboard',
        components: {
            Header,
            AssignedCases
        },
        mounted() {
            if (!this.$parent.checkLoggedIn()) {
				this.$router.push('/404')
			}
            else {
                console.log('CS Dashboard mounted.')
                console.log('Parent calling ' + this.$route.name)
            }
        
        },
        data() {
            return {
                authenticated: false,
            }
        },
        methods: {
            setAuthenticated(status) {
                this.authenticated = status;
            },
            logout() {
                this.authenticated = false;
            },
        }
    }
</script>

<style lang="scss">
    @import '@/styles/theme.scss';
</style>