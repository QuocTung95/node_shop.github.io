
async function isValidEmail(email, dataname) {
    try {
      const response = await dataname.findOne({ where: { email } });
      if (response) {
        return false;
      }
      const emailRegex = /^[\w\.+@[\w+\.]+/;
      if (!emailRegex.test(email)) {
        return false;
      }
      return true;
    } catch (error) {
      throw Error(error.message);
    }
  
  }
  function isValidName(name) {
    name = name.toLowerCase()
    try {
      const nameRegex = /[*[!@#$&*]/;
      if (!nameRegex.test(name)) {
        return false;
      }
      return true;
    } catch (error) {
      throw Error(error.message);
    }
  }
  
  
  module.exports = {
    isValidEmail,
    isValidName
  }