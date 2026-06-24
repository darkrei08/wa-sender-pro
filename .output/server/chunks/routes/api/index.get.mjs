import { d as defineEventHandler, r as readValidatedQuery, p as prisma } from '../../nitro/nitro.mjs';
import { P as PaginationSchema } from '../../_/validation.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const { page, limit, search } = readValidatedQuery(event, PaginationSchema);
  const where = search ? { name: { contains: search } } : {};
  const [campaigns, total] = await Promise.all([
    prisma.campaign.findMany({
      where,
      include: { template: { select: { name: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.campaign.count({ where })
  ]);
  return {
    data: campaigns,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
