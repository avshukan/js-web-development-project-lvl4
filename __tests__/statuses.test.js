// @ts-check

// import _ from 'lodash';
import { toUnicode } from 'punycode';
import getApp from '../server/index.js';
// import encrypt from '../server/lib/secure.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test statuses CRUD', () => {
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

  describe('test statuses create', () => {
    test.todo('success: create new status');
    test.todo('fail: create new status without auth');
    test.todo('fail: create new nonuniq name');
    test.todo('fail: create new empty name');
  });

  describe('test statuses read', () => {
    test.todo('success: get page of statuses list');
    test.todo('success: get page of status edit');
    test.todo('fail: get page of statuses without auth');
    test.todo('fail: get page of status edit without auth');
  });

  describe('test statuses update', () => {
    test.todo('success: update status');
    test.todo('fail: update status without auth');
    test.todo('fail: update status with nonuniq name');
    test.todo('fail: update status with empty name');
    test.todo('fail: update status with nonexistent id');
  });

  describe('test statuses delete', () => {
    test.todo('success: delete status');
    test.todo('fail: delete status without auth');
    test.todo('fail: delete status with nonexistent id');
  });

  // it('page list success', async () => {
  //   const response = await app.inject({
  //     method: 'GET',
  //     url: app.reverse('page of users list'),
  //   });
  //   expect(response.statusCode).toBe(200);
  // });
  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
