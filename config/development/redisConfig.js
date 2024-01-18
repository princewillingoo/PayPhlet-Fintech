import { createClient } from "redis";

const client = createClient({ password: "ultraslim247" });

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

await client.set("status", "connected", { EX: 10 });

process.on("SIGINT", async () => {
  await client.disconnect();
});

export { client };
