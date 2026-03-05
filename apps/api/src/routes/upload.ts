import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { authenticate } from "../middlewares/authenticate.js";

const presignedBodySchema = z.object({
  bucket: z.enum(["vehicules", "documents", "messages-files"]),
  path: z.string().min(1),
  contentType: z.string().min(1),
});

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

export async function uploadRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  app.addHook("preHandler", authenticate);

  app.post<{ Body: z.infer<typeof presignedBodySchema> }>(
    "/presigned",
    async (request, reply) => {
      const parsed = presignedBodySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          success: false,
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: parsed.error.flatten(),
        });
      }
      if (!supabase) {
        return reply.status(503).send({
          success: false,
          error: "Storage non configuré",
          code: "SERVICE_UNAVAILABLE",
        });
      }

      const { bucket, path, contentType } = parsed.data;
      const fullPath = `${request.user!.id}/${path}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUploadUrl(fullPath);

      if (error) {
        return reply.status(500).send({
          success: false,
          error: error.message,
          code: "UPLOAD_ERROR",
        });
      }

      return reply.send({
        success: true,
        data: {
          uploadUrl: data.signedUrl,
          path: fullPath,
          token: data.token,
        },
      });
    }
  );
}
