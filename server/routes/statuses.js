// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'page of statuses list' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        return reply.redirect(app.reverse('root'));
      }
      const statuses = await app.objection.models.status.query();
      return reply.render('statuses/index', { statuses });
    })
    .get('/statuses/new', { name: 'page to create status' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        return reply.redirect(app.reverse('root'));
      }
      const status = new app.objection.models.status();
      return reply.render('users/new', { status });
    })
    .get('/statuses/:id', { name: 'page to update status' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        return reply.redirect(app.reverse('root'));
      }
      const id = +req.params?.id;
      const user = await app.objection.models.user.query().findById(id);
      return reply.render('users/edit', { user, errors: {} });
    })
    .post('/statuses', { name: 'create status' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        return reply.redirect(app.reverse('root'));
      }
      const { data } = req.body;
      try {
        const status = await app.objection.models.status.fromJson(data);
        await app.objection.models.status.query().insert(status);
        req.flash('success', i18next.t('flash.statuses.create.success'));
        return reply.redirect(app.reverse('page of statuses list'));
      } catch (error) {
        console.log('error', error);
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.statusCode = 422;
        return reply.render('statuses/new', { status: data, errors: error.data });
      }
    })
    .patch('/statuses/:id', { name: 'update status' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        return reply.redirect(app.reverse('root'));
      }
      const { data } = req.body;
      const id = +req.params?.id;
      try {
        const status = await app.objection.models.status.query().findById(id);
        if (!status) {
          req.flash('error', i18next.t('flash.statuses.update.error'));
          return reply.redirect(app.reverse('page of statuses list'));
        }
        await status.$query().update(data);
        req.flash('success', i18next.t('flash.statuses.update.success'));
        return reply.redirect(app.reverse('page of statuses list'));
      } catch (error) {
        console.log('error', error);
        req.flash('error', i18next.t('flash.statuses.update.error'));
        reply.statusCode = 422;
        return reply.render(app.reverse('page to update status', { id, status: data, errors: error.data }));
      }
    })
    .delete('/statuses/:id', { name: 'delete status' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        return reply.redirect(app.reverse('root'));
      }
      const id = +req.params?.id;
      try {
        await app.objection.models.status.query().deleteById(id);
        req.flash('success', i18next.t('flash.statuses.delete.success'));
        return reply.redirect(app.reverse('page of statuses list'));
      } catch (error) {
        console.log('error', error);
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        reply.statusCode = 422;
        return reply.redirect(app.reverse('page of statuses list'));
      }
    });
};
