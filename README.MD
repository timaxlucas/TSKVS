# TSKVS (totally secure key value storage)

Note: The service at `172.16.3.13:8080` restarts every 30 minutes and storage is not persistent.

Demo User: `snowman`, password: `iceberg`


## Requirements

Tested with Node 14/15/16 (presumably working with earlier version too)

## Development

Generate certificate for https: `openssl req -nodes -new -x509 -keyout keys/server.key -out keys/server.cert`
    
    $ npm install
    $ npm start


## Usage



### Authentication

#### Request

`POST /authenticate`

    curl -i -d 'username=user1&password=password1' -k https://172.16.3.13:8080/authenticate

#### Response

    { "ok":true, "token":"<token>" }

### Put

#### Request

`PUT /`

    curl -k https://172.16.3.13:8080/ \
        -H "Authorization: Bearer <token>" \
        -X PUT \
        -d 'key=key&value=value'

#### Response

    { "ok":true }

### List

#### Request

`GET /`

    curl -k https://172.16.3.13:8080/ \
        -H "Authorization: Bearer <token>" \

#### Response

    { "ok":true, "data": ["key1", "key2", "key3"] }

### Get

#### Request

`GET /<key>`

    curl -k https://172.16.3.13:8080/<key> \
        -H "Authorization: Bearer <token>" \

#### Response

    {"ok":true,"value":"value"}


### Delete

#### Request

`DELETE /<key>`

    curl -k https://172.16.3.13:8080/<key> \
        -H "Authorization: Bearer <token>" \
        -X DELETE

#### Response

    { "ok":true }


