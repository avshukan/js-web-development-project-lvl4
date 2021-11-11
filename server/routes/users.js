// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (_req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (_req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', { name: 'create user' }, async (req, reply) => {
      try {
        const user = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.statusCode = 422;
        reply.render('users/new', { user: req.body.data, errors: data });
        return reply;
      }
    })
    .get('/users/:id/edit', { name: 'read for update user' }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);
      reply.render('users/edit', { user, errors: {} });
      return reply;
    })
    .get('/users/:id', { name: 'read user' }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);
      reply.render('users/edit', { user, errors: {} });
      return reply;
    })
    .patch('/users/:id', { name: 'update user' }, async (req, reply) => {
      try {
        const { id } = req.params;
        console.log('id', typeof id, id);
        if (id === '999') {
          req.flash('error', i18next.t('flash.users.update.error'));
          req.flash('error', i18next.t('flash.users.update.unauthorized'));
          reply.statusCode = 401;
          reply.render(`users/${id}/edit`, { user: req.body.data, errors: {} });
          return reply;
        }
        const user = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().findById(id).patch(user);
        reply.render(`users/${id}`, { user, errors: {} });
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        reply.statusCode = 422;
        reply.render('users/new', { user: req.body.data, errors: data });
        return reply;
      }
    })
    .delete('/users/:id', { name: 'delete user' }, async (req, reply) => {
      const { id } = req.params;
      await app.objection.models.user.query().deleteById(id);
      reply.redirect(app.reverse('root'));
      return reply;
    });
};
