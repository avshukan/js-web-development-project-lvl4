// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'page of statuses list' }, async (_req, reply) => reply.redirect(app.reverse('root')))
    .get('/statuses/new', { name: 'page to create status' }, (_req, reply) => reply.redirect(app.reverse('root')))
    .get('/statuses/:id/edit', { name: 'page to update status' }, async (_req, reply) => reply.redirect(app.reverse('root')))
    .post('/statuses', { name: 'create status' }, async (req, reply) => {
      const { data } = req.body;
      const cookieId = req.session.get('id');
      if (!cookieId) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        req.flash('error', i18next.t('flash.statuses.create.unauthorized'));
        return reply.redirect(app.reverse('root'));
      }
      try {
        const status = await app.objection.models.status.fromJson(data);
        await app.objection.models.status.query().insert(status);
        req.flash('success', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch (error) {
        console.log('error', error);
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.statusCode = 422;
        // return reply.redirect(app.reverse('root'));
        reply.render('statuses/new', { status: data, errors: error.data });
        return reply;
      }
    })
    .patch('/statuses/:id', { name: 'update status' }, async (_req, reply) => reply.redirect(app.reverse('root')))
    .delete('/statuses/:id', { name: 'delete status' }, async (_req, reply) => reply.redirect(app.reverse('root')));
};
