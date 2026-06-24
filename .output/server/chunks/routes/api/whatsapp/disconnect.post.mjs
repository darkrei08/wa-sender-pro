import { d as defineEventHandler, h as disconnectEngine, f as securityLog } from '../../../nitro/nitro.mjs';
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

const disconnect_post = defineEventHandler(async () => {
  await disconnectEngine();
  securityLog.whatsappDisconnected();
  return { success: true, message: "WhatsApp disconnected" };
});

export { disconnect_post as default };
//# sourceMappingURL=disconnect.post.mjs.map
