import app from "./src/routes/travelStatusAPI/app";
import router from "./src/routes/travelStatusAPI/travelStatusRoutes";
//import "./src/scheduler/scraperScheduler";
import "./src/scheduler/validateScheduler";

app.use("/travelstatus", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
