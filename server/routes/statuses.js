// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'page of statuses list' }, async (_req, reply) => reply.redirect(app.reverse('root')))
    .get('/statuses/new', { name: 'page to create status' }, (_req, reply) => reply.redirect(app.reverse('root')))
    .get('/statuses/:id/edit', { name: 'page to update status' }, async (_req, reply) => reply.redirect(app.reverse('root')))
    .post('/statuses', { name: 'create status' }, async (_req, reply) => reply.redirect(app.reverse('root')))
    .patch('/statuses/:id', { name: 'update status' }, async (_req, reply) => reply.redirect(app.reverse('root')))
    .delete('/statuses/:id', { name: 'delete status' }, async (_req, reply) => reply.redirect(app.reverse('root')));
};
