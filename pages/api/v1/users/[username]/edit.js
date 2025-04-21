import { createRouter } from 'next-connect';
import controller from 'infra/controller';
import user from 'models/user';

const router = createRouter();

router.put(putHandler);

export default router.handler(controller.errorHandlers);

async function putHandler(req, res) {
  const { username } = req.query;
  const userInput = req.body;

  const userFound = await user.readOneByUsername(username);
  if (!userFound) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  const updatedUser = await user.update(userFound.id, userInput);

  return res.status(205).json(updatedUser);
}
