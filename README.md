## news-explorer-api

Ссылка на проект: [news-explorer-api](https://api.newsapp.ga "REST API проекта NewsExplorer")

Текущая версия: **v0.0.1**

## Что это за проект?

REST API проект NewsExplorer :floppy_disk:

## Ссылки:

Фронтенд проекта:

`newsapp.ga`

`www.newsapp.ga`

Бэкенд проекта:

`api.newsapp.ga`

`www.api.newsapp.ga`

`84.201.165.252`

***Доступ возможен по протоколам http и https, лицензия - Let's Encrypt.***

## Запуск и настройка:

#### Клонируем приложение:

    https://github.com/ko1p/news-explorer-api.git

#### Настройка:

Проект работает с MongoDB, по умолчанию подключение происходит по адресу:

_mongodb://localhost:27017/news-explorer-api_

поменять настройки можно в конфигурационном файле **config.js**, находящемся в корне проекта.

При запуске проекта в режиме production предварительно необходимо создать файл формата .env и указать ключ для шифрования): 
```
  NODE_ENV=production
  JWT_SECRET=some_key
```
Сгенерировать ключ автоматически можно введя следующую команду в консоль:

    node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"

#### Установка необходимых модулей
Введите в терминале следующие команды:

    npm install
#### Запуск MongoDB
    mongod
#### Запуск приложения
В режиме production (необходима предварительная настройка)

    node run start
    
или в режиме разработки с функцией "Hot Reload"

    node run dev 

### Список возможных запросов:

Перед началом работы необходима предварительная регистрация (POST/signup) и аутентификации (POST/signin).

**POST /signup**

Регистрация нового пользователя. В теле POST-запроса передаётся JSON-объект с именем пользователя, адресом электронной почты, паролем, краткой информацией о себе и ссылкой на аватар:
```json
// JSON
{
  "name": "userName",
  "email": "awesome@mail.net",
  "password": "123456789",
}
```
**POST /signin**

Авторизация пользователя после регистрации. В теле POST-запроса передаётся JSON-объект с информацией указанной при регистрации:
```json
// JSON
{
	"email": "awesome@mail.net",
	"password": "123456789"
}
```

**GET /users/me**

Возвращает информацию о пользователе (email и имя).

**GET /articles** 

Возвращает все сохранённые пользователем статьи.

**POST /articles** 

Создание статьи. В теле POST-запроса передаётся JSON-объект с названием статьи и ссылкой на её изображение:
```json
// JSON
{
  "keyword": "Ключевое слово",
  "title": "Заголовок",
  "text": "Текст статьи",
  "date": "24.06.2020",
  "source": "РИА",
  "link": "https://ria.ru/20200624/1573406779.html",
  "image": "https://cdn25.img.ria.ru/images/07e4/06/18/1573409066_0:98:3293:1950_600x0_80_0_0_5034215b82f1e18422bac73ae666c892.jpg.webp"
}
```

**DELETE /articles/articleId**

Удаляет сохранённую статью  по _id


###  Используемые технологии:

- JS
- Git
- Node.js (express)
- MongoDB

###  Используемые модули:

- body-parser
- helmet
- dotenv
- jsonwebtoken
- bcryptjs
- validator
- cookieParser
- rateLimit
- celebrate
