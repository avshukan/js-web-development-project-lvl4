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
  let maxId;
  let oldCount;
  let standartParams;
  let standartStatus;
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
    maxId = await models.status.query().max('id as max').first().then(({ max }) => max);
    oldCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
    standartParams = testData.statuses.standart;
    standartStatus = await models.status.query().findOne({ name: standartParams.name });
  });

  describe('test statuses create', () => {
    it('success: create new status', async () => {
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

    it('fail: create new status without auth', async () => {
      const newStatusParams = testData.statuses.new;
      const response = await app.inject({
        method: 'POST',
        url: app.reverse('create status'),
        payload: {
          data: newStatusParams,
        },
        // cookies,
      });
      const newStatus = await models.status.query().findOne({ name: newStatusParams.name });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newStatus).toBeUndefined();
      expect(newCount).toBe(oldCount);
    });

    it('fail: create new nonuniq name', async () => {
      const response = await app.inject({
        method: 'POST',
        url: app.reverse('create status'),
        payload: {
          data: standartParams,
        },
        cookies,
      });
      const newStatus = await models.status.query().findOne({ name: standartParams.name });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(422);
      expect(newStatus).toMatchObject(standartParams);
      expect(newCount).toBe(oldCount);
    });

    it('fail: create new empty name', async () => {
      const params = testData.statuses.empty;
      const response = await app.inject({
        method: 'POST',
        url: app.reverse('create status'),
        payload: {
          data: params,
        },
        cookies,
      });
      const newStatus = await models.status.query().findOne({ name: params.name });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(422);
      expect(newStatus).toBeUndefined();
      expect(newCount).toBe(oldCount);
    });
  });

  describe('test statuses read', () => {
    it('success: get page of statuses list', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page of statuses list'),
        cookies,
      });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(200);
      expect(newCount).toBe(oldCount);
    });

    it('fail: get page of statuses list without auth', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page of statuses list'),
        // cookies,
      });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newCount).toBe(oldCount);
    });

    it('success: get page to create status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page to create status'),
        cookies,
      });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(200);
      expect(newCount).toBe(oldCount);
    });

    it('fail: get page to create status without auth', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page to create status'),
        // cookies,
      });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newCount).toBe(oldCount);
    });

    it('success: get page to update status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page to update status', { id: standartStatus.id }),
        cookies,
      });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(200);
      expect(newCount).toBe(oldCount);
    });

    it('fail: get page to update status without auth', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page to update status', { id: standartStatus.id }),
        // cookies,
      });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newCount).toBe(oldCount);
    });

    it('fail: get page to update status with unreal id', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page to update status', { id: maxId + 1 }),
        // cookies,
      });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newCount).toBe(oldCount);
    });
  });

  describe('test statuses update', () => {
    it('success: update status', async () => {
      const newStatusParams = testData.statuses.new;
      const response = await app.inject({
        method: 'PATCH',
        url: app.reverse('update status', { id: standartStatus.id }),
        payload: {
          data: newStatusParams,
        },
        cookies,
      });
      const newStatus = await models.status.query().findOne({ id: standartStatus.id });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newStatus).toMatchObject(newStatusParams);
      expect(newCount).toBe(oldCount);
    });

    it('fail: update status without auth', async () => {
      const newStatusParams = testData.statuses.new;
      const response = await app.inject({
        method: 'PATCH',
        url: app.reverse('update status', { id: standartStatus.id }),
        payload: {
          data: newStatusParams,
        },
        // cookies,
      });
      const newStatus = await models.status.query().findOne({ id: standartStatus.id });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newStatus).toMatchObject(standartParams);
      expect(newCount).toBe(oldCount);
    });

    it('fail: update status with nonuniq name', async () => {
      const existsParams = testData.statuses.exists;
      const response = await app.inject({
        method: 'PATCH',
        url: app.reverse('update status', { id: standartStatus.id }),
        payload: {
          data: existsParams,
        },
        cookies,
      });
      const newStatus = await models.status.query().findOne({ id: standartStatus.id });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(422);
      expect(newStatus).toMatchObject(standartParams);
      expect(newCount).toBe(oldCount);
    });

    it('fail: update status with empty name', async () => {
      const emptyStatusParams = testData.statuses.empty;
      const response = await app.inject({
        method: 'PATCH',
        url: app.reverse('update status', { id: standartStatus.id }),
        payload: {
          data: emptyStatusParams,
        },
        cookies,
      });
      const newStatus = await models.status.query().findOne({ id: standartStatus.id });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(422);
      expect(newStatus).toMatchObject(standartParams);
      expect(newCount).toBe(oldCount);
    });

    it('fail: update status with nonexistent id', async () => {
      const newStatusParams = testData.statuses.new;
      const response = await app.inject({
        method: 'PATCH',
        url: app.reverse('update status', { id: maxId + 1 }),
        payload: {
          data: newStatusParams,
        },
        cookies,
      });
      const newStatus = await models.status.query().findOne({ id: maxId + 1 });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newStatus).toBeUndefined();
      expect(newCount).toBe(oldCount);
    });
  });

  describe('test statuses delete', () => {
    it('success: delete status', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: app.reverse('delete status', { id: standartStatus.id }),
        cookies,
      });
      const newStatus = await models.status.query().findOne({ id: standartStatus.id });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newStatus).toBeUndefined();
      expect(newCount).toBe(oldCount - 1);
    });

    it('fail: delete status without auth', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: app.reverse('delete status', { id: standartStatus.id }),
        // cookies,
      });
      const newStatus = await models.status.query().findOne({ id: standartStatus.id });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newStatus).toMatchObject(standartParams);
      expect(newCount).toBe(oldCount);
    });

    it('fail: delete status with nonexistent id', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: app.reverse('delete status', { id: maxId + 1 }),
        // cookies,
      });
      const newCount = await models.status.query().count('name', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newCount).toBe(oldCount);
    });
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
