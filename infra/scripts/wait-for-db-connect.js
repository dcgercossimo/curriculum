const { exec } = require('node:child_process');

function checkConnection() {
  exec('docker exec postgres-dev pg_isready --host localhost', handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search('accepting connections') === -1) {
      process.stdout.write('.');
      setTimeout(() => {
        checkConnection();
      }, 100);
      return;
    }

    console.log('\n🟢 Banco pronto para conectar (\\o\\O/o/)');
  }
}

process.stdout.write('🔴 Aguardando banco aceitar conexões (¬_¬)');
checkConnection();
