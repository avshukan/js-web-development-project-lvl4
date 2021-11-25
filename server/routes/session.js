// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/session/new', { name: 'newSession' }, (req, reply) => {
      const signInForm = {};
      reply.render('session/new', { signInForm });
    })
    .post('/session', { name: 'session' }, app.fp.authenticate('form', async (req, reply, err, user) => {
      if (err) {
        return app.httpErrors.internalServerError(err);
      }
      if (!user) {
        const signInForm = req.body.data;
        const errors = {
          email: [{ message: i18next.t('flash.session.create.error') }],
        };
        reply.statusCode = 422;
        return reply.render('session/new', { signInForm, errors });
      }
      console.log('user before', user);
      const result = await req.logIn(user);
      console.log('result', result);
      console.log('user after', user);
      req.flash('success', i18next.t('flash.session.create.success'));
      reply.setCookie('user', JSON.stringify(user));
      reply.setCookie('id', user.id);
      return reply.redirect(app.reverse('root'));
    }))
    .delete('/session', (req, reply) => {
      req.logOut();
      req.flash('info', i18next.t('flash.session.delete.success'));
      reply.redirect(app.reverse('root'));
    });
};
