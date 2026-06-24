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
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing contact ID" });
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      messages: {
        take: 10,
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!contact) {
    throw createError({ statusCode: 404, statusMessage: "Contact not found" });
  }
  return { data: contact };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
