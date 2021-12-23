// @ts-check
import i18next from 'i18next';
import _ from 'lodash';

export default (app) => {
  app

    .get('/tasks', { name: 'page of tasks list' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const { query } = req;
      const filter = {
        status: query['data[status]'],
        executor: query['data[executor]'],
        label: query['data[label]'],
        isCreatorUser: !!query['data[isCreatorUser]'],
      };
      let taskQuery = app.objection.models.task.query().withGraphJoined('[labels, status]');
      if (filter.label) {
        taskQuery = taskQuery.where('labels.id', filter.label);
      }
      if (filter.status) {
        taskQuery = taskQuery.where('status.id', filter.status);
      }
      if (filter.executor) {
        taskQuery = taskQuery.where('executorId', filter.executor);
      }
      if (filter.isCreatorUser) {
        taskQuery = taskQuery.where('creatorId', req.session.get('id'));
      }
      const tasks = await taskQuery.orderBy('updatedAt', 'desc');
      const statuses = await app.objection.models.status.query();
      const users = await app.objection.models.user.query();
      const labels = await app.objection.models.label.query();
      reply.render('tasks/list', {
        filter,
        statuses: statuses.map((item) => ({ id: item.id, text: item.name })),
        users: users.map((item) => ({ id: item.id, text: `${item.firstName} ${item.lastName}` })),
        labels: labels.map((item) => ({ id: item.id, text: item.name })),
        tasks: tasks.map((item) => {
          const status = statuses.find(({ id }) => id === item.statusId);
          const creator = users.find(({ id }) => id === item.creatorId);
          const executor = users.find(({ id }) => id === item.executorId);
          return {
            ...item,
            status: status.name,
            creator: (creator) ? `${creator.firstName} ${creator.lastName}` : '',
            executor: (executor) ? `${executor.firstName} ${executor.lastName}` : '',
          };
        }),
      });
      return reply;
    })

    .get('/tasks/new', { name: 'page to create task' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.status.query().orderBy('name');
      const users = await app.objection.models.user.query().orderBy('first_name', 'last_name');
      const labels = await app.objection.models.label.query().orderBy('name');
      reply.render('tasks/new', {
        task,
        statuses: statuses.map((item) => ({ id: item.id, text: item.name })),
        users: users.map((item) => ({ id: item.id, text: `${item.firstName} ${item.lastName}` })),
        labels: labels.map((item) => ({ id: item.id, text: item.name })),
      });
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
      const status = await app.objection.models.status.query().findById(task.statusId);
      const creator = await app.objection.models.user.query().findById(task.creatorId);
      const executor = await app.objection.models.user.query().findById(task.executorId);
      const relatedLabels = await task.$relatedQuery('labels');
      reply.render('tasks/show', {
        task: {
          ...task,
          status: status.name,
          creator: (creator) ? `${creator.firstName} ${creator.lastName}` : '',
          executor: (executor) ? `${executor.firstName} ${executor.lastName}` : '',
          labels: relatedLabels.map((label) => label.name),
        },
        errors: {},
      });
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
      const relatedLabels = await task.$relatedQuery('labels');
      const statuses = await app.objection.models.status.query().orderBy('name');
      const users = await app.objection.models.user.query().orderBy('first_name', 'last_name');
      const labels = await app.objection.models.label.query().orderBy('name');
      reply.render('tasks/edit', {
        task: {
          ...task,
          labels: relatedLabels.map((item) => item.id),
        },
        statuses: statuses.map((item) => ({ id: item.id, text: item.name })),
        users: users.map((item) => ({ id: item.id, text: `${item.firstName} ${item.lastName}` })),
        labels: labels.map((item) => ({ id: item.id, text: item.name })),
      });
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
          ...data,
          creatorId,
          statusId: +data.statusId,
          executorId: +data.executorId,
        };
        const task = await app.objection.models.task.fromJson(jsonTask);
        const relatedLabels = data.labels ? _.flatten([data.labels]).map((label) => +label) : [];
        await app.objection.models.task.transaction(async (trx) => {
          await app.objection.models.task.query(trx).insert(task);
          await Promise.all(relatedLabels.map((label) => task.$relatedQuery('labels', trx).relate(label)));
        });
        req.flash('success', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('page of tasks list'));
        return reply;
      } catch (error) {
        console.error('error', error);
        req.flash('error', i18next.t('flash.tasks.create.error'));
        const dataTask = {
          ...data,
          labels: data.labels ? _.flatten([data.labels]).map((label) => +label) : [],
        };
        const statuses = await app.objection.models.status.query().orderBy('name');
        const users = await app.objection.models.user.query().orderBy('first_name', 'last_name');
        const labels = await app.objection.models.label.query().orderBy('name');
        reply.statusCode = 422;
        reply.render('tasks/new', {
          task: dataTask,
          statuses: statuses.map((item) => ({ id: item.id, text: item.name })),
          users: users.map((item) => ({ id: item.id, text: `${item.firstName} ${item.lastName}` })),
          labels: labels.map((item) => ({ id: item.id, text: item.name })),
          errors: error.data,
        });
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
          ...data,
          statusId: +data.statusId,
          creatorId: task.creatorId,
          executorId: +data.executorId,
        };
        const relatedLabels = data.labels ? _.flatten([data.labels]).map((label) => +label) : [];
        await app.objection.models.task.transaction(async (trx) => {
          await task.$query(trx).update(jsonTask);
          await task.$relatedQuery('labels', trx).unrelate();
          await Promise.all(relatedLabels.map((label) => task.$relatedQuery('labels', trx).relate(label)));
        });
        req.flash('success', i18next.t('flash.tasks.update.success'));
        reply.redirect(app.reverse('page of tasks list'));
        return reply;
      } catch (error) {
        console.error('error', error);
        req.flash('error', i18next.t('flash.tasks.update.error'));
        const dataTask = {
          ...data,
          id: taskId,
          labels: data.labels ? _.flatten([data.labels]).map((label) => +label) : [],
        };
        const statuses = await app.objection.models.status.query().orderBy('name');
        const users = await app.objection.models.user.query().orderBy('first_name', 'last_name');
        const labels = await app.objection.models.label.query().orderBy('name');
        reply.statusCode = 422;
        reply.render('tasks/edit', {
          task: dataTask,
          statuses: statuses.map((item) => ({ id: item.id, text: item.name })),
          users: users.map((item) => ({ id: item.id, text: `${item.firstName} ${item.lastName}` })),
          labels: labels.map((item) => ({ id: item.id, text: item.name })),
          errors: error.data,
        });
        return reply;
      }
    })

    .delete('/tasks/:id', { name: 'delete task' }, async (req, reply) => {
      const creatorId = req.session.get('id');
      if (!creatorId) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const taskId = +req.params?.id;
      const task = await app.objection.models.task.query().findById(taskId);
      if (!task) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        reply.redirect(app.reverse('page of tasks list'));
        return reply;
      }
      try {
        if (task.creatorId !== creatorId) {
          throw new Error();
        }
        await app.objection.models.task.transaction(async (trx) => {
          await task.$query(trx).delete();
          await task.$relatedQuery('labels', trx).unrelate();
        });
        req.flash('success', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('page of tasks list'));
        return reply;
      } catch (error) {
        console.error('error', error);
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        reply.statusCode = 422;
        reply.redirect(app.reverse('page of tasks list'));
        return reply;
      }
    });
};
