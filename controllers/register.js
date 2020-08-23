/* eslint-disable max-params */

const handleRegister = (db, bcrypt) => (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission')
  }
  // eslint-disable-next-line no-sync
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      }).
      into('login').
      returning('email').
      // eslint-disable-next-line arrow-body-style
      then(loginEmail => {
        return trx('users').
          returning('*').
          insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          }).
          then(user => {
            res.json(user[0]);
          })
      }).
      then(trx.commit).
      catch(trx.rollback)
  })
//  .catch(res.status(400).json('unable to register'))
}

module.exports = {
  handleRegister: handleRegister
}
