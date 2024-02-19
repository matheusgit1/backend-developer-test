import { AWSPort } from "./aws.port";

describe(`testes para ${AWSPort.name}`, () => {
  it(`deve conter metodo ${AWSPort.prototype.getObjectFroms3}`, () => {
    expect(AWSPort.prototype.getObjectFroms3).toBeDefined();
    expect(AWSPort.prototype.getObjectFroms3).toBeInstanceOf(Function);
  });

  it(`deve conter metodo ${AWSPort.prototype.uploadObjectToS3}`, () => {
    expect(AWSPort.prototype.uploadObjectToS3).toBeDefined();
    expect(AWSPort.prototype.uploadObjectToS3).toBeInstanceOf(Function);
  });
});
