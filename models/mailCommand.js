
class SendMailCommand {

    constructor(
        to,
        subject,
        purpose,
        cc,
        bcc,
        dataContext ) {

            this.to = to;
            this.subject = subject;
            this.purpose = purpose;
            this.cc = cc;
            this.bcc = bcc;
            this.dataContext = dataContext;
    }

}

module.exports = SendMailCommand;