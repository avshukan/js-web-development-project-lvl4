// @ts-check
import getApp from '../server/index.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test labels CRUD', () => {
  let app;
  let knex;
  let models;
  let cookies;
  let unrealLabelId;
  let countBefore;
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
    const authParams = testData.users.authUser;
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
    unrealLabelId = await models.label.query().max('id as max').first().then(({ max }) => max) + 1;
    countBefore = await models.label.query().count('id', { as: 'count' }).then(([data]) => data.count);
  });

  describe('test label create', () => {
    it('success: create new label', async () => {
      const newParams = testData.labels.new;
      const labelBefore = await models.label.query().findOne({ name: newParams.name });
      const response = await app.inject({
        method: 'POST',
        url: app.reverse('create label'),
        payload: {
          data: newParams,
        },
        cookies,
      });
      const labelAfter = await models.label.query().findOne({ name: newParams.name });
      const countAfter = await models.label.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(labelBefore).toBeUndefined();
      expect(labelAfter).toMatchObject(newParams);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('fail: create new label without auth', async () => {
      const newParams = testData.labels.new;
      const labelBefore = await models.label.query().findOne({ name: newParams.name });
      const response = await app.inject({
        method: 'POST',
        url: app.reverse('create label'),
        payload: {
          data: newParams,
        },
        // cookies,
      });
      const labelAfter = await models.label.query().findOne({ name: newParams.name });
      const countAfter = await models.label.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(labelBefore).toBeUndefined();
      expect(labelAfter).toBeUndefined();
      expect(countAfter).toBe(countBefore);
    });

    it('fail: create new label with empty name', async () => {
      const emptyParams = testData.labels.empty;
      const labelBefore = await models.label.query().findOne({ name: emptyParams.name });
      const response = await app.inject({
        method: 'POST',
        url: app.reverse('create label'),
        payload: {
          data: emptyParams,
        },
        cookies,
      });
      const labelAfter = await models.label.query().findOne({ name: emptyParams.name });
      const countAfter = await models.label.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(labelBefore).toBeUndefined();
      expect(labelAfter).toBeUndefined();
      expect(countAfter).toBe(countBefore);
    });

    it('fail: create new label with nonunique name', async () => {
      // берём первую метку
      const labelBefore = await models.label.query().first();
      // убеждаемся, что метка существует
      expect(labelBefore).toBeDefined();
      const response = await app.inject({
        method: 'POST',
        url: app.reverse('create label'),
        payload: {
          data: { name: labelBefore.name },
        },
        cookies,
      });
      const countAfter = await models.label.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(countAfter).toBe(countBefore);
    });
  });

  describe('test label read', () => {
    test.todo('success: get page of labels list');
    test.todo('fail: get page of labels list without auth');
    test.todo('success: get page of create label');
    test.todo('fail: get page of create label without auth');
    test.todo('success: get page of update label');
    test.todo('fail: get page of update label without auth');
    test.todo('fail: get page of update label with unreal label id');
  });

  describe('test label update', () => {
    // берём первую метку
    // labelBefore = await models.label.query().first();
    // убеждаемся, что метка существует
    // expect(labelBefore).toBeDefined();
    test.todo('success: update label');
    test.todo('fail: update label without auth');
    test.todo('fail: update label with empty name');
    test.todo('fail: update label with nonunque name');
  });

  describe('test label delete', () => {
    test.todo('success: delete label');
    test.todo('fail: delete label without auth');
    test.todo('fail: delete label with unreal label id');
    test.todo('fail: delete label with tasks');
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
