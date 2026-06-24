import { d as defineEventHandler, g as getRouterParam, c as createError, e as readValidatedBody, p as prisma } from '../../../nitro/nitro.mjs';
import { d as UpdateTemplateSchema } from '../../../_/validation.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import 'node:url';
import 'zod';

const _id__put = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing template ID" });
  const data = await readValidatedBody(event, UpdateTemplateSchema);
  const template = await prisma.template.update({
    where: { id },
    data
  });
  return { data: template };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
