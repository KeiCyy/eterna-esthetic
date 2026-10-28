const test = require("node:test");
const assert = require("node:assert").strict;

const app = require("../src/app");

test("GET / responde correctamente", async () => {
    const server = app.listen(0);

    try {
        const address = server.address();
        const port = address.port;

        const response = await fetch(
            `http://127.0.0.1:${port}/`
        );
        assert.equal(response.status, 200);
    } finally {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
});