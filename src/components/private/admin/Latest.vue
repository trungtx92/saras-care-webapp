<template>
    <section>
        <b-table
            :data="data"
            :columns="columns"
            :paginated="true"
            :per-page="6"
            :current-page.sync="currentPage"
            :pagination-simple="false"
            :default-sort-direction="defaultSortDirection"
            default-sort="id"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
            searchable>
        </b-table>
    </section>
</template>

<script>
    export default {
        name: 'Latest',
        props: {
            componentTitle: String
        },
        mounted() {
            var AuthStr = "Bearer " + this.$parent.$parent.mainJWT.data.token;
            var config = {headers: {'Authorization': AuthStr }};
            axios.get('offenses', config)
            .then((response) => {
                this.data = response.data
            })
            .catch(error => {
                console.log(error)
                this.errored = true
            })
            .finally(() => this.loading = false)
        },  
        data: function() {
            const data = [
                { id: 'a', name: 'b' }
            ]
            return {
                data,
                columns: [
                    {
                        field: 'id',
                        label: 'ID',
                        width: '100',
                        numeric: true,
                        searchable: true,
                    },
                    {
                        field: 'offenseDate',
                        label: 'offenseDate',
                        searchable: true,
                    },
                    {
                        field: 'offenseType.description',
                        label: 'Offense Type',
                        searchable: true,
                    },
                    {
                        field: 'contacts.type',
                        label: 'Victim',
                        centered: true
                    },
                    {
                        field: 'location',
                        label: 'Location',
                    }
                ]
            }
        }
    }
</script>