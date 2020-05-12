import axios from 'axios'

export default () => {
  	return axios.create({
    	baseURL: axios.defaults.baseURL,
	    headers: {
	    //   'Authorization': `Bearer ${localStorage.getItem('user-token')}`
	    	'Authorization': "Bearer " + this.$parent.mainJWT.data.token
	    }
  	})
}
