import { d as defineEventHandler, g as getRouterParam, c as createError, b as getCampaignProgress } from '../../../../nitro/nitro.mjs';
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

const status_get = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing campaign ID" });
  const progress = await getCampaignProgress(id);
  if (!progress) {
    throw createError({ statusCode: 404, statusMessage: "Campaign not found" });
  }
  return { data: progress };
});

export { status_get as default };
//# sourceMappingURL=status.get.mjs.map
