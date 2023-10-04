const express = require('express')
const env = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const path = require("path");
const cors = require("cors");

const userRoutes = require('./routes/auth')
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const initialDataRoutes = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const adminOrderRoute = require("./routes/admin/order.routes");
const formRoutes = require('./routes/formRoutes')
// const corsOptions = {
//   origin: "https://ecommerce-frontend-seven-sable.vercel.app/",
// };
app.use(express.json());
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));

env.config();
// console.log(process.env)
const connection_url = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.tbjaaca.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;
// `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.cmgf85p.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;
// console.log(connection_url)

mongoose.connect(connection_url).then(() => {
  console.log("database connected");
}).catch((error)=> console.error(error))

app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api",addressRoutes)
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoute);
app.use('/api', formRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`Server listening on port ${process.env.PORT}`)
})