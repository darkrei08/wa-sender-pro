import { d as defineEventHandler, p as prisma } from '../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async () => {
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: "desc" }
  });
  return { data: templates };
});

export { index_get as default };
//# sourceMappingURL=index4.get.mjs.map
