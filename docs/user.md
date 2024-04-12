# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username": "Rizal",
  "password": "rahasia",
  "name": "Rizal Pradana"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "rizal",
    "name": "Rizal Pradana"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Username must not blank, ..."
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "rizal",
  "password": "rahasia"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "rizal",
    "name": "Rizal Pradana",
    "token": "uuid"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Username or password wrong, ..."
}
```

## Get User

Endpoint : GET /api/users/current

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": {
    "username": "rizal",
    "name": "Rizal Pradana"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Update User

Endpoint : PATCH /api/users/current

Request Header :

- X-API-TOKEN : token

Request Body :

```json
{
  "password": "rahasia", // tidak wajib
  "name": "Rizal Pradana" // tidak wajib
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "rizal",
    "name": "Rizal Pradana"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Logout User

Endpoint : DELETE /api/users/current

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": "OK"
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```
