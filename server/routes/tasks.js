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

    .get('/tasks/new', { name: 'page to create task' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const task = new app.objection.models.task();
      reply.render('tasks/new', { task });
      return reply;
    })

    .get('/tasks/:id', { name: 'page to show task' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const taskId = +req.params?.id;
      const task = await app.objection.models.task.query().findById(taskId);
      if (!task) {
        req.flash('error', i18next.t('flash.tasks.show.error'));
        reply.redirect(app.reverse('page of tasks list'));
        return reply;
      }
      reply.render('tasks/show', { task, errors: {} });
      return reply;
    })

    .get('/tasks/:id/edit', { name: 'page to update task' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const taskId = +req.params?.id;
      const task = await app.objection.models.task.query().findById(taskId);
      if (!task) {
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.redirect(app.reverse('page of tasks list'));
        return reply;
      }
      reply.render('tasks/edit', { task, errors: {} });
      return reply;
    })

    .post('/tasks', { name: 'create task' }, async (req, reply) => {
      const creatorId = req.session.get('id');
      if (!creatorId) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const { data } = req.body;
      try {
        const status = await app.objection.models.status.query().findById(data.statusId);
        if (!status) {
          throw new Error();
        }
        const jsonTask = {
          ...data, creatorId, statusId: +data.statusId, executorId: +data.executorId,
        };
        const task = await app.objection.models.task.fromJson(jsonTask);
        await app.objection.models.task.query().insert(task);
        req.flash('success', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('page of tasks list'));
        return reply;
      } catch (error) {
        console.log('error', error);
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.statusCode = 422;
        reply.render('tasks/new', { task: data, errors: error.data });
        return reply;
      }
    })

    .patch('/tasks/:id', { name: 'update task' }, async (req, reply) => {
      const creatorId = req.session.get('id');
      if (!creatorId) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const taskId = +req.params?.id;
      const task = await app.objection.models.task.query().findById(taskId);
      if (!task) {
        req.flash('error', i18next.t('flash.tasks.update.error'));
        reply.redirect(app.reverse('page of tasks list'));
        return reply;
      }
      const { data } = req.body;
      try {
        const status = await app.objection.models.status.query().findById(data.statusId);
        if (!status) {
          throw new Error();
        }
        const jsonTask = {
          ...data, creatorId, statusId: +data.statusId, executorId: +data.executorId,
        };
        await task.$query().update(jsonTask);
        req.flash('success', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('page of tasks list'));
        return reply;
      } catch (error) {
        console.log('error', error);
        req.flash('error', i18next.t('flash.statuses.update.error'));
        reply.statusCode = 422;
        reply.render('tasks/edit', { task: { ...data, id: taskId }, errors: error.data });
        return reply;
      }
    })

    .delete('/tasks/:id', { name: 'delete task' }, async (_req, reply) => {
      reply.redirect(app.reverse('root'));
      return reply;
    });
};
