import { d as defineEventHandler, e as readValidatedBody, p as prisma } from '../../nitro/nitro.mjs';
import { b as CreateContactSchema } from '../../_/validation.mjs';
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
  const data = await readValidatedBody(event, CreateContactSchema);
  const fullPhone = (data.prefix + data.phone).replace(/\D/g, "");
  const contact = await prisma.contact.create({
    data: {
      name: data.name,
      prefix: data.prefix,
      phone: data.phone,
      fullPhone,
      email: data.email,
      company: data.company,
      notes: data.notes,
      customFields: data.customFields ? JSON.stringify(data.customFields) : null
    }
  });
  return { data: contact };
});

export { index_post as default };
//# sourceMappingURL=index2.post.mjs.map
