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
          unauthorized: 'Не достаточно прав для создания пользователя',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Не удалось обновить',
          unauthorized: 'Не достаточно прав для редактирования пользователя',
          success: 'Пользователь успешно обновлён',
        },
        delete: {
          error: 'Не удалось удалить',
          unauthorized: 'Не достаточно прав для удаления пользователя',
          success: 'Пользователь успешно удалён',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          unauthorized: 'Не достаточно прав для создания статуса',
          success: 'Статус успешно создан',
        },
        update: {
          error: 'Не удалось обновить статус',
          unauthorized: 'Не достаточно прав для редактирования статуса',
          success: 'Статус успешно обновлён',
        },
        delete: {
          error: 'Не удалось удалить статус',
          unauthorized: 'Не достаточно прав для удаления статуса',
          success: 'Статус успешно удалён',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        tasks: 'Задачи',
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
      statuses: {
        id: 'ID',
        name: 'Статус',
        createdAt: 'Дата создания',
        create: 'Добавить',
        update: 'Редактировать',
        delete: 'Удалить',
        new: {
          submit: 'Сохранить',
          header: 'Создание статуса',
          labels: {
            name: 'Название',
          },
        },
        edit: {
          submit: 'Сохранить',
          header: 'Редактирование статуса',
          labels: {
            name: 'Название',
          },
        },
      },
      tasks: {
        labels: {
          id: 'ID',
          name: 'Наименование',
          description: 'Описание',
          statusId: 'Статус',
          creatorId: 'Автор',
          executorId: 'Исполнитель',
          createdAt: 'Дата создания',
        },
        controls: {
          create: 'Добавить',
          update: 'Редактировать',
          delete: 'Удалить',
        },
        list: {
          header: 'Список задач',
        },
        new: {
          header: 'Создание статуса',
          submit: 'Создать',
        },
        edit: {
          header: 'Редактирование статуса',
        },
      },
      users: {
        id: 'ID',
        firstName: 'Имя',
        lastName: 'Фамилия',
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
