// @ts-check

export default (app) => {
  app
    .get('/welcome', { name: 'roo' }, (req, reply) => {
      reply.render('welcome/index2');
    })
    .get('/', { name: 'root' }, (req, reply) => {
      reply.render('welcome/index');
    })
    .get('/protected', { name: 'protected', preValidation: app.authenticate }, (req, reply) => {
      reply.render('welcome/index');
    });
};
