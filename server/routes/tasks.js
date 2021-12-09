// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'page of tasks list' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const tasks = await app.objection.models.task.query();
      reply.render('tasks/list', { tasks });
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
