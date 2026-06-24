import { d as defineEventHandler, e as readValidatedBody, p as prisma } from '../../nitro/nitro.mjs';
import { C as CreateCampaignSchema } from '../../_/validation.mjs';
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
  const data = await readValidatedBody(event, CreateCampaignSchema);
  const campaign = await prisma.campaign.create({
    data: {
      name: data.name,
      templateId: data.templateId,
      contactIds: Array.isArray(data.contactIds) ? JSON.stringify(data.contactIds) : data.contactIds,
      delayMin: data.delayMin,
      delayMax: data.delayMax
    },
    include: { template: { select: { name: true } } }
  });
  return { data: campaign };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
