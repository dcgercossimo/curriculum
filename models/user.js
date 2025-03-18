import database from 'infra/database';
import { ValidationError } from 'infra/errors.js';

async function create(userInput) {
  await validateUniqueEmail(userInput.email);
  await validateUniqueUsername(userInput.username);

  const newUser = await runInsertQuery(userInput);
  return newUser;

  async function validateUniqueEmail(email) {
    const user = await findByEmail(email);
    if (user) {
      throw new ValidationError({
        message: 'O e-mail informado já está em uso',
        action: 'Utilize outro e-mail para realizar o cadastro',
      });
    }
  }

  async function validateUniqueUsername(username) {
    const user = await findByUsername(username);
    if (user) {
      throw new ValidationError({
        message: 'O Username informado já está em uso',
        action: 'Utilize outro username para realizar o cadastro',
      });
    }
  }

  async function runInsertQuery(userInput) {
    const { username, email, password } = userInput;
    const results = await database.query({
      text: `
        INSERT INTO
          users (username, email, password)
        VALUES
          ($1, LOWER($2), $3)
        RETURNING
          *
        ;`,
      values: [username, email, password],
    });
    return results.rows[0];
  }
}

async function findByEmail(email) {
  const results = await database.query({
    text: `
      SELECT
        id, username, email, created_at, updated_at
      FROM
        users
      WHERE
        email = LOWER($1)
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
        username ~* $1
      ;`,
    values: [`^${username}$`],
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
