import express from "express";
import { getConfig } from "./config.js";
import { decorateRoute } from "./routes/decorate.js";

const config = getConfig();
const app = express();

app.use(express.json());
app.use("/api/decorate", decorateRoute);

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

export { app };
