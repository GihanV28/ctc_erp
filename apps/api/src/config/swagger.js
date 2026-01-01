const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ceylon Cargo Transport API',
      version: '1.0.0',
      description: 'Comprehensive logistics management system API',
      contact: {
        name: 'CCT Support',
        email: 'info.cct@ceylongrp.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.cct.ceylongrp.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;