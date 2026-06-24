import { d as defineEventHandler, e as readValidatedBody } from '../../nitro/nitro.mjs';
import { c as UpdateSettingsSchema } from '../../_/validation.mjs';
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

const index_put = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, UpdateSettingsSchema);
  return {
    data: {
      ...data,
      saved: true,
      note: "Settings acknowledged. Env-level changes require container restart."
    }
  };
});

export { index_put as default };
//# sourceMappingURL=index.put.mjs.map
