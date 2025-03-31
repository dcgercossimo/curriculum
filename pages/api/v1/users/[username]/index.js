import { createRouter } from 'next-connect';
import controller from 'infra/controller';
import user from 'models/user';

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(req, res) {
  const { username } = req.query;
  const userFound = await user.readOneByUsername(username);
  if (!userFound) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }
  return res.status(200).json(userFound);
}
