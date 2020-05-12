<template>
    <section class="has-table col-12">
        <div class="row justify-content-between align-items-center m25b">
           <p class="title col-12 col-sm-3">{{ componentTitle }} | {{ filter.length }} Records</p>
            <b-field class="col-auto col-sm-4 col-lg-4 m0b" style="margin-bottom: 0px">
            <b-select placeholder="Filter" icon="filter" v-model="filterType" :options="options" @input="pick">
              <option value="initialDate">Offense Date</option>
              <option value="offenseType">Offense Type</option>
              <option value="location">Location</option>
            </b-select>
                <b-input 
                    v-model="searchQuery"
                    placeholder="Search.."
                    icon="search"
                    :disabled="filterType === null"
                    expanded/>
            </b-field>
           <!-- {{test(searchQuery)}} -->
  

    <!-- Modal -->
        <b-modal :active.sync="isCardModalActive"  has-modal-card full-screen :can-cancel="false">
          <div class="modal-card" style="width: auto; height: auto">
              <header class="modal-card-head">
              <p class="modal-card-title">Assign Cases</p>
              </header>
               <section class="modal-card-body">
                <b-notification 
                type="is-success"
                :active.sync="isActive" aria-close-label="Close notification">
                Case Assigned Successfully
                </b-notification> 
              <b-field> 
                <b-table
                    :data="assignData"
                    :current-page.sync="currentPage"
                    :paginated="true"
                    :per-page="6"
                    :pagination-simple="false"
                    :default-sort-direction="defaultSortDirection"
                    :loading="loading"
                    checkable
                    :checked-rows.sync="checkedRowsStaff"
                    default-sort="id"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page">

                    
              <template slot-scope="props">         

                       <b-table-column field="id" label="ID" width="40" sortable numeric>
                            {{ props.row.id }}
                        </b-table-column>

                    
                        <b-table-column field="organization" label="Organization Name" sortable>
                            <ul>
                                <li>
                                    {{props.row.username}}
                                </li>
                            </ul>
                        </b-table-column>
         
            </template>
            </b-table>
              </b-field>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-danger" type="button" @click="reset">Close</button>
              <button :disabled="checkAssign" class="button is-success" type="button" @click="assignCase">Assign</button>
            </footer>
          </div>
        </b-modal>

        <!-- <div class="col-auto col-lg-2 col-sm-1">
                <button type="button" class="btn solid secondary" @click="exportJson">
                    <i class="fas fa-file"></i> <span class="m15l d-none d-sm-inline">Export to JSON</span>
                </button>
        </div>

        <div class="col-auto col-lg-2 col-sm-1">
                <button :disabled="check" class="btn solid secondary" @click="isCardModalActive = true">
                    <i class="fa fa-list"></i><span class="m15l d-none d-sm-inline">Assign</span>
                </button>
            </div> -->

            <b-field grouped group-multiline id="multiline">

                  <download-excel :fetch="fetchData" 
                    :fields="json_fields"  
                    :before-generate="startDownload"
                    :before-finish="finishDownload" 
                    :data="json_data"  
                    name="sarascare-latest.csv" 
                    type="csv">
       <div class="col-lg-4 text-right">
                <button type="button" id="csv" class="button field is-danger">
                    <span v-if="showCsvLoading" class="spinner-border spinner-border-sm-inline" role="status" aria-hidden="true"></span>Export to CSV</span>
                </button>
        </div>
    </download-excel>
            <button type="button" id="exjson" class="button field is-danger" @click="exportJson">
                <i class="fas fa-file"></i> <span class="m15l d-none d-sm-inline">Export to JSON</span>
            </button>
            <button :disabled="check" id="assign" class="button field is-danger" @click="isCardModalActive = true">
                    <i class="fa fa-list"></i><span class="m15l d-none d-sm-inline">Third Party Assign</span>
                </button>
        </b-field>
        </div>
        <div class="row justify-content-between align-items-center">
            <div class="col-12">
                <div v-if="errored">
                    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
                </div>

                <b-table
                    :data="filter"
                    :paginated="true"
                    :per-page="6"
                    :current-page.sync="currentPage"
                    :pagination-simple="false"
                    :default-sort-direction="defaultSortDirection"
                    :loading="loading"
                    checkable
                    :checked-rows.sync="checkedRowsCases"
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
                
                        <b-table-column field="offenseDate" label="Offense Date" sortable centered>
                            {{  new Date(props.row.offenseDate).toLocaleDateString() }}
                        </b-table-column>

                        <b-table-column field="offenseType" label="Offense Type" sortable>
                            {{ props.row.offenseType.description }}
                        </b-table-column>

                        <b-table-column field="accused" label="Accused" sortable>
                            <ul>
                                <li v-for="v in props.row.offenseContacts" 
                                    v-if="v.contactType.description == 'Offender'">{{ v.contact.name }}
                                </li>
                            </ul>
                        </b-table-column>

                        <b-table-column field="victim" label="Victim" sortable>
                           <ul>
                                <li v-for="v in props.row.offenseContacts" 
                                    v-if="v.contactType.description == 'Victim'">{{ v.contact.name }}
                                </li>
                            </ul>
                        </b-table-column>

                        <b-table-column field="witness" label="Witness" sortable>
                           <ul>
                                <li v-for="v in props.row.offenseContacts" 
                                    v-if="v.contactType.description == 'Witness'">{{ v.contact.name }}
                                </li>
                            </ul>
                        </b-table-column>

                        <b-table-column field="location" label="Location" sortable>
                            {{ props.row.location }}
                        </b-table-column>

                        <b-table-column field="notes" label="Notes">
                            <i v-if="props.row.notes !== null" class="fas fa-comment active m15r"></i>
                            <i v-else class="fas fa-comment m15r"></i>
                            <i v-if="props.row.evidence > 0" class="fas fa-file active"></i>
                            <i v-else class="fas fa-file"></i>
                        </b-table-column>

                        <b-table-column field="view" label="View">
                            <button class="viewonly" @click="viewCase(props.row.id)">
                                <i class="fas fa-eye"></i>
                            </button>
                        </b-table-column>
                    </template>
                </b-table>
            </div>
        </div>

    </section>
