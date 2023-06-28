const request = require("supertest");
const app = require("./index");

describe("Testando rota dos pets", () => {
  it("Testando rota get all pets", async () => {
    const res = await request(app).get("/pets");
    expect(res.body).toHaveProperty("pets");
  });

  it("Testando rota get my pets", async () => {
    const res = await request(app).get("/pets/mypets");
    expect(res.body).toHaveProperty("message", "Acesso negado!");
  });
});
