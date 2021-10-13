
const responseWriter = require('../node_modules/libidentity/res');

module.exports = (
    sendToAddresses, 
    subject, 
    purpose,
    res) => {

    if(sendToAddresses === null || sendToAddresses === undefined || sendToAddresses.length <= 0) {
        responseWriter.response(res, {
          success: false,
          response: `Invalid 'to' address. Failed to send mail.`
        }, null, 400);
        return false;
      }
      else if(subject === null || subject === undefined) {
        responseWriter.response(res, {
          success: false,
          response: `Invalid 'subject'. Failed to send mail.`
        }, null, 400);
        return false;
      }
      else if(purpose === null || purpose === undefined) {
        responseWriter.response(res, {
          success: false,
          response: `Invalid 'purpose'. Failed to send mail.`
        }, null, 400);
        return false;
      }

      return true;
};