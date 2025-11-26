import app from "./app";
import router from "./travelStatusRoutes";

app.use("/travelstatus", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
