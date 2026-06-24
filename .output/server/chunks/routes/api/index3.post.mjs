import { d as defineEventHandler, e as readValidatedBody, p as prisma } from '../../nitro/nitro.mjs';
import { e as CreateTemplateSchema } from '../../_/validation.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, CreateTemplateSchema);
  const template = await prisma.template.create({ data });
  return { data: template };
});

export { index_post as default };
//# sourceMappingURL=index3.post.mjs.map
