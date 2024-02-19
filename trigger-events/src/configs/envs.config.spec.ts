import { configs } from "./envs.config";

describe("validando variaveis de ambientes", () => {
  it("deve validar existencia de chaves de variaveis", () => {
    const envs = configs;
    const keys = Object.keys(envs);
    expect(keys).toContain("TZ");
    expect(keys).toContain("PORT");
    expect(keys).toContain("DB_HOST");
    expect(keys).toContain("DB_PORT");
    expect(keys).toContain("DB_USER");
    expect(keys).toContain("DB_NAME");
    expect(keys).toContain("DB_PASSWORD");
    expect(keys).toContain("URL_OPEN_AI");
    expect(keys).toContain("KEY_OPEN_AI");
    expect(keys).toContain("MOCK_CALL_OPEN_AI");
    expect(keys).toContain("MOCK_CALL_OPEN_AI_RESPONSE");
  });
});
