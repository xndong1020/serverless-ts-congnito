import express, { json, Express } from "express";
import helmet from "helmet";

const app: Express = express();
app.use(json());
app.use(helmet());

app.get("/public/", (req, res) => {
  console.log("req from public root", req);
  res.json({
    msg: "Hello from public",
  });
});

app.get("/private/", (req, res) => {
  console.log("req from private root", req);
  res.json({
    msg: "Hello from private",
  });
});

app.use((_, res, _2) => {
  // console.log("req from fallback", req);
  res.status(404).json({ error: "NOT FOUND" });
});

export default app;
