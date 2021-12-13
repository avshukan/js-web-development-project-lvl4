// @ts-check
export default (app) => {
  app

    .get('/labels', { name: 'page of labels list' }, async (_req, reply) => reply.redirect(app.reverse('root')))

    .get('/labels/new', { name: 'page of create label' }, async (_req, reply) => reply.redirect(app.reverse('root')))

    .get('/labels/:id/edit', { name: 'page of update label' }, async (_req, reply) => reply.redirect(app.reverse('root')))

    .post('/labels', { name: 'create label' }, async (_req, reply) => reply.redirect(app.reverse('root')))

    .patch('/labels/:id', { name: 'update label' }, async (_req, reply) => reply.redirect(app.reverse('root')))

    .delete('/labels/:id', { name: 'delete label' }, async (_req, reply) => reply.redirect(app.reverse('root')));
};
