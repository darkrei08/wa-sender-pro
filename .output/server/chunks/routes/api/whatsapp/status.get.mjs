import { d as defineEventHandler, j as getEngineStatus, E as ENGINE } from '../../../nitro/nitro.mjs';
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

const status_get = defineEventHandler(async () => {
  const status = await getEngineStatus();
  return {
    data: {
      ...status,
      activeEngine: ENGINE,
      supportedEngines: ["wuzapi", "gowa"]
    }
  };
});

export { status_get as default };
//# sourceMappingURL=status.get.mjs.map
