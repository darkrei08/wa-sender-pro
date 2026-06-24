import { d as defineEventHandler, e as readValidatedBody, p as prisma, f as securityLog } from '../../../nitro/nitro.mjs';
import { a as BulkImportSchema } from '../../../_/validation.mjs';
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

function sanitizePhone(prefix, phone) {
  let p = String(prefix).trim();
  let n = String(phone || "").trim();
  if (p.endsWith(".0")) p = p.slice(0, -2);
  if (n.endsWith(".0")) n = n.slice(0, -2);
  return (p + n).replace(/\D/g, "");
}
function parseCSV(text) {
  const clean = text.replace(/^\uFEFF/, "");
  const firstLine = clean.split("\n")[0];
  const delimiter = firstLine.includes(";") ? ";" : ",";
  const lines = clean.split("\n").filter((l) => l.trim());
  if (lines.length < 2) {
    return { contacts: [], errors: [{ row: 0, reason: "File vuoto o header mancante" }], totalRows: 0 };
  }
  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ""));
  const contacts = [];
  const errors = [];
  const getCol = (row, name) => {
    const idx = headers.findIndex((h) => h.toLowerCase() === name.toLowerCase());
    return idx >= 0 ? (row[idx] || "").trim().replace(/^"|"$/g, "") : "";
  };
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(delimiter);
    const rawRow = {};
    headers.forEach((h, idx) => {
      rawRow[h] = (cells[idx] || "").trim().replace(/^"|"$/g, "");
    });
    const name = getCol(cells, "Name") || getCol(cells, "nome") || getCol(cells, "nominativo");
    const prefix = getCol(cells, "Prefix") || getCol(cells, "prefisso") || "+39";
    const phone = getCol(cells, "Phone") || getCol(cells, "telefono") || getCol(cells, "numero");
    if (!phone) {
      errors.push({ row: i + 1, reason: `Numero telefono mancante` });
      continue;
    }
    const fullPhone = sanitizePhone(prefix, phone);
    if (fullPhone.length < 5) {
      errors.push({ row: i + 1, reason: `Numero non valido: ${phone}` });
      continue;
    }
    const standardCols = /* @__PURE__ */ new Set(["name", "nome", "prefix", "prefisso", "phone", "telefono", "numero", "email", "company", "azienda", "message"]);
    const customFields = {};
    headers.forEach((h, idx) => {
      if (!standardCols.has(h.toLowerCase())) {
        customFields[h] = (cells[idx] || "").trim().replace(/^"|"$/g, "");
      }
    });
    contacts.push({
      name: name || `Contatto ${i}`,
      prefix: prefix.startsWith("+") ? prefix : `+${prefix}`,
      phone,
      fullPhone,
      email: getCol(cells, "email") || void 0,
      company: getCol(cells, "Company") || getCol(cells, "azienda") || void 0,
      customFields: Object.keys(customFields).length > 0 ? customFields : void 0,
      rawRow
    });
  }
  return { contacts, errors, totalRows: lines.length - 1 };
}

const import_post = defineEventHandler(async (event) => {
  const { csv } = await readValidatedBody(event, BulkImportSchema);
  const result = parseCSV(csv);
  let imported = 0;
  let skipped = 0;
  for (const contact of result.contacts) {
    try {
      await prisma.contact.upsert({
        where: { fullPhone: contact.fullPhone },
        create: {
          name: contact.name,
          prefix: contact.prefix,
          phone: contact.phone,
          fullPhone: contact.fullPhone,
          email: contact.email,
          company: contact.company,
          customFields: contact.customFields ? JSON.stringify(contact.customFields) : null
        },
        update: {
          name: contact.name,
          email: contact.email,
          company: contact.company,
          customFields: contact.customFields ? JSON.stringify(contact.customFields) : null
        }
      });
      imported++;
    } catch {
      skipped++;
    }
  }
  securityLog.campaignStarted(`csv-import-${Date.now()}`, imported);
  return {
    data: {
      imported,
      skipped,
      errors: result.errors,
      totalRows: result.totalRows
    }
  };
});

export { import_post as default };
//# sourceMappingURL=import.post.mjs.map
