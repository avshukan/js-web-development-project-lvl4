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

  it('page list success', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('page of users list'),
    });
    expect(response.statusCode).toBe(200);
  });

  it('page new success', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('page to create user'),
    });
    expect(response.statusCode).toBe(200);
  });

  it('create user success', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('create user'),
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
  });

  it('create user fail', async () => {
    const existingParams = testData.users.existing;
    const existingResponse = await app.inject({
      method: 'POST',
      url: app.reverse('create user'),
      payload: {
        data: existingParams,
      },
    });
    expect(existingResponse.statusCode).toBe(422);
  });

  it('edit user success', async () => {
    const oldParams = testData.users.olddata;
    const newParams = testData.users.newdata;
    const oldUser = await models.user.query().findOne({ email: oldParams.email });
    // авторизация
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: oldParams,
      },
    });
    expect(responseSignIn.statusCode).toBe(302);
    // после успешной аутентификации получаем куки из ответа,
    // они понадобятся для выполнения запросов на маршруты требующие
    // предварительную аутентификацию
    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookies = { [name]: value };

    // открывается страница для редактирования пользователя
    const olddataResponse = await app.inject({
      method: 'GET',
      url: app.reverse('page to update user', { id: oldUser.id }),
      // используем полученные ранее куки
      cookies,
    });
    expect(olddataResponse.statusCode).toBe(200);

    const newdataResponse = await app.inject({
      method: 'PATCH',
      url: app.reverse('update user', { id: oldUser.id }),
      payload: {
        data: newParams,
      },
      // используем полученные ранее куки
      cookies,
    });
    const newUser = await models.user.query().findOne({ id: oldUser.id });
    const expectedNewUser = {
      ..._.omit(newParams, 'password'),
      passwordDigest: encrypt(newParams.password),
    };
    expect(newdataResponse.statusCode).toBe(302);
    expect(newUser).toMatchObject(expectedNewUser);
  });

  it('edit user fail', async () => {
    const existingParams = testData.users.existing;
    const exisitngUser = await models.user.query().findOne({ email: existingParams.email });
    const exisitngUsers = await models.user.query();
    const standartData = _.pick(exisitngUser, ['id', 'firstName', 'lastName', 'email', 'newPasswordDigest']);
    const standartUsersCount = exisitngUsers.length;

    // send data with no cookies (and no authorizing)
    const newParams = testData.users.newdata;
    const unauthorizedResponse = await app.inject({
      method: 'PATCH',
      url: app.reverse('update user', { id: exisitngUser.id }),
      payload: {
        data: newParams,
      },
      // используем полученные ранее куки
      // cookies,
    });
    const unauthorizedUser = await models.user.query().findOne({ id: standartData.id });
    const unauthorizedUsers = await models.user.query();
    const unauthorizedData = _.pick(unauthorizedUser, ['id', 'firstName', 'lastName', 'email', 'newPasswordDigest']);
    expect(unauthorizedResponse.statusCode).toBe(302);
    expect(unauthorizedData).toMatchObject(standartData);
    expect(unauthorizedUsers.length).toBe(standartUsersCount);

    // sign in (auxiliary)
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: existingParams,
      },
    });
    expect(responseSignIn.statusCode).toBe(302);
    // после успешной аутентификации получаем куки из ответа,
    // они понадобятся для выполнения запросов на маршруты требующие
    // предварительную аутентификацию
    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookies = { [name]: value };

    // send data to notexistent id
    const max = await models.user.query().max('id as value').first();
    const nonexistentResponse = await app.inject({
      method: 'PATCH',
      url: app.reverse('update user', { id: (max.value + 1) }),
      payload: {
        data: newParams,
      },
      // используем полученные ранее куки
      cookies,
    });
    expect(nonexistentResponse.statusCode).toBe(302);
    const nonexistentUsers = await models.user.query();
    expect(nonexistentUsers.length).toBe(standartUsersCount);

    // send empty data
    const badParams = {};
    const badResponse = await app.inject({
      method: 'PATCH',
      url: app.reverse('update user', { id: standartData.id }),
      payload: {
        data: badParams,
      },
      cookies,
    });
    const badUser = await models.user.query().findOne({ id: standartData.id });
    const badUsers = await models.user.query();
    const badData = _.pick(badUser, ['id', 'firstName', 'lastName', 'email', 'newPasswordDigest']);
    expect(badResponse.statusCode).toBe(422);
    expect(badData).toMatchObject(standartData);
    expect(badUsers.length).toBe(standartUsersCount);

    // send duplicated email
    const duplicateParams = testData.users.duplicateemaildata;
    const duplicateResponse = await app.inject({
      method: 'PATCH',
      url: app.reverse('update user', { id: standartData.id }),
      payload: {
        data: duplicateParams,
      },
      cookies,
    });
    const duplicateUser = await models.user.query().findOne({ id: standartData.id });
    const duplicateUsers = await models.user.query();
    const duplicateData = _.pick(duplicateUser, ['id', 'firstName', 'lastName', 'email', 'newPasswordDigest']);
    expect(duplicateResponse.statusCode).toBe(422);
    expect(duplicateData).toMatchObject(standartData);
    expect(duplicateUsers.length).toBe(standartUsersCount);
  });

  it('delete user success', async () => {
    const existingParams = testData.users.existing;
    const exisitngUser = await models.user.query().findOne({ email: existingParams.email });
    const exisitngUsers = await models.user.query();
    const standartUsersCount = exisitngUsers.length;

    // signing in (auxiliary)
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: existingParams,
      },
    });
    expect(responseSignIn.statusCode).toBe(302);
    // после успешной аутентификации получаем куки из ответа,
    // они понадобятся для выполнения запросов на маршруты требующие
    // предварительную аутентификацию
    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookies = { [name]: value };

    // deleting existing user
    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: app.reverse('delete user', { id: exisitngUser.id }),
      // используем полученные ранее куки
      cookies,
    });
    const deleteUser = await models.user.query().findOne({ id: exisitngUser.id });
    const deleteUsers = await models.user.query();
    expect(deleteResponse.statusCode).toBe(302);
    expect(deleteUser).toBeUndefined();
    expect(deleteUsers.length).toBe(standartUsersCount - 1);
  });

  it('delete user fail', async () => {
    const existingParams = testData.users.existing;
    const exisitngUser = await models.user.query().findOne({ email: existingParams.email });
    const exisitngUsers = await models.user.query();
    const standartData = _.pick(exisitngUser, ['id', 'firstName', 'lastName', 'email', 'newPasswordDigest']);
    const standartUsersCount = exisitngUsers.length;

    // signing in (auxiliary)
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: existingParams,
      },
    });
    expect(responseSignIn.statusCode).toBe(302);
    // после успешной аутентификации получаем куки из ответа,
    // они понадобятся для выполнения запросов на маршруты требующие
    // предварительную аутентификацию
    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookies = { [name]: value };

    // send data with no cookies (and no authorizing)
    const unauthorizedResponse = await app.inject({
      method: 'DELETE',
      url: app.reverse('delete user', { id: exisitngUser.id }),
      // используем полученные ранее куки
      // cookies,
    });
    const unauthorizedUser = await models.user.query().findOne({ id: exisitngUser.id });
    const unauthorizedUsers = await models.user.query();
    const unauthorizedData = _.pick(unauthorizedUser, ['id', 'firstName', 'lastName', 'email', 'newPasswordDigest']);
    expect(unauthorizedResponse.statusCode).toBe(302);
    expect(unauthorizedData).toMatchObject(standartData);
    expect(unauthorizedUsers.length).toBe(standartUsersCount);

    // send data to notexistent id
    const max = await models.user.query().max('id as value').first();
    const nonexistentResponse = await app.inject({
      method: 'DELETE',
      url: app.reverse('delete user', { id: (max.value + 1) }),
      // используем полученные ранее куки
      cookies,
    });
    const nonexistentUser = await models.user.query().findOne({ id: exisitngUser.id });
    const nonexistentData = _.pick(nonexistentUser, ['id', 'firstName', 'lastName', 'email', 'newPasswordDigest']);
    const nonexistentUsers = await models.user.query();
    expect(nonexistentResponse.statusCode).toBe(302);
    expect(nonexistentData).toMatchObject(standartData);
    expect(nonexistentUsers.length).toBe(standartUsersCount);
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
