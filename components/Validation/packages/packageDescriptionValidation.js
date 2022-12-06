
const packageDescriptionValidation = (data,max_age) => {
    console.log(max_age)
    var error = {};
    if ((data?.package_name === '') || (data?.package_name === undefined)) {
        error.package_name = "Package name is required";
    }
    if ((data?.package_description === '') || (data?.package_description === undefined)) {
        error.package_description = "Package description is required";
    }
    if ((data?.charge_currency === '') || (data?.charge_currency === undefined)) {
        error.charge_currency = "Charge currency is required";
    }
    if ((data?.refundable === '') || (data?.refundable === undefined)) {
        error.refundable = "Refundable is required";
    }
    if (data?.refundable === 'true') {
        if ((data?.refundable_until_days === '') || (data?.refundable_until_days === undefined)) {
            error.refundable_until_days = "Refundable until days is required";
        }

        if ((data?.refundable_until_time === '') || (data?.refundable_until_time === undefined)) {
            error.refundable_until_time = "Refundable until time is required";
        }
    }

    if ((data?.max_number_of_intended_occupants === '') || (data?.max_number_of_intended_occupants === undefined)) {
        error.max_number_of_intended_occupants = "Max number of intended occupants is required";
    }

    if ((data?.max_number_of_intended_occupants === '') || (data?.max_number_of_intended_occupants === undefined)) {
        error.max_number_of_intended_occupants = "Max number of intended occupants is required";
    }

    if ((data?.max_number_of_adult_guest === '') || (data?.max_number_of_adult_guest === undefined)) {
        error.max_number_of_adult_guest = "Max number of adults is required";
    }

    if ((data?.check_in === '') || (data?.check_in === undefined)) {
        error.check_in = "Check in time is required";
    }

    if ((data?.check_out === '') || (data?.check_out === undefined)) {
        error.check_out = "Check out time is required";
    }

    if(data?.max_number_of_intended_occupants - data?.max_number_of_adult_guest !== max_age.length)
    {
        error.max_age = "Age of all children is required";
    }

    if(max_age.includes("Select"))
    {
        error.max_age="the value should be proper number";
    }

    console.log("error is \n"+JSON.stringify(error));
    return Object.keys(error).length === 0 ? true : error;
}

export default packageDescriptionValidation