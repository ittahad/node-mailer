function addSwagger(app) {
    const expressSwagger = require('express-swagger-ui-generator')(app);
    let protocols = process.env.NODE_ENV === 'dev' ? ['http'] : ['https'];
    let options = {
      swaggerDefinition: {
          info: {
              description: 'Mail service for ACP microservices',
              title: 'node-mail-service'
          },
          produces: [
              "application/json",
              "application/xml"
          ],
          consumes: [
            "application/json",
            "application/xml",
            "application/x-www-form-urlencoded"
          ],
          schemes: protocols,
          securityDefinitions: {
              JWT: {
                  type: 'apiKey',
                  in: 'header',
                  name: 'Authorization',
                  description: ""
              }
          }
      },
      basedir: __dirname,
      files: ['./routes/**/*.js']
    };
    expressSwagger(options);
}

module.exports = addSwagger;