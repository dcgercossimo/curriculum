import database from 'infra/database';

async function create(userInput) {
  const { username, email, password } = userInput;
  const results = await database.query({
    text: `
      INSERT INTO
        users (username, email, password)
      VALUES
        ($1, $2, $3)
      RETURNING
        *
      ;`,
    values: [username, email, password],
  });
  return results.rows[0];
}

async function findByEmail(email) {
  const results = await database.query({
    text: `
      SELECT
        id, username, email, created_at, updated_at
      FROM
        users
      WHERE
        email = $1
      ;`,
    values: [email],
  });
  return results.rows[0];
}

async function findByUsername(username) {
  const results = await database.query({
    text: `
      SELECT
        id, username, email, created_at, updated_at
      FROM
        users
      WHERE
        username = $1
      ;`,
    values: [username],
  });
  return results.rows[0];
}

async function findAll() {
  const results = await database.query({
    text: `
      SELECT
        id, username, email, created_at, updated_at
      FROM
        users
      ;`,
  });
  return results.rows;
}

async function changePassword(userImput) {
  const { email, password } = userImput;
  const results = await database.query({
    text: `
      UPDATE
        users
      SET
        password = $2
      WHERE
        email = $1
      RETURNING
        *
      ;`,
    values: [email, password],
  });
  return results.rows[0];
}

async function deleteByEmail(email) {
  const results = await database.query({
    text: `
      DELETE FROM
        users
      WHERE
        email = $1
      RETURNING
        *
      ;`,
    values: [email],
  });
  return results.rows[0];
}

const user = {
  create,
  findByEmail,
  findByUsername,
  findAll,
  changePassword,
  deleteByEmail,
};

export default user;
