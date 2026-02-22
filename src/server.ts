import fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { transactionsRoutes } from "./app/routes/transactions.routes";
import { registerErrorHandler } from "./app/middlewares/error-handler";
import pino from "pino";

dotenv.config();

const app = fastify({ logger: pino() });
app.register(cors, { origin: true });
app.register(transactionsRoutes, { prefix: "/transactions" });

registerErrorHandler(app);

const port = Number(process.env.PORT || 3000);

app
  .listen({ port, host: "0.0.0.0" })
  .then(() => {
    app.log.info(`Server listening on port ${port}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
