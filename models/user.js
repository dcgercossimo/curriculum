import database from 'infra/database';
import { NotFoundError, ValidationError } from 'infra/errors.js';
import password from './password.js';

async function create(userInput) {
  await validateUniqueEmail(userInput.email);
  await validateUniqueUsername(userInput.username);
  await validateUniquePhone(userInput.phone);
  await hashPasswordInObject(userInput);

  const newUser = await runInsertQuery(userInput);
  return newUser;

  async function runInsertQuery(userInput) {
    const { username, email, phone, password } = userInput;
    const results = await database.query({
      text: `
        INSERT INTO
          users (username, email, phone, password)
        VALUES
          ($1, LOWER($2), $3, $4)
        RETURNING
          *
        ;`,
      values: [username, email, phone, password],
    });
    return results.rows[0];
  }
}

async function readOneByUsername(username) {
  const userFound = await findOneByUsername(username);
  if (!userFound) {
    throw new NotFoundError({
      message: 'Usuário não encontrado',
      action: 'Verifique se o username está correto e tente novamente',
    });
  }
  return userFound;
}

async function update(existingUser, userInput) {
  await mergeUserInputWithExistingUser(existingUser, userInput);
  await hashPasswordInObject(userInput);

  const updatedUser = await runUpdateQuery(existingUser.id, userInput);
  return updatedUser;

  async function runUpdateQuery(id, userInput) {
    const { email, phone } = userInput;
    const results = await database.query({
      text: `
        UPDATE
          users
        SET
          email = LOWER($2),
          phone = $3,
          updated_at = current_timestamp
        WHERE
          id = $1
        RETURNING
          *
        ;`,
      values: [id, email, phone],
    });
    return results.rows[0];
  }
}

async function changePassword(existingUser, userInput) {
  await validatePassword(userInput);
  await hashPasswordInObject(userInput);

  const updatedUser = await runChangePassword(existingUser.id, userInput);
  return updatedUser;

  async function runChangePassword(id, userInput) {
    const { password } = userInput;
    const results = await database.query({
      text: `
        UPDATE
          users
        SET
          password = $2,
          updated_at = current_timestamp
        WHERE
          id = $1
        RETURNING
          *
        ;`,
      values: [id, password],
    });
    return results.rows[0];
  }
}

async function mergeUserInputWithExistingUser(existingUser, userInput) {
  if (!userInput.email) {
    userInput.email = existingUser.email;
  } else if (userInput.email !== existingUser.email) {
    await validateUniqueEmail(userInput.email);
  }

  if (!userInput.phone) {
    userInput.phone = existingUser.phone;
  } else if (userInput.phone !== existingUser.phone) {
    await validateUniquePhone(userInput.phone);
  }
}

async function validateUniqueEmail(email) {
  const user = await findOneByEmail(email);
  if (user) {
    throw new ValidationError({
      message: `O e-mail informado já está em uso`,
      action: 'Utilize outro e-mail para realizar o cadastro',
    });
  }
}

async function validateUniqueUsername(username) {
  const user = await findOneByUsername(username);
  if (user) {
    throw new ValidationError({
      message: 'O Username informado já está em uso',
      action: 'Utilize outro username para realizar o cadastro',
    });
  }
}

async function validateUniquePhone(phone) {
  const user = await findOneByPhone(phone);
  if (user) {
    throw new ValidationError({
      message: `O celular informado já está em uso`,
      action: 'Utilize outro celular para realizar o cadastro',
    });
  }
}

async function validatePassword(userInput) {
  if (!userInput.password) {
    throw new ValidationError({
      message: 'Senha não informada',
      action: 'Informe uma senha para realizar a alteração',
    });
  }
  if (userInput.password.length < 6) {
    throw new ValidationError({
      message: 'Senha muito curta',
      action: 'A senha deve ter no mínimo 6 caracteres',
    });
  }
}

async function hashPasswordInObject(userInput) {
  const hashedPassword = await password.hash(userInput.password);
  userInput.password = hashedPassword;
}

async function findOneByEmail(email) {
  const results = await database.query({
    text: `
      SELECT
        id, username, email, phone, password, created_at, updated_at
      FROM
        users
      WHERE
        email = LOWER($1)
      LIMIT
        1
      ;`,
    values: [email],
  });
  return results.rows[0];
}

async function findOneByUsername(username) {
  const results = await database.query({
    text: `
      SELECT
        id, username, email, phone, password, created_at, updated_at
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      LIMIT
        1
      ;`,
    values: [username],
  });
  return results.rows[0];
}

async function findOneByPhone(phone) {
  const results = await database.query({
    text: `
      SELECT
        id, username, email, phone, password, created_at, updated_at
      FROM
        users
      WHERE
        phone = $1
      LIMIT
        1
      ;`,
    values: [phone],
  });
  return results.rows[0];
}

const user = {
  create,
  readOneByUsername,
  update,
  changePassword,
};

export default user;
