import { d as defineEventHandler, g as getRouterParam, c as createError, e as readValidatedBody, p as prisma } from '../../../nitro/nitro.mjs';
import { U as UpdateContactSchema } from '../../../_/validation.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "Missing contact ID" });
  const data = await readValidatedBody(event, UpdateContactSchema);
  const updateData = { ...data };
  if (data.prefix || data.phone) {
    const existing = await prisma.contact.findUnique({ where: { id } });
    if (!existing) throw createError({ statusCode: 404, statusMessage: "Contact not found" });
    const prefix = data.prefix || existing.prefix;
    const phone = data.phone || existing.phone;
    updateData.fullPhone = (prefix + phone).replace(/\D/g, "");
  }
  if (data.customFields) {
    updateData.customFields = JSON.stringify(data.customFields);
  }
  const contact = await prisma.contact.update({
    where: { id },
    data: updateData
  });
  return { data: contact };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
