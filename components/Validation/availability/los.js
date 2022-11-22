const validateLOS = (all_data) => {
  var error = [];
  for (let count = 0; count < all_data.length; count++) {
    error.push({})
  }

  var flag = []
  var final_flag = true;
  all_data.map((data, index) => {
    if (data?.min_max_msg === "" || data?.min_max_msg === undefined) {
      flag.push(false)
      error[index].min_max_msg = "The min max message is required."
    }
    if (data?.time === "" || data?.time === undefined) {
      flag.push(false)
      error[index].time = "The number of days is required."
    }
    if (data?.time < 0) {
      flag.push(false)
      error[index].time = "The number of days must be positive."
    }
    if (data?.min_max_msg === "FullPatternLOS" && (data?.fixed_pattern === "" || data?.fixed_pattern === undefined)) {
      flag.push(false)
      error[index].fixed_pattern = "The fixed pattern field is required."
    }

    if (data?.min_max_msg === "FullPatternLOS" && (data?.fixed_pattern != "" && data?.fixed_pattern != undefined)) {
      if (data?.fixed_pattern.length != data?.time) {
        flag.push(false)
        error[index].fixed_pattern = "The pattern length is not correct."
      }
      else {
        for (let ch = 0; ch < data?.fixed_pattern.length; ch++) {
          if (data?.fixed_pattern[ch] != 'Y' && data?.fixed_pattern[ch] != 'y' && data?.fixed_pattern[ch] != 'N' && data?.fixed_pattern[ch] != 'n') {
            flag.push(false)
            error[index].fixed_pattern = "The pattern must have y and n only."
          }
        }
      }
    }
  })

  for (let value in flag) {

    if (flag[value] === false) {
      final_flag = false;
      break;
    }

  }
  return final_flag === true ? true : error;
}
export default validateLOS

