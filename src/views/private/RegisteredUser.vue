<template>

    <div id="dashboard" class="private m80b">

        <Header componentTitle="Header"/>

        <section class="loadcontent">
            <div class="container-fluid">
                <div class="row m50t">
                    <section class="has-table col-12">
                        <div class="row justify-content-between align-items-center m25b">
                            <p class="col-12 col-md-6 title m25b">Your Reported Case</p>
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
                                    defaultSortBy: {field: 'id', type: 'desc'}
                                }"
                                
                                :pagination-options="{
                                    enabled: true,
                                    perPage: 10,
                                }">
                                <template slot="table-row" slot-scope="props">
                                    <span v-if="props.column.field == 'offenseStatus && offenseStatus.description'">
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
                                   
                                    <span v-else>
                                        {{props.formattedRow[props.column.field]}}
                                     </span>
                                </template>
                                </vue-good-table>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
    import Header from "@/components/private/registereduser/Header.vue";
    import OffenseApi from '@/services/OffenseApi'

    export default {
        name: 'RegisteredUser',
        components: {
            Header
        },
        mounted() {
            var AuthStr = "Bearer " + this.$parent.mainJWT.data.token;
            var config = {headers: {'Authorization': AuthStr }};
            OffenseApi.fetchAll(config).then(response => {
                this.data = response;
                this.tuneData();
            })
            .catch(error => {
                console.log(error)
            })
        },
        data() {
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
            return {
                data,
                filteredData:[],
                columns: [
                    {
                        label: 'ID',
                        field: 'id',
                        type: 'number',
                        sortable: true,
                    },
                    {
                        label: 'Offense Status',
                        field: 'offenseStatus.description',
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
                        field: this.accusedFieldFn
                    },
                    {
                        label: 'Location',
                        field: 'location',
                    },
                ],
                rows: [],
            }
        },
        methods: {
            accusedFieldFn(rowObj) {
                for (var y in rowObj.offenseContacts) {
                    if (rowObj.offenseContacts[y].contactType && rowObj.offenseContacts[y].contactType.description === 'Offender') 
                    {
                        return rowObj.offenseContacts[y].contact.name;
                    }
                }
            },
            logout() {
                this.authenticated = false;
            },
            tuneData() {
                let query = this.$parent.loggedin.name.toString().toLowerCase();
                let data = []

                console.log(query);

                for (var x in this.data) {

                    // search for EACH offense contacts
                    if(this.data[x].offenseContacts != null)
                    {
                        for (var y in this.data[x].offenseContacts)
                        {
                            if (this.data[x].offenseContacts[y] && this.data[x].offenseContacts[y].contact &&
                            this.data[x].offenseContacts[y].contact.name &&
                             this.data[x].offenseContacts[y].contact.name.toString().toLowerCase() === query) 
                            {
                                data.push(this.data[x]);
                                break;
                            }
                        }
                    }   
                }
                this.data = data;
            },
        }
    }
</script>

<style scoped lang="scss">
    @import '@/styles/theme.scss';
    @import '@/styles/table.scss';

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