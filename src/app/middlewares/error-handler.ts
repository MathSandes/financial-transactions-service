import { FastifyInstance, FastifyReply } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../utils/error";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, _request, reply: FastifyReply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        code: "VALIDATION_ERROR",
        message: error.errors.map((e) => e.message).join(", "),
      });
    }

    if (error instanceof AppError) {
      return reply
        .status(error.status)
        .send({ code: error.code, message: error.message });
    }

    app.log.error(error);
    return reply
      .status(500)
      .send({ code: "INTERNAL_ERROR", message: "Internal server error" });
  });
}
