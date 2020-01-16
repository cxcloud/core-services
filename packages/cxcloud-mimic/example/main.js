const { Mimic } = require('../dist/index');

Mimic.root.get('/greet', (req, res) => {
  res.json({
    data: 'hello world!'
  });
});

const users = [{ name: 'user-one' }, { name: 'user-two' }];

Mimic.root.post('/users/:userId', (req, res) => {
  res.type('text/xml; charset=utf-8');
  const userId = parseInt(req.params.userId);
  res.render('user', {
    user: users[userId - 1]
  });
});

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
