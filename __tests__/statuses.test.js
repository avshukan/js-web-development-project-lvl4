// @ts-check

// import _ from 'lodash';
import getApp from '../server/index.js';
// import encrypt from '../server/lib/secure.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  let cookies;
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
    // авторизация
    const authParams = testData.users.olddata;
    const authResponse = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data: authParams,
      },
    });
    // после успешной аутентификации получаем куки из ответа,
    // они понадобятся для выполнения запросов на маршруты требующие
    // предварительную аутентификацию
    const [sessionCookie] = authResponse.cookies;
    const { name, value } = sessionCookie;
    cookies = { [name]: value };
  });

  describe('test statuses create', () => {
    // test.todo('success: create new status');
    test.todo('fail: create new status without auth');
    test.todo('fail: create new nonuniq name');
    test.todo('fail: create new empty name');

    it('success: create new status', async () => {
      const oldCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      const newStatusParams = testData.statuses.new;
      const response = await app.inject({
        method: 'POST',
        url: app.reverse('create status'),
        payload: {
          data: newStatusParams,
        },
        cookies,
      });
      const newStatus = await models.status.query().findOne({ name: newStatusParams.name });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newStatus).toMatchObject(newStatusParams);
      expect(newCount).toBe(oldCount + 1);
    });
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

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
