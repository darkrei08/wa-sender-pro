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
  const where = search ? {
    OR: [
      { name: { contains: search } },
      { phone: { contains: search } },
      { fullPhone: { contains: search } },
      { email: { contains: search } },
      { company: { contains: search } }
    ]
  } : {};
  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" }
    }),
    prisma.contact.count({ where })
  ]);
  return {
    data: contacts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
});

export { index_get as default };
//# sourceMappingURL=index2.get.mjs.map
