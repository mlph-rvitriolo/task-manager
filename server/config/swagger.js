import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'A RESTful API for managing tasks',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['title'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the task',
            },
            title: {
              type: 'string',
              description: 'The title of the task',
            },
            description: {
              type: 'string',
              description: 'The description of the task',
            },
            complete: {
              type: 'boolean',
              description: 'The completion status of the task',
              default: false,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'The creation timestamp of the task',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'The last update timestamp of the task',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

export const specs = swaggerJsdoc(options); 