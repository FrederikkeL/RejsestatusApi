import app from './app.ts';
import router from "./travelStatusRoutes.ts";

app.use("/travelstatus", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});