const { exec } = require('node:child_process');
const loadingSpinner = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
let spinnerIndex = 0;

function checkConnection() {
  exec('docker exec postgres-dev pg_isready --host localhost', handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search('accepting connections') === -1) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      loading();
      setTimeout(() => {
        checkConnection();
      }, 100);
      return;
    }

    console.log('\n🟢 Banco pronto para conectar (\\o\\O/o/)');
  }
}

function loading() {
  process.stdout.write(`🔴 Aguardando banco aceitar conexões (¬_¬) ${loadingSpinner[spinnerIndex++]} `);
  spinnerIndex = spinnerIndex > 7 ? 0 : spinnerIndex;
}

checkConnection();
