<template>
	<section class="has-table col-12">
        <div class="row justify-content-between align-items-center m25b">
            <p class="col-12 col-md-6 title m25b">{{ componentTitle }}</p>
            <div class="col-auto col-md-6 text-right">
                <button type="button" class="btn solid secondary" @click="downloadCSV()">
                    <i class="fas fa-file-csv"></i> <span class="m15l d-none d-sm-inline">Export to CSV</span>
                </button>
            </div>
        </div>

        <div class="row justify-content-between align-items-center">
            <div class="col-12">
                <vue-good-table
                    styleClass="vgt-table"
                    :columns="columns"
                    :rows="data"
                    :search-options="{
                        enabled: true,
                        trigger: 'enter',
                        placeholder: 'To search, type a keyword and hit enter',
                    }"
                    :sort-options="{
                        enabled: true,
                        setInitialSort: {field: 'id', type: 'desc'}
                    }"
                    @on-row-click="onRowClick"
                    :pagination-options="{
                        enabled: true,
                        perPage: 10,
                    }">
                    <template slot="table-row" slot-scope="props">
                        
                        <span v-if="props.column.field == 'status'">
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
                        </span>

                        <span v-if="props.column.field == 'notes'">
                            <i v-if="props.row.notes !== null" class="fas fa-comment active m10r"></i>
                            <i v-else class="fas fa-comment m10r"></i>
                            <i v-if="props.row.evidence && props.row.evidence.length" class="fas fa-file active"></i>
                            <i v-else class="fas fa-file"></i>
                        </span>
                        <span v-else>
                            {{props.formattedRow[props.column.field]}}
                         </span>
                    </template>
                </vue-good-table>
            </div>
        </div>

        <!-- <div v-if="errored">
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
                    <i v-if="props.row.notes !== null" class="fas fa-comment"></i>
                    <i v-else class="fas fa-comment" style="opacity: .2;"></i>
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
          
	    </b-table> -->
	</section>
</template>

<script>
    export default {
        name: 'AllCases',
        props: {
            componentTitle: String
        },
        mounted() {
            var AuthStr = "Bearer " + this.$parent.$parent.mainJWT.data.token;
            var config = {headers: {'Authorization': AuthStr }};
            axios.get('offenses', config)
            .then((response) => {
                this.data = response.data
                this.tuneData()
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
                    id: '01010', 
                    offenseStatus: 'Pending',
                    offenseDate: '03/05/2019',
                    offenseType: 'Kidnapping', 
                    location: 'Hawaii',
                    caseOfficer: 'Melissa Tores'
                }
            ]
            return {
                data,

                columns: [
                    {
                        label: 'ID',
                        field: 'id',
                        type: 'number',
                        sortable: true,
                    },
                    {
                        label: 'Offense Status',
                        field: 'status',
                    },
                    {
                        label: 'Offense Type',
                        field: 'offenseType.description',
                    },
                    {
                        label: 'Offense Date',
                        field: 'offenseDate',
                        type: 'date',
                        dateInputFormat: 'YYYY-MM-DD',
                        dateOutputFormat: 'DD/MM/YY',
                    },
                    {
                        label: 'Accused',
                        field: this.accusedFieldFn,
                    },
                    {
                        label: 'Location',
                        field: 'location',
                    },
                    {
                        label: 'Notes',
                        field: 'notes',
                        html: true,
                    },
                ],
                rows: [],
            }
        },
        
        methods: {
            accusedFieldFn(rowObj) {
                for (var y in rowObj.offenseContacts) {
                    if (rowObj.offenseContacts[y].contactType.description === 'Offender') 
                    {
                        return rowObj.offenseContacts[y].contact.name
                        break
                    }
                }
            },
            onRowClick(params) {
                this.$router.push('/caseofficer/case/' + params.row.id)
            },
            tuneData() {
                // let caseOfficer = "caseOfficer"
                let data = []
                for (var x in this.data) {
                    if(this.data[x].caseOfficer !== null) {
                        if (this.data[x].caseOfficer.name === this.$parent.$parent.loggedin.name) {
                            data.push(this.data[x])
                        }
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
                    
                    for (var j = 0; j < cols.length; j++) 
                        row.push(cols[j].innerText);
                    
                    csv.push(row.join(","));        
                }

                // Download CSV
                this.exportCSV(csv.join("\n"), filename);
            },

            downloadCSV() {
                var html = document.querySelector("table").outerHTML;
                this.exportTableToCSV(html, "sarascare-assigned.csv");
            }
        }
    }
</script>
<style scoped lang="scss">
    @import '@/styles/table.scss';
</style>
