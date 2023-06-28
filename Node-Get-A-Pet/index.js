const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

const app = express();

// Config JSON response
app.use(express.json());

// Solve CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Public folder for images
app.use(express.static("public"));

// Routes
const UserRoutes = require("./routes/UserRoutes");
const PetRoutes = require("./routes/PetRoutes");

app.use("/users", UserRoutes);
app.use("/pets", PetRoutes);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(5000);

module.exports = app;