</template>

<script>
    import OffenseApi from '@/services/OffenseApi'
    export default {
        name: 'LatestCases',
        props: {
            componentTitle: String
        },
        mounted() {
            this.loading = true
            var AuthStr = "Bearer " + this.$parent.$parent.mainJWT.data.token;
            var config = {headers: {'Authorization': AuthStr }};
            OffenseApi.fetchAll(config).then(response => {
                this.data = response
                this.$parent.inboxcount = response.length
                this.loading = false
            })
            .catch(error => {
                console.log(error)
            });

            axios.get('exportoffenses', config)
                .then((response) => {
                    this.json_file_data = response.data;
                }).catch(error => {
                console.log(error);
            })

             // fetch all third party/cases reported
     
            OffenseApi.fetchThirdParty(config).then(response => {
                this.assignData = response
            }).catch(error => {
                console.log(error)
            })

        },      
        data: function() {
            const data = [
                { 
                    id: '', 
                    offenseDate: '',
                    offenseType: '', 
                    victim: '', 
                    witness: '', 
                    accused: '', 
                    location: ''         
                }
            ]

            const assignData =[
                {
                        id: '', 
                        username: '',
                        roles: ''
                }
            ]

            return {
                data,
                assignData,
                checkedRowsCases:[],
                checkedRowsStaff:[],
                isCardModalActive: false,
                isActive: false,
                defaultSortDirection: 'asc',
                currentPage: 1,
                loading: false,
                errored: false,
                searchQuery: '',
                filterType: null,
                options: [
                 { value: "offenseDate", text: 'Enabled' },
                 { value: "offenseType", text: 'Enabled' },
                 { value: "location", text: 'Enabled' },
                 { value: null, text: 'Disabled' }
                         ],
                json_data:[],
                json_file_data:[],
                showCsvLoading: false,
                json_fields: {
            'ID':'id',
            'Offense name': 'offenseDate',
            'Offense Type': 'offenseType.description',
            'Victim' : {
            field: 'Victims',
            callback: (value) => {
                return value[0] && value[0].name ?value[0].name : "" ;
                }
            },
            'Witness': {
            field: 'Witness',
            callback: (value) => {
                return value[0] && value[0].name ?value[0].name : "" ;
                }
            },
            'Accused Location': 'location',
            'Notes': 'notes',
            }
        }
    },
        computed: {
            filter: function(){
                if(this.searchQuery){
                    var lowercaseSearch = this.searchQuery.toString().toLowerCase()
                    return this.search(lowercaseSearch,this.filterType)
                }
                    return this.data       
             },
             check: function(){
                   
                    return this.checkedRowsCases.length == 0
                   
             },

             checkAssign: function(){
                   
                    return this.checkedRowsStaff.length == 0
             }

        },
        
        methods: {
            search(searchQuery,searchType){
                let foundData = []
                // if (searchType == "id"){
                //     this.data.forEach(function(t){
                //         var offense = t.id;
                //         if(offense == parseInt(searchQuery)){
                //             foundData.push(t)
                //         }  
                // })
                // }else 
                if(searchType == "initialDate"){
                      this.data.forEach(function(t){
                        var offense = t.offenseDate
                        if(offense){
                            if(offense.match(searchQuery)){
                                foundData.push(t)
                            }  
                        }
                    })
                }
                else if(searchType == "location"){
                        this.data.forEach(function(t){
                        var offense = t.location.toLowerCase()
                        if(offense.match(searchQuery)){
                            foundData.push(t)
                        }  
                    })
                }
                else if(searchType == "offenseType"){
                    this.data.forEach(function(t){
                        var offense = t.offenseType.description.toLowerCase()
                        if(offense.match(searchQuery)){
                            foundData.push(t)
                        }  
                    })
                }
                return foundData
            },
            pick(){
                this.searchQuery = '';
            },
             test(message){
                console.log(message);
            },

            assignCase()
            {   
                let offenseIDs = [];
                this.checkedRowsCases.forEach(function(offense){
                         offenseIDs.push(offense.id)
                })
                
                let staffIDs = [];
                this.checkedRowsStaff.forEach(function(staff){
                          staffIDs.push(staff.id);
                })
                         var AuthStr = "Bearer " + this.$parent.$parent.mainJWT.data.token;
				var config = {headers: {'Authorization': AuthStr }};
				return axios.post('create-access',{
                    offenseIDs: offenseIDs,
                    StaffIDs: staffIDs,
                }, config)
                .then((response) => {
                   this.isActive = true;
                })
                
            },
            reset()
            {
                this.isCardModalActive = false;
                this.checkedRowsCases = [];
                this.checkedRowsStaff = [];
                this.isActive = false;
            },
            viewCase(id) {
              this.$router.push('/admin/case/' + id)
            },async fetchData(){
                var AuthStr = "Bearer " + this.$parent.$parent.mainJWT.data.token;
                var config = {headers: {'Authorization': AuthStr }};
                if(this.filterType == null && this.searchQuery == '') {
                    const response = await axios.get('exportoffenses?',config);
                    return response.data;
                }

                else  {
                    
                
                var params = new URLSearchParams();
                params.append(this.filterType.toString(), this.searchQuery.toString());
                
                var request = {
                    params: params
                 }
                 
                 const response = await axios.get('exportoffenses?'+ params,config);
                 return response.data;
                }
            },
            exportJson: function () {
                var jsonFile;
                var downloadLink;

                const data = JSON.stringify(this.json_file_data)
                // CSV FILE
                jsonFile = new Blob([data], {type: "'text/plain'"});

                // Download link
                downloadLink = document.createElement("a");

                // File name
                downloadLink.download = "sarascare-latest.json";

                // We have to create a link to the file
                downloadLink.href = window.URL.createObjectURL(jsonFile);

                // Make sure that the link is not displayed
                downloadLink.style.display = "none";

                // Add the link to your DOM
                document.body.appendChild(downloadLink);
                downloadLink.click();
            },
            startDownload(){
                this.showCsvLoading = true;
            },
            finishDownload(){       
                this.showCsvLoading = false;
            },getObjects(data){
                console.log(data);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '@/styles/table.scss';

    #csv{
        background-color:#361FA9;
        height:40px;
        
        
    }
    
    #exjson{
         background-color:#361FA9;
          height:40px;
    }

    #assign{
         background-color:#361FA9;
          height:40px;
    }

    #multiline{
        padding-left:-15px;
        padding-right:15px;
    }
</style>