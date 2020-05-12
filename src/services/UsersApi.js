import DefaultApi from './DefaultApi'

export default {

    fetchAll(config){
        return axios.get('contacts/', config)
            .then(response => {
                return response.data
        })
    },

    fetchSingle (id, config) {
        return axios.get('contacts/' + id, config)
            .then(response => {
                return response.data
        })
    },

    fetchCOfficers (config) {
        return axios.get('staff/', config)
            .then(response => {
                return response.data
        })
    },

    updateContact(id, config) {
        return axios.patch('/contacts/' + id, config)
            .then(response => {
                return response.data
            })
    }
}