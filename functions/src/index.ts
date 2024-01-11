import express from "express";
import { shippingLabel } from "./shipping-label";

// set express and port
const app = express();
const port = 3000;

// set some routes
app.get('/', (req: express.Request, res: express.Response) => res.send('Hello world!'));
app.post('/get-label',shippingLabel);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});