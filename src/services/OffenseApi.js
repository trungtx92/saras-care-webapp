import DefaultApi from './DefaultApi'

export default {

    // fetch all offenses/cases reported
    fetchAll(config) {
        return axios.get('/offenses',config)
            .then(response => {
                return response.data
        })
    },

    // fetch a single offense/case reported based on ID
    fetchSingle(id,config) {
        return axios.get('/offenses/' + id,config)
            .then(response => {
                return response.data
        })
    },

    //fetch all third party oganisations
    fetchThirdParty(config) {
                return axios.get('/third-party-user-accounts',config)
                .then(response => {
                    return response.data
                }).catch(error => {
                    console.log(error);
                })
            },        

    // fetch all offense statuses
    fetchStatuses(config) {
        return axios.get('/offense-statuses/',config)
            .then(response => {
                return response.data
        })
    }
}