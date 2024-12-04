import useSwr from 'swr';

async function fetchAPI(key) {
  const resp = await fetch(key);
  const responseBody = await resp.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseInfo />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSwr('/api/v1/status', fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = 'Carregando...';

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString('pt-BR');
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseInfo() {
  const { isLoading, data } = useSwr('/api/v1/status', fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseInfo = 'Carregando...';

  if (!isLoading && data) {
    const database = data.dependencies.database;
    databaseInfo = (
      <>
        <h2>Database Info</h2>
        <div>Versão: {database.version}</div>
        <div>Máximo de conexões: {database.max_connections}</div>
        <div>Conexões ativas: {database.active_connections}</div>
      </>
    );
  }

  return databaseInfo;
}
