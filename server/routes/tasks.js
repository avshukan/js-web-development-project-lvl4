// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'page of tasks list' }, async (_req, reply) => {
      reply.redirect(app.reverse('root'));
      return reply;
    })
    .get('/tasks/new', { name: 'page to create task' }, async (_req, reply) => {
      reply.redirect(app.reverse('root'));
      return reply;
    })
    .get('/tasks/:id', { name: 'page to show task' }, async (_req, reply) => {
      reply.redirect(app.reverse('root'));
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'page to update task' }, async (_req, reply) => {
      reply.redirect(app.reverse('root'));
      return reply;
    })
    .post('/tasks', { name: 'create task' }, async (_req, reply) => {
      reply.redirect(app.reverse('root'));
      return reply;
    })
    .patch('/tasks/:id', { name: 'update task' }, async (_req, reply) => {
      reply.redirect(app.reverse('root'));
      return reply;
    })
    .delete('/tasks/:id', { name: 'delete task' }, async (_req, reply) => {
      reply.redirect(app.reverse('root'));
      return reply;
    });
};
