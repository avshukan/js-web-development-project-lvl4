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
        console.log('req.body.data', req.body.data);
        const user = await app.objection.models.user.fromJson(req.body.data);
        console.log('user', user);
        const inserted = await app.objection.models.user.query().insert(user);
        console.log('inserted', inserted);
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
      const { id } = req.params;
      // const cookie_id = req.session.get('id');
      // console.log('cookie_id', cookie_id);
      if (!reply.locals?.passport?.id || id !== reply.locals?.passport?.id) {
        req.flash('error', i18next.t('flash.users.update.unauthorized'));
        return reply.redirect(app.reverse('root'));
      }
      const user = await app.objection.models.user.query().findById(id);
      reply.render('users/edit', { user, errors: {} });
      return reply;
    })
    .get('/users/:id', { name: 'page of user info' }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);
      if (!user) {
        return reply.notFound();
      }
      reply.render('users/edit', { user, errors: {} });
      return reply;
    })
    .patch('/users/:id', { name: 'update user' }, async (req, reply) => {
      try {
        const { id } = req.params;
        if (!reply.locals?.passport?.id || id !== reply.locals?.passport?.id) {
          req.flash('error', i18next.t('flash.users.update.error'));
          req.flash('error', i18next.t('flash.users.update.unauthorized'));
          return reply.redirect(app.reverse('root'));
        }
        const user = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().findById(id).patch(user);
        reply.statusCode = 204;
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
      try {
        console.log("req.session[Object.getOwnPropertySymbols(req.session)[0]]['passport']", req.session[Object.getOwnPropertySymbols(req.session)[0]].passport);
      } catch (e) {
        console.log("can't req.session[Object.getOwnPropertySymbols(req.session)[0]]['passport']");
      }
      if (!reply.locals?.passport?.id || id !== reply.locals?.passport?.id) {
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
