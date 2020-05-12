<template>
    <section class="has-table col-12">
        <div class="row justify-content-between align-items-center m25b">
            <p class="title col-12 col-lg-4">{{ componentTitle }} | {{ filter.length }} Records</p>
            <b-field class="col-auto col-sm-6 col-lg-4 m0b">
                <b-input 
                    v-model="searchQuery" 
                    placeholder="Search.."
                    icon="search"
                    />
            </b-field>
            <div class="col-auto col-lg-4 text-right">
                <button type="button" class="btn solid secondary m15r" @click="downloadCSV()">
                    <i class="fas fa-file-csv"></i> <span class="m15l d-none d-md-inline">Export to CSV</span>
                </button>

                <button @click="addUser()" class="btn solid primary">
                    <i class="fas fa-user-plus"></i> <span class="m15l d-none d-md-inline">Add User</span>
                </button>
            </div>
        </div>
        
        <div class="row justify-content-between align-items-center">
             <div v-if="errored" class="col-12">
                <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
            </div>

            <b-table
                class="col-12"
                v-else
                :data="filter"
                :paginated="true"
                :per-page="15"
                :current-page.sync="currentPage"
                :pagination-simple="false"
                :default-sort-direction="defaultSortDirection"
                :loading="loading"
                default-sort="id"
                aria-next-label="Next page"
                aria-previous-label="Previous page"
                aria-page-label="Page"
                aria-current-label="Current page">

                <div v-if="loading">Loading...</div>

                <template slot-scope="props">
                    <b-table-column field="id" label="ID" width="40" sortable numeric>
                        {{ props.row.id }}
                    </b-table-column>

                    <b-table-column field="userstatus" label="Status" sortable>
                        <span v-if="props.row.isActive == true" class="tag is-secondary">
                            Active
                        </span>
                        <span v-if="props.row.isActive == false" class="tag is-danger">
                            Inactive
                        </span>
                        <span  v-if="props.row.userAccount && checkRegUser(props.row.userAccount.roles)" class="tag is-success">
                            Registered
                        </span>
                    </b-table-column>

                    <b-table-column field="username" label="Name" sortable>
                        {{ props.row.name }}
                    </b-table-column>

                    <b-table-column field="userphone" label="Email" sortable>
                        {{ props.row.email }}
                    </b-table-column>

                    <b-table-column field="userphone" label="Phone" sortable>
                        {{ props.row.phoneNumber }}
                    </b-table-column>

                    <b-table-column field="dateOfBirth" label="DOB" sortable>
                        {{  new Date(props.row.dateOfBirth).toLocaleDateString() }}
                    </b-table-column>

                    <b-table-column field="userrole" label="Role" sortable>
                       <span v-if="props.row.userAccount">
                       <span v-if="checkAdmin(props.row.userAccount.roles)">Admin</span>
                       <span v-if="checkCaseOfficer(props.row.userAccount.roles)">Case Officer</span>
                       <span p v-if="checkRegUser(props.row.userAccount.roles)">Registered</span>
                       </span>
                    </b-table-column>

                    <b-table-column field="actions" label="Actions" sortable>
                        <button class="viewonly" @click="viewUser(props.row.id)">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="viewonly" @click="editUser(props.row.id)">
                            <i class="fas fa-edit"></i>
                        </button>
                    </b-table-column>
                </template>
            </b-table>
        </div>
    </section>
</template>

<script>
    import UsersApi from '@/services/UsersApi'
    export default {
        name: 'AllUsers',
        props: {
            componentTitle: String
        },
        mounted() {
            this.loading = true
            var AuthStr = "Bearer " + this.$parent.$parent.mainJWT.data.token;
            var config = {headers: {'Authorization': AuthStr }};
            UsersApi.fetchAll(config).then(response => {
                this.data = response
                this.$parent.userscount = response.length
                this.loading = false
            })
            .catch(error => {
                console.log(error)
            })
        }, 
        data: function() {
            const data = [
                { 
                    id: '', 
                    userstatus: '',
                    username: '',
                    userphone: '',
                    userrole: ''
                }
            ]
            return {
                data,
                data,
                defaultSortDirection: 'asc',
                currentPage: 1,
                loading: true,
                errored: false,
                searchQuery: '',
            }
        },
        computed: {
            filter: function(){
                let query = this.searchQuery.toString().toLowerCase();
                let data = []

                if(query == '')
                    return this.data
                
                for (var x in this.data) {

                    // search for location
                    if(this.data[x].name != null)
                    {
                        if (this.data[x].name.toString().toLowerCase().match(query)) 
                        {
                            data.push(this.data[x])
                            break
                        }
                    }   

                    // search for email
                    if(this.data[x].email != null)
                    {
                       
                        if (this.data[x].email.toString().toLowerCase().match(query)) 
                        {
                            data.push(this.data[x])
                            break
                        }
                        
                    }   

                    // search for phone
                    if(this.data[x].phoneNumber != null)
                    {
                       
                        if (this.data[x].phoneNumber.toString().toLowerCase().match(query)) 
                        {
                            data.push(this.data[x])
                            break
                        }
                        
                    }   
                }
                return data
            }
        },
        
        methods: {
            checkAdmin(a) {
                if (a.includes("ROLE_ADMIN"))
                    return true;
            },

            checkCaseOfficer(a) {
                if (a.includes("ROLE_CASE_OFFICER"))
                    return true;
            },

            checkRegUser(a) {
                if (a.includes("ROLE_REGISTERED_USER"))
                    return true;
            },

            addUser() {
                this.$router.push('/admin/users/add/')
            },
            viewUser(id) {
                this.$router.push('/admin/user/' + id)
            },
            editUser(id) {
                this.$router.push('/admin/user/' + id)
            },

            exportCSV: function (csv, filename) {
                var csvFile;
                var downloadLink;

                // CSV FILE
                csvFile = new Blob([csv], {type: "text/csv"});

                // Download link
                downloadLink = document.createElement("a");

                // File name
                downloadLink.download = filename;

                // We have to create a link to the file
                downloadLink.href = window.URL.createObjectURL(csvFile);

                // Make sure that the link is not displayed
                downloadLink.style.display = "none";

                // Add the link to your DOM
                document.body.appendChild(downloadLink);

                // Lanzamos
                downloadLink.click();
            },

            exportTableToCSV: function(html, filename) {
                var csv = [];
                var rows = document.querySelectorAll("table tr");
                
                for (var i = 0; i < rows.length; i++) {
                    var row = [], cols = rows[i].querySelectorAll("td, th");
                    for (var j = 0; j < cols.length; j++) 
                        row.push(cols[j].innerText);
                    csv.push(row.join(","));        
                }
                // Download CSV
                this.exportCSV(csv.join("\n"), filename);
            },

            downloadCSV() {
                var html = document.querySelector("table").outerHTML;
                this.exportTableToCSV(html, "sarascare-users.csv");
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '@/styles/table.scss';
</style>