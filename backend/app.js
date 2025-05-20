import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import {v2 as cloudinary} from 'cloudinary';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import orderRoute from './routes/orderRoute.js';
import * as redis from "./utils/redis.js";
import fileUpload from 'express-fileupload';
import logger from './utils/logger.js';
import basketRoute from './routes/basketRoute.js';
import cookieParser from "cookie-parser";
import checkoutRoute from './routes/checkoutRoute.js';
import reportRoute from './routes/reportRoute.js';
import { connectProducer } from './utils/kafka.js';
import http from 'http';
import { initSocket } from './utils/socket.js';
import invoiceRoute from './routes/invoiceRoute.js';

const app = express();
const server = http.createServer(app);
initSocket(server);


const PORT = process.env.PORT || 3000;

dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

//redis bağlantısı
// Dockerda redisi kurmadan çalışmaz
// Redis bağlantısını kontrol et
try{
  redis.redisCon();
  console.log("Redis bağlantısı başarılı");
}catch (error) {
  console.error("Redis bağlantı hatası:", error);
  throw error;
}


// Kafka bağlantısını başlat
connectProducer().catch(console.error);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    credentials: true
}));
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser());


// Loglama
app.use((req, res, next) => {
    logger.info(`${req.method} - ${req.url} - ${req.ip}`);
    next();
});



app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/basket", basketRoute);
app.use("/checkout", checkoutRoute);
app.use("/reports", reportRoute);
app.use("/invoice", invoiceRoute);

app.get("/", (req, res) => {
  res.status(200).send("✅ API çalışıyor");
});


// Detaylı sağlık kontrolü
app.get("/health", async (req, res) => {
  const status = {
    redis: false,
    kafka: false,
    cloudinary: false,
  };

  let log = "🔍 Sunucu sağlık kontrolü başlatıldı...\n";

  // Redis kontrolü
  try {
    await redis.redisCon();
    status.redis = true;
    log += "✅ Redis bağlantısı başarılı\n";
  } catch (error) {
    log += "❌ Redis bağlantı hatası: " + error.message + "\n";
  }

  // Kafka kontrolü
  try {
    await connectProducer();
    status.kafka = true;
    log += "✅ Kafka bağlantısı başarılı\n";
  } catch (error) {
    log += "❌ Kafka bağlantı hatası: " + error.message + "\n";
  }


  const allSystemsOperational = status.redis && status.kafka;

  if (allSystemsOperational) {
    log += "\n🚀 Tüm servisler başarılı şekilde çalışıyor.";
    res.status(200).send(log);
  } else {
    log += "\n⚠️ Bazı servislerde sorunlar var. Lütfen kontrol edin.";
    res.status(500).send(log);
  }
});
  



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



export { app};