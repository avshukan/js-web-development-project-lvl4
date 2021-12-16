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
      labels: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        update: {
          error: 'Не удалось обновить метку',
          success: 'Метка успешно обновлена',
        },
        delete: {
          error: 'Не удалось удалить метку',
          success: 'Метка успешно удалена',
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
      tasks: {
        show: {
          error: 'Не удалось загрузить задачу',
        },
        edit: {
          error: 'Не удалось загрузить задачу',
        },
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        update: {
          error: 'Не удалось обновить задачу',
          success: 'Задача успешно обновлёна',
        },
        delete: {
          error: 'Не удалось удалить задачу',
          success: 'Задача успешно удалёна',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        tasks: 'Задачи',
        statuses: 'Статусы',
        labels: 'Метки',
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
      labels: {
        labels: {
          id: 'ID',
          name: 'Наименование',
          createdAt: 'Дата создания',
        },
        controls: {
          create: 'Добавить',
          update: 'Редактировать',
          delete: 'Удалить',
        },
        list: {
          header: 'Список меток',
        },
        new: {
          header: 'Создание метки',
          submit: 'Создать',
        },
        edit: {
          header: 'Редактирование метки',
          submit: 'Сохранить',
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
          labels: 'Метки',
          executorId: 'Исполнитель',
          createdAt: 'Дата создания',
          isCreatorUser: 'Мои задачи',
        },
        controls: {
          filter: 'Показать',
          create: 'Добавить',
          update: 'Редактировать',
          delete: 'Удалить',
        },
        list: {
          header: 'Список задач',
        },
        show: {
          header: 'Карточка задачи',
        },
        new: {
          header: 'Создание задачи',
          submit: 'Создать',
        },
        edit: {
          header: 'Редактирование задачи',
          submit: 'Сохранить',
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
