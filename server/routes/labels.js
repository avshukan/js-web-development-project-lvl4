import i18next from 'i18next';

// @ts-check
export default (app) => {
  app

    .get('/labels', { name: 'page of labels list' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const labels = await app.objection.models.label.query().orderBy('updatedAt', 'desc');
      reply.render('labels/list', { labels });
      return reply;
    })

    .get('/labels/new', { name: 'page of create label' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const label = new app.objection.models.label();
      reply.render('labels/new', { label });
      return reply;
    })

    .get('/labels/:id/edit', { name: 'page of update label' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const labelId = +req.params?.id;
      const label = await app.objection.models.label.query().findById(labelId);
      if (!label) {
        req.flash('error', i18next.t('flash.labels.show.error'));
        reply.redirect(app.reverse('page of labels list'));
        return reply;
      }
      reply.render('labels/edit', { label, errors: {} });
      return reply;
    })

    .post('/labels', { name: 'create label' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const { data } = req.body;
      try {
        const label = await app.objection.models.label.fromJson(data);
        await app.objection.models.label.query().insert(label);
        req.flash('success', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('page of labels list'));
        return reply;
      } catch (error) {
        console.log('error', error);
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.statusCode = 422;
        reply.render('labels/new', { label: data, errors: error.data });
        return reply;
      }
    })

    .patch('/labels/:id', { name: 'update label' }, async (req, reply) => {
      if (!req.session.get('id')) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      const labelId = +req.params?.id;
      const label = await app.objection.models.label.query().findById(labelId);
      if (!label) {
        req.flash('error', i18next.t('flash.labels.update.error'));
        reply.redirect(app.reverse('page of labels list'));
        return reply;
      }
      const { data } = req.body;
      try {
        await label.$query().update(data);
        req.flash('success', i18next.t('flash.labels.update.success'));
        reply.redirect(app.reverse('page of labels list'));
        return reply;
      } catch (error) {
        console.log('error', error);
        req.flash('error', i18next.t('flash.labels.update.error'));
        reply.statusCode = 422;
        reply.render('labels/edit', { label: { ...data, id: labelId }, errors: error.data });
        return reply;
      }
    })

    .delete('/labels/:id', { name: 'delete label' }, async (_req, reply) => reply.redirect(app.reverse('root')));
};
