// @ts-check
import getApp from '../server/index.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  let cookies;
  let unrealTaskId;
  let countBefore;
  let standartParams;
  let standartTask;
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
    unrealTaskId = await models.task.query().max('id as max').first().then(({ max }) => max) + 1;
    countBefore = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
    standartParams = testData.tasks.standart;
    standartTask = await models.task.query().findOne({ name: standartParams.name });
  });

  describe('test tasks create', () => {
    it('success: create new task', async () => {
      const newTaskParams = testData.tasks.new;
      const response = await app.inject({
        method: 'POST',
        url: app.reverse('create task'),
        payload: {
          data: newTaskParams,
        },
        cookies,
      });
      const newTask = await models.task.query().findOne({ name: newTaskParams.name });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newTask).toMatchObject(newTaskParams);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('fail: create new task without auth', async () => {
      const newTaskParams = testData.tasks.new;
      const response = await app.inject({
        method: 'POST',
        url: app.reverse('create task'),
        payload: {
          data: newTaskParams,
        },
        // cookies,
      });
      const newTask = await models.task.query().findOne({ name: newTaskParams.name });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(newTask).toBeUndefined();
      expect(countAfter).toBe(countBefore);
    });

    it('fail: create new task with empty name', async () => {
      const emptyTaskParams = testData.tasks.empty;
      const response = await app.inject({
        method: 'POST',
        url: app.reverse('create task'),
        payload: {
          data: emptyTaskParams,
        },
        cookies,
      });
      const newTask = await models.task.query().findOne({ name: emptyTaskParams.name });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(422);
      expect(newTask).toBeUndefined();
      expect(countAfter).toBe(countBefore);
    });

    it('fail: create new task with unreal statusId', async () => {
      const unrealTaskParams = testData.tasks.unrealStatus;
      const response = await app.inject({
        method: 'POST',
        url: app.reverse('create task'),
        payload: {
          data: unrealTaskParams,
        },
        cookies,
      });
      const newTask = await models.task.query().findOne({ name: unrealTaskParams.name });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(422);
      expect(newTask).toBeUndefined();
      expect(countAfter).toBe(countBefore);
    });
  });

  describe('test tasks read', () => {
    it('success: get page of tasks list', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page of tasks list'),
        cookies,
      });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(200);
      expect(countAfter).toBe(countBefore);
    });

    it('fail: get page of tasks list without auth', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page of tasks list'),
        // cookies,
      });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(countAfter).toBe(countBefore);
    });

    it('success: get page to create task', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page to create task'),
        cookies,
      });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(200);
      expect(countAfter).toBe(countBefore);
    });

    it('fail: get page to create task without auth', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page to create task'),
        // cookies,
      });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(countAfter).toBe(countBefore);
    });

    it('success: get page to show task', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page to show task', { id: standartTask.id }),
        cookies,
      });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(200);
      expect(countAfter).toBe(countBefore);
    });

    it('fail: get page to show task without auth', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page to show task', { id: standartTask.id }),
        // cookies,
      });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(countAfter).toBe(countBefore);
    });

    it('fail: get page to show task with unreal taskId', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page to show task', { id: unrealTaskId }),
        cookies,
      });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(countAfter).toBe(countBefore);
    });

    it('success: get page to update task', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page to update task', { id: standartTask.id }),
        cookies,
      });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(200);
      expect(countAfter).toBe(countBefore);
    });

    it('fail: get page to update task without auth', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page to update task', { id: standartTask.id }),
        // cookies,
      });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(countAfter).toBe(countBefore);
    });

    it('fail: get page to update task with unreal taskId', async () => {
      const response = await app.inject({
        method: 'GET',
        url: app.reverse('page to update task', { id: unrealTaskId }),
        cookies,
      });
      const countAfter = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
      expect(response.statusCode).toBe(302);
      expect(countAfter).toBe(countBefore);
    });
  });

  describe('test statuses update', () => {
    test.todo('success: update task');
    test.todo('fail: update task without auth');
    test.todo('fail: update task with empty name');
    test.todo('fail: update task with unreal taskId');
  });

  describe('test statuses delete', () => {
    test.todo('success: delete task');
    test.todo('fail: delete status without auth');
    test.todo('fail: delete status by no creator');
    test.todo('fail: delete status with unreal taskId');
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    await knex.migrate.rollback();
  });

  afterAll(() => {
    app.close();
  });
});
