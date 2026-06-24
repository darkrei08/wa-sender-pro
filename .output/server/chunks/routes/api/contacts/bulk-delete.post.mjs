import { d as defineEventHandler, e as readValidatedBody, p as prisma } from '../../../nitro/nitro.mjs';
import { B as BulkDeleteSchema } from '../../../_/validation.mjs';
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

const bulkDelete_post = defineEventHandler(async (event) => {
  const { ids } = await readValidatedBody(event, BulkDeleteSchema);
  const result = await prisma.contact.deleteMany({
    where: { id: { in: ids } }
  });
  return { data: { deleted: result.count } };
});

export { bulkDelete_post as default };
//# sourceMappingURL=bulk-delete.post.mjs.map
