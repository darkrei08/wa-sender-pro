import { d as defineEventHandler, g as getRouterParam, c as createError, s as startCampaign } from '../../../../nitro/nitro.mjs';
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

const start_post = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing campaign ID" });
  startCampaign(id).catch((err) => {
    console.error(`[Campaign ${id}] Error:`, err);
  });
  return { success: true, message: "Campaign started" };
});

export { start_post as default };
//# sourceMappingURL=start.post.mjs.map
