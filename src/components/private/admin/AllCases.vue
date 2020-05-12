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
                <button type="button" class="btn solid secondary" @click="downloadCSV()">
                    <i class="fas fa-file-csv"></i> <span class="m15l d-none d-sm-inline">Export to CSV</span>
                </button>
            </div>
        </div>

        <div v-if="errored">
            <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
        </div>

	    <b-table
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

                <b-table-column field="offenseStatus" label="Status" sortable centered>
                    
                    <span v-if="props.row.offenseStatus.description === 'New'" class="tag is-dark">
                        {{ props.row.offenseStatus.description }}
                    </span>
                    <span v-if="props.row.offenseStatus.description === 'In Progress'" class="tag is-primary">
                        {{ props.row.offenseStatus.description }}
                    </span>
                    <span v-if="props.row.offenseStatus.description === 'Pending'" class="tag is-info">
                        {{ props.row.offenseStatus.description }}
                    </span>
                    <span v-if="props.row.offenseStatus.description === 'Cancelled'" class="tag">
                        {{ props.row.offenseStatus.description }}
                    </span>
                    <span v-if="props.row.offenseStatus.description === 'Closed'" class="tag is-success">
                        {{ props.row.offenseStatus.description }}
                    </span>
                </b-table-column>

	            <b-table-column field="offenseDate" label="Offense Date" sortable centered>
                <span class="tag">
                    {{  new Date(props.row.offenseDate).toLocaleDateString() }}
                </span>
	            </b-table-column>

	            <b-table-column field="offenseType" label="Offense Type" sortable>
                    {{ props.row.offenseType.description }}
	            </b-table-column>

                <b-table-column field="location" label="Location" sortable>
                    {{ props.row.location }}
                </b-table-column>

                <b-table-column field="caseOfficer" label="Case Officer" sortable>
                    <p v-if="props.row.caseOfficer">{{ props.row.caseOfficer.name }}</p>
                </b-table-column>

                <b-table-column field="file" label="Notes" sortable>
                    <i v-if="props.row.notes !== null" class="fas fa-comment active m15r"></i>
                    <i v-else class="fas fa-comment m15r"></i>
                    <i v-if="props.row.evidence && props.row.evidence.length > 0" class="fas fa-file active"></i>
                    <i v-else class="fas fa-file"></i>
                </b-table-column>

                <b-table-column field="actions" label="Actions">
                    <button class="viewonly" @click="viewCase(props.row.id)">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="viewonly" @click="editCase(props.row.id)">
                        <i class="fas fa-edit"></i>
                    </button>
                </b-table-column>
	        </template>
          
	    </b-table>
	</section>
</template>

<script>
    export default {
        name: 'AllCases',
        props: {
            componentTitle: String
        },
        mounted() {
            this.loading = true
            var AuthStr = "Bearer " + this.$parent.$parent.mainJWT.data.token;
            var config = {headers: {'Authorization': AuthStr }};
            axios.get('offenses', config)
            .then((response) => {
                this.data = response.data
                this.tuneData()
                this.loading = false
            })
            .catch(error => {
                console.log(error)
                this.errored = true
            })
            .finally(() => this.loading = false)
        },      
       
        data: function() {
            const data = [
                { 
                    id: '', 
                    offenseStatus: '',
                    offenseDate: '',
                    offenseType: '', 
                    location: '',
                    caseOfficer: ''
                }
            ]
            return {
                data,
                defaultSortDirection: 'desc',
                currentPage: 1,
                loading: true,
                errored: false,
                searchQuery: ''
            }
        },
        computed: {
            filter: function(){
                let query = this.searchQuery.toString().toLowerCase();
                let data = []

                if (query == '')
                    return this.data
                
                for (var x in this.data) {

                    // search for EACH offense contacts
                    if(this.data[x].offenseContacts != null)
                    {
                        for (var y in this.data[x].offenseContacts)
                        {
                            if (this.data[x].offenseContacts[y].contact.name.toString().toLowerCase().match(query)) 
                            {
                                data.push(this.data[x])
                                break
                            }
                        }
                    }  

                    // search for location
                    if(this.data[x].location != null)
                    {
                        if (this.data[x].location.toString().toLowerCase().match(query)) 
                        {
                            data.push(this.data[x])
                            break
                        }
                    }

                    // search for offense types
                    if(this.data[x].offenseType != null)
                    {
                        if (this.data[x].offenseType.description.toString().toLowerCase().match(query)) 
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
            viewCase(id) {
                this.$router.push('/admin/case/' + id)
            },
            editCase(id) {
                this.$router.push('/admin/case/edit/' + id)
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
                this.$parent.issuedcount = data.length
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
                    
                    for (var j = 0; j < cols.length - 2; j++) 
                        row.push(cols[j].innerText);
                    
                    csv.push(row.join(","));        
                }

                // Download CSV
                this.exportCSV(csv.join("\n"), filename);
            },

            downloadCSV() {
                var html = document.querySelector("table").outerHTML;
                this.exportTableToCSV(html, "sarascare-cases.csv");
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '@/styles/table.scss';
</style>
