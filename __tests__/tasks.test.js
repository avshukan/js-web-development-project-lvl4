// @ts-check
import getApp from '../server/index.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  let cookies;
  let unrealId;
  let oldTaskCount;
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
    unrealId = await models.task.query().max('id as max').first().then(({ max }) => max) + 1;
    oldTaskCount = await models.task.query().count('id', { as: 'count' }).then(([data]) => data.count);
    standartParams = testData.statuses.standart;
    standartStatus = await models.task.query().findOne({ name: standartParams.name });
  });

  describe('test tasks create', () => {
    test.todo('success: create new task');
    test.todo('fail: create new task without auth');
    test.todo('fail: create new task with empty name');
    test.todo('fail: create new task with unreal statusId');
  });

  describe('test tasks read', () => {
    test.todo('success: get page of tasks list');
    test.todo('fail: get page of tasks list without auth');
    test.todo('success: get page to create task');
    test.todo('fail: get page to create task without auth');
    test.todo('success: get page to show task');
    test.todo('fail: get page to show task without auth');
    test.todo('fail: get page to show task with unreal taskId');
    test.todo('success: get page to update task');
    test.todo('fail: get page to update task without auth');
    test.todo('fail: get page to update task with unreal taskId');
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
