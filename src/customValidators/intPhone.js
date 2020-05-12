export default phone => {
	var re = /^\+(?:[0-9] ?){6,14}[0-9]$/;

	if(re.test(phone)) {
        return true;
	}
    return false;
};