import { z } from 'zod';

const safeString = (maxLen = 255) => z.string().trim().max(maxLen, `Max ${maxLen} characters`).transform((s) => s.replace(/<[^>]*>/g, ""));
const phoneNumber = z.string().trim().transform((s) => s.replace(/\D/g, "")).refine((s) => s.length >= 5 && s.length <= 15, "Invalid phone number");
const phonePrefix = z.string().trim().regex(/^\+\d{1,4}$/, "Prefix must be +1 to +9999").default("+39");
const safeEmail = z.string().trim().email().max(320).toLowerCase().optional();
const CreateContactSchema = z.object({
  name: safeString(100),
  prefix: phonePrefix,
  phone: phoneNumber,
  email: safeEmail,
  company: safeString(100).optional(),
  notes: safeString(500).optional(),
  customFields: z.record(safeString(200)).optional()
});
const UpdateContactSchema = CreateContactSchema.partial();
const BulkImportSchema = z.object({
  csv: z.string().max(5e6, "CSV file too large (max 5MB)").min(1, "Empty CSV")
});
const CreateTemplateSchema = z.object({
  name: safeString(100),
  body: z.string().trim().min(1, "Template body required").max(4096, "Max 4096 characters").refine(
    (s) => !/\{%|<%|#{|@{/.test(s),
    "Invalid template syntax \u2014 use {{variable}} format only"
  ),
  description: safeString(255).optional()
});
const UpdateTemplateSchema = CreateTemplateSchema.partial();
const CreateCampaignSchema = z.object({
  name: safeString(100),
  templateId: z.string().cuid("Invalid template ID"),
  contactIds: z.union([
    z.literal("ALL"),
    z.array(z.string().cuid()).min(1, "Select at least 1 contact").max(1e4)
  ]).default("ALL"),
  delayMin: z.number().int().min(5).max(300).default(15),
  // min 5s anti-ban
  delayMax: z.number().int().min(10).max(600).default(45)
}).refine((d) => d.delayMin < d.delayMax, "delayMin must be less than delayMax");
const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  search: z.string().trim().max(100).optional()
});
const BulkDeleteSchema = z.object({
  ids: z.array(z.string().cuid()).min(1).max(1e3, "Max 1000 IDs per request")
});
const UpdateSettingsSchema = z.object({
  delayMin: z.number().int().min(5).max(300).optional(),
  delayMax: z.number().int().min(10).max(600).optional(),
  maxMessagesPerHour: z.number().int().min(1).max(1e3).optional(),
  spintaxEnabled: z.boolean().optional(),
  whatsappEngine: z.enum(["wuzapi", "gowa"]).optional()
});

export { BulkDeleteSchema as B, CreateCampaignSchema as C, PaginationSchema as P, UpdateContactSchema as U, BulkImportSchema as a, CreateContactSchema as b, UpdateSettingsSchema as c, UpdateTemplateSchema as d, CreateTemplateSchema as e };
//# sourceMappingURL=validation.mjs.map
