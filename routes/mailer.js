var express = require('express');
var router = express.Router();

const SecurityContext = require('libidentity');
const responseWriter = require('../node_modules/libidentity/res');
const inputValidator = require('../validators/validateInput');
const MailConfigSchema = require('../models/mailConfig');
const RabbitMq = require("libamqp");

const AppSettings = require(`../config.${process.env.NODE_ENV}`);
var config = new AppSettings();
const securityContext = new SecurityContext(config);
var rabbitMq = new RabbitMq(config);

const SendMailCommand = require('../models/mailCommand');

// Rabbit queues and exchanges
const exchangeName = "MailServiceExchange";
const queueName = "MailServiceHost";

router.all('*', securityContext.verifyToken, securityContext.dbContextAccessor, securityContext.verifyUser)
  /**
   * A valid authorization token is mandatory for this endpoint. Send mail endpoint.
   * 
   * **Important** : To send a sample email you have to have a valid token. After acquiring the token, use these fields (to, subject, dataContext) to send emails. **Keep purpose field as it is**. Just modify to and subject properties as per your requirements.
   * 
   * A sample mail will be sent to https://ethereal.email/messages if the process succeeds.
   * 
   * username: kallie.hudson@ethereal.email
   * password: TAUr56C3pxnmAjPtWH
   * 
   * @route POST /mailer/sendMail
   * @group Mailer - mail-service endpoints
   * @param {MailInfo.model} mailInfo.body.required
   * @returns {object} 200 - Delivery to mail host success response
   * @returns {Error}  default - Unexpected error
   * @security JWT
   */
  .post('/sendMail', function(req, res, next) {

    let sendToAddresses = req.body.to;
    let subject = req.body.subject;
    let purpose = req.body.purpose;
    let cc = req.body.cc;
    let bcc = req.body.bcc;
    let dataContext = req.body.dataContext;

    const valid = inputValidator(sendToAddresses, subject, purpose, res);

    if(!valid) {
      return;
    }

    rabbitMq.prepareChannel((ch) => {
      let token = securityContext.extractJwtToken(req.headers.authorization);
      let mailCommand = new SendMailCommand(
        sendToAddresses,
        subject,
        purpose,
        cc,
        bcc,
        dataContext
      );
      rabbitMq.sendToQueue(queueName, ch, token, mailCommand)
      
      console.log("Mail sent!!\n");

      console.log(mailCommand);

      return responseWriter.response(res, {
          success: true,
          response: `Mail enqueued`
        }, null, 200);
      });
  });

/**
 * @typedef MailInfo
 * @property {string[]} to.query.required - A list of email addresses to be sent - eg: ["YOUR_EMAIL_HERE"]
 * @property {string[]} cc.query.required - A list of email addresses to CC.
 * @property {string[]} bcc.query.required - A list of email addresses to BCC.
 * @property {string} subject.query.required - The subject of the email - eg: test_subject 
 * @property {string} purpose.query.required - The purpose of the mail - eg: test_purpose
 * @property {object} dataContext.query.required - A dictionary with key value pair of data - eg: {"name": "YOUR_NAME_HERE"}
 */


module.exports = router;
