import retry from "async-retry";

const baseUrl = "http://localhost:3000"; // process.env.BASE_URL;

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    })

    async function fetchStatusPage() {
      const response = await fetch(`${baseUrl}/api/v1/status`);
      // const response = await fetch('http://localhost:3000/api/v1/status');
      const jsonBody = await response.json();
    }
  }
}

export default {
  waitForAllServices,
}
