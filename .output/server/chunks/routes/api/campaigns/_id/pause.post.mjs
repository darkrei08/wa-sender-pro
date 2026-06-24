import { d as defineEventHandler, g as getRouterParam, c as createError, a as pauseCampaign } from '../../../../nitro/nitro.mjs';
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

const pause_post = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing campaign ID" });
  const paused = pauseCampaign(id);
  if (!paused) {
    throw createError({ statusCode: 404, statusMessage: "No active campaign with this ID" });
  }
  return { success: true, message: "Campaign paused" };
});

export { pause_post as default };
//# sourceMappingURL=pause.post.mjs.map
