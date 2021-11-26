// @ts-check

module.exports = {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          unauthorized: 'Не достаточно прав для выполнения операции',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Не удалось обновить',
          unauthorized: 'Не достаточно прав для выполнения операции',
          success: 'Пользователь успешно обновлён',
        },
        delete: {
          error: 'Не удалось удалить',
          unauthorized: 'Не достаточно прав для выполнения операции',
          success: 'Пользователь успешно удалён',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        account: 'Аккаунт',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        profile: 'Профиль',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
          labels: {
            email: 'Email',
            password: 'Пароль',
          },
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Дата создания',
        update: 'Редактировать',
        delete: 'Удалить',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
          labels: {
            firstName: 'Имя',
            lastName: 'Фамилия',
            email: 'Email',
            password: 'Пароль',
          },
        },
        edit: {
          submit: 'Сохранить',
          edit: 'Редактирование',
          labels: {
            firstName: 'Имя',
            lastName: 'Фамилия',
            email: 'Email',
            password: 'Пароль',
          },
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
