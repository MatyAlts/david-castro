import { defineConfig } from "prisma/cli";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasources: {
    db: {
      url: process.env.DB_URL,
    },
  },
});
