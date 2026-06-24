import { d as defineEventHandler, g as getRouterParam, c as createError, p as prisma } from '../../../nitro/nitro.mjs';
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

const _id__get = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing campaign ID" });
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      template: true,
      messages: {
        take: 50,
        orderBy: { createdAt: "desc" },
        include: { contact: { select: { name: true, fullPhone: true } } }
      }
    }
  });
  if (!campaign) {
    throw createError({ statusCode: 404, statusMessage: "Campaign not found" });
  }
  return { data: campaign };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
