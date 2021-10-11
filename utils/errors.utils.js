
module.exports.signInErrors = (err) => {
    let errors = { login: '', pass: ''}
  
    if (err.message.includes("login")) 
      errors.login = "Login inconnu";
    
    if (err.message.includes('password'))
      errors.pass = "Le mot de passe ne correspond pas"
  
    return errors;
  }

  module.exports.uploadErrors = (err) => {
    let errors = {format : '', maxSize : ''};
    if (err.message.includes('Invalid File !'))
    errors.format = "Format incompatibles !";

    if (err.message.includes('Max Size !'))
    errors.maxSize = "Le fichier dépasse 500Ko !";

    return errors
  }