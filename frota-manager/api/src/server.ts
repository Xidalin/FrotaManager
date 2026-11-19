import { app } from "./app.js";
const porta = Number(process.env.PORT ?? 3001);
app.listen(porta, "127.0.0.1", () => console.log("API local na porta", porta));
