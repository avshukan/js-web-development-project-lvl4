// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'page of statuses list' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'page to create status' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const status = new app.objection.models.status();
      reply.render('statuses/new', { status });
      return reply;
    })
    .get('/statuses/:id/edit', { name: 'page to update status' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const id = +req.params?.id;
      const status = await app.objection.models.status.query().findById(id);
      reply.render('statuses/edit', { status, errors: {} });
      return reply;
    })
    .post('/statuses', { name: 'create status' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const { data } = req.body;
      try {
        const status = await app.objection.models.status.fromJson(data);
        await app.objection.models.status.query().insert(status);
        req.flash('success', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('page of statuses list'));
        return reply;
      } catch (error) {
        console.log('error', error);
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.statusCode = 422;
        reply.render('statuses/new', { status: data, errors: error.data });
        return reply;
      }
    })
    .patch('/statuses/:id', { name: 'update status' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const { data } = req.body;
      const id = +req.params?.id;
      try {
        const status = await app.objection.models.status.query().findById(id);
        if (!status) {
          req.flash('error', i18next.t('flash.statuses.update.error'));
          reply.redirect(app.reverse('page of statuses list'));
          return reply;
        }
        await status.$query().update(data);
        req.flash('success', i18next.t('flash.statuses.update.success'));
        reply.redirect(app.reverse('page of statuses list'));
        return reply;
      } catch (error) {
        console.log('error', error);
        req.flash('error', i18next.t('flash.statuses.update.error'));
        reply.statusCode = 422;
        reply.render('statuses/edit', { status: { ...data, id }, errors: error.data });
        return reply;
      }
    })
    .delete('/statuses/:id', { name: 'delete status' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const id = +req.params?.id;
      try {
        const status = await app.objection.models.status.query().findById(id);
        if (!status) {
          req.flash('error', i18next.t('flash.statuses.delete.error'));
          reply.redirect(app.reverse('page of statuses list'));
          return reply;
        }
        await app.objection.models.status.query().deleteById(id);
        req.flash('success', i18next.t('flash.statuses.delete.success'));
        reply.redirect(app.reverse('page of statuses list'));
        return reply;
      } catch (error) {
        console.log('error', error);
        req.flash('error', i18next.t('flash.statuses.delete.error'));
        reply.statusCode = 422;
        reply.redirect(app.reverse('page of statuses list'));
        return reply;
      }
    });
};
