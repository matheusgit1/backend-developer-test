import { validate } from "jtd";

import { SchemaInvalido } from "../erros/schema-invalido.error";

// Valida objeto com base no schema
export function validarSchema(
  dado: any,
  schema: any,
  propriedadeAdicional: boolean | any = true
): void | SchemaInvalido {
  validarComJTD(dado, schema, propriedadeAdicional);
}

function validarComJTD(
  dado: any,
  schema: any,
  propriedadeAdicional: boolean | any = true
) {
  const erros = validate(
    {
      properties: schema,
      additionalProperties: propriedadeAdicional,
    },
    dado
  );

  if (erros.length > 0) {
    throw new SchemaInvalido("Schema invalido", erros);
  }
}
