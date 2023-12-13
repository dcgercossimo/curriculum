import database from "infra/database.js";

async function status(req, res) {
  const result = await database.query('SELECT 1 + 1 AS SUN;');
  console.log(result.rows);
  res.status(200).json("endpoit status primeiro acesso só para os acima da média");
}

export default status;
