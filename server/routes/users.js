// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'page of users list' }, async (_req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'page to create user' }, (_req, reply) => {
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
      } catch (error) {
        console.log('error', error);
        const { data } = error;
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.statusCode = 422;
        reply.render('users/new', { user: req.body.data, errors: data });
        return reply;
      }
    })
    .get('/users/:id/edit', { name: 'page to update user' }, async (req, reply) => {
      const id = +req.params?.id;
      const cookieId = +req.session.get('id');
      if (!cookieId || (cookieId !== id)) {
        req.flash('error', i18next.t('flash.users.update.unauthorized'));
        return reply.redirect(app.reverse('root'));
      }
      const user = await app.objection.models.user.query().findById(id);
      reply.render('users/edit', { user, errors: {} });
      return reply;
    })
    .get('/users/:id', { name: 'page of user info' }, async (req, reply) => {
      const id = +req.params?.id;
      const user = await app.objection.models.user.query().findById(id);
      if (!user) {
        return reply.notFound();
      }
      reply.render('users/edit', { user, errors: {} });
      return reply;
    })
    .patch('/users/:id', { name: 'update user' }, async (req, reply) => {
      const { data } = req.body;
      const id = +req.params?.id;
      const cookieId = +req.session.get('id');
      try {
        if (!cookieId || (cookieId !== id)) {
          req.flash('error', i18next.t('flash.users.update.error'));
          req.flash('error', i18next.t('flash.users.update.unauthorized'));
          return reply.redirect(app.reverse('root'));
        }
        const user = await app.objection.models.user.query().findById(id);
        await user.$query().update(data);
        req.flash('error', i18next.t('flash.users.update.success'));
        reply.statusCode = 204;
        reply.render('users/edit', { user: { ...req.body.data, id }, errors: {} });
        return reply;
      } catch (error) {
        console.log('patch error', error);
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.statusCode = 422;
        reply.render('users/edit', { user: { ...req.body.data, id }, errors: error.data });
        return reply;
      }
    })
    .delete('/users/:id', { name: 'delete user' }, async (req, reply) => {
      const id = +req.params?.id;
      const cookieId = +req.session.get('id');
      if (!cookieId || (cookieId !== id)) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        req.flash('error', i18next.t('flash.users.delete.unauthorized'));
        return reply.redirect(app.reverse('root'));
      }
      await app.objection.models.user.query().deleteById(id);
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    });
};
