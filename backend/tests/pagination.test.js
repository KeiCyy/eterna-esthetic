const test = require("node:test");
const assert = require("node:assert").strict;

const calculatePagination = require("../src/utils/pagination");

test("Calcula correctamente la segunda pagina", () => {
    const result = calculatePagination(2, 5, 23);

    assert.deepEqual(result, {
        skip: 5,
        totalPages: 5,
    });
});

test("La primera pagina no omite registros", () => {
    const result = calculatePagination(1, 10, 23);

    assert.equal(result.skip, 0);
    assert.equal(result.totalPages, 3);
});

test("Sin registros, el total de paginas es cero", () => {
    const result = calculatePagination(1, 10, 0);

    assert.equal(result.skip, 0);
    assert.equal(result.totalPages, 0);
})