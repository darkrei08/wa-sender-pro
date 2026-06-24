import { d as defineEventHandler, E as ENGINE } from '../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async () => {
  return {
    data: {
      delayMin: parseInt(process.env.CAMPAIGN_DELAY_MIN || "15", 10),
      delayMax: parseInt(process.env.CAMPAIGN_DELAY_MAX || "45", 10),
      maxMessagesPerHour: parseInt(process.env.MAX_MESSAGES_PER_HOUR || "100", 10),
      spintaxEnabled: process.env.SPINTAX_ENABLED !== "false",
      whatsappEngine: ENGINE,
      supportedEngines: ["wuzapi", "gowa"]
    }
  };
});

export { index_get as default };
//# sourceMappingURL=index3.get.mjs.map
