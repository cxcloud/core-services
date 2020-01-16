# Mimic

Service to create mockserver with with zero configuration.
Mimic uses express server with useful middlewares to provide simple
application to create mock responses.

# Getting started

```bash
# Create app folder with templates
mkdir -p mock/templates

# Init npm
cd mock && npm init -y

# Install
npm i @cxcloud/mimic
npx mimic --version
npx mimic --help

# Create main file
cat << EOF > main.js
const { Mimic } = require('@cxcloud/mimic');
Mimic.root.get('/greet', (req, res) => {
    res.json({
        data: 'hello world!'
    })
});
EOF

# Start mimic
DEBUG=mimic* npx mimic

# To use separate base folder
mkdir subfolder
mv templates subfolder/
mv main.js subfolder/
# mock/subfolder/
# ├── main.js
# └── templates

# Start mocking application in another folder and port
DEBUG=mimic* npx mimic -d subfolder -p 3000
```

# Usage

```javascript
// main.js
const { Mimic } = require('@cxcloud/mimic');

Mimic.root.get('/greet', (req, res) => {
  res.json({
    data: 'hello world!'
  });
});
```

Mimic.root is basically express router mounted at root '/'
For Router mapping see [Express routing](https://expressjs.com/en/guide/routing.html)

## Examples

### Return xml document using template

Directory structure

```
root
 |- templates
 |    `- user.ejs
 `- main.js
```

Template file

```html
<!-- templates/user.ejs -->
<user><%= user.name %></user>
```

Route mapping

```javascript
// main.js
const { Mimic } = require('@cxcloud/mimic');

const users = [{ name: 'user-one' }, { name: 'user-two' }];

Mimic.root.post('/users/:userId', (req, res) => {
  res.type('text/xml; charset=utf-8');
  const userId = parseInt(req.params.userId);
  res.render('user', {
    user: users[userId - 1]
  });
});
```

In above example requesting

- POST /users/1 '<>...</>' will return user-one xml
- POST /users/2 '<>...</>' will return user-two xml

### Return respective response via request hashes

Each request uniquely generates hash from method, url and body. This
hash can be used to respond with respective data;

```javascript
const fruits = {
  'af7f992f-8489a5de': { name: 'apple' },
  'af7f992f-84a91dee': { name: 'banana' }
};

Mimic.root.post('/fruits', (req, res) => {
  const requestHash = res.locals.requestHash.combined;
  const data = fruits[requestHash];
  if (!data) {
    throw Error('Not found');
  }
  res.json(data);
});
```

In above example requesting

- POST /fruits { "id": "a" } will generate hash "af7f992f-8489a5de"
- POST /fruits { "id": "b" } will generate hash "af7f992f-84a91dee"

requestHash can be obtained via res.locals.requestHash object

```
{
    methodUrl: string;  // hash of method+url
    body: string;       // hash of body if exists or is empty
    combined: string;   // combiniation of hashes of methodUrl and body
}
```
