## Отзыв refresh токенов (выход из системы)
```
Route: /logout
Method: GET
Headers: {
  Authorization: Bearer access-token
}
```

#### Параметры запроса
```js
{
  refreshToken: [String, 'required'],
}
```

#### Ответ
```js
// Status Code: 200
{
  message: "Successfully logged out.",
}
```

#### Ошибки
```js
// Status Code 410
{ message: 'Already logged out.' }
```
А также ошибки `Ошибка авторизации`, `Некорректный заголовок Accept`, описанные в **/errors/general.md**.