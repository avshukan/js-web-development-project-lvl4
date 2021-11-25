// @ts-check

import _ from 'lodash';
import getApp from '../server/index.js';
import encrypt from '../server/lib/secure.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

  beforeAll(async () => {
    app = await getApp();
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    // тесты не должны зависеть друг от друга
    // перед каждым тестом выполняем миграции
    // и заполняем БД тестовыми данными
    await knex.migrate.latest();
    await prepareData(app);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });
    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });
    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);

    const existingParams = testData.users.existing;
    const existingResponse = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: existingParams,
      },
    });
    expect(existingResponse.statusCode).toBe(422);
  });

  it('edit', async () => {
    console.log('nonexistent');
    const nonexistentParams = testData.users.nonexistent;
    const nonexistentResponse = await app.inject({
      method: 'GET',
      url: `/users/${nonexistentParams.id}`,
      // url: app.reverse(`/users/${nonexistentParams.id}`),
    });
    expect(nonexistentResponse.statusCode).toBe(404);

    console.log('authorizing');
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: testData.users.olddata,
      },
    });
    const cookies = responseSignIn.cookies;
    const { value: id } = cookies.filter((item) => item.name === 'id')[0];

    console.log('updating');
    const olddataResponse = await app.inject({
      method: 'GET',
      // url: app.reverse(`users/${id}/edit`),
      url: `users/${id}/edit`,
    });
    expect(olddataResponse.statusCode).toBe(200);

    console.log('unauthorized');
    // добавить обновление данных
    // PATCH /users/:id - обновление пользователя
    // 302 - успешное обновление с переадресацией (куда?)
    // 401 - ошибка обновления, потому что id не соответствует id пользователя
    // 422 - ошибка обновления по другим причинам
    const unauthorizedId = 1;
    const newParams = testData.users.newdata;
    const unauthorizedResponse = await app.inject({
      method: 'PATCH',
      // url: app.reverse(`users/${unauthorizedId}/edit`),
      url: `users/${unauthorizedId}/edit`,
      payload: {
        data: newParams,
      },
    });
    // const unauthorizedUser = await models.user.query().findOne({ id: unauthorizedId });
    expect(unauthorizedResponse.statusCode).toBe(401);
    // expect(user).toBeNull();

    const badParams = {};
    const badResponse = await app.inject({
      method: 'PATCH',
      // url: app.reverse(`users/${id}/edit`),
      url: `users/${id}/edit`,
      payload: {
        data: badParams,
      },
    });
    const user = await models.user.query().findOne({ id });
    expect(badResponse.statusCode).toBe(422);
    expect(user).toBeNull();

    const newResponse = await app.inject({
      method: 'PATCH',
      // url: app.reverse(`users/${id}/edit`),
      url: `users/${id}/edit`,
      payload: {
        data: newParams.email,
      },
    });
    const newUser = await models.user.query().findOne({ id });
    const newEmail = newUser.email;
    const newPasswordDigest = newUser.passwordDigest;
    expect(newResponse.statusCode).toBe(302);
    expect(newEmail).toBe(newParams);
    expect(newPasswordDigest).toBe(encrypt(newParams.password));
  });

  it('delete', async () => {
    const users = await models.user.query();
    const deletedUser = users[0];

    console.log('UNAUTHORIZED DELETED');
    const params = { id: 1, password: 'O6AvLIQL1cbzrre' };
    const response = await app.inject({
      method: 'DELETE',
      // url: app.reverse('users'),
      url: `users/${deletedUser.id}`,
    });
    const user = await models.user.query().findById(params.id);
    expect(response.statusCode).toBe(404);
    expect(user).toBeNull();

    const wrongParams = { id: 1, password: 'wrongPassword' };
    const expectedWronguser = await models.user.query().findOne({ id: params.id });
    const wrongResponse = await app.inject({
      method: 'DELETE',
      url: app.reverse('users'),
      payload: {
        data: wrongParams,
      },
    });
    const wrongUser = await models.user.query().findOne({ id: params.id });
    expect(wrongResponse.statusCode).toBe(401);
    expect(wrongUser).toMatchObject(expectedWronguser);

    const badParams = { id: 999, password: '123' };
    const badResponse = await app.inject({
      method: 'DELETE',
      url: app.reverse('users'),
      payload: {
        data: badParams,
      },
    });
    const badUser = await models.user.query().findOne({ id: params.id });
    expect(badResponse.statusCode).toBe(422);
    expect(badUser).toBeNull();
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
