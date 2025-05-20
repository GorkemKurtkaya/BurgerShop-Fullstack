import { Kafka } from 'kafkajs'


const kafka = new Kafka({
    clientId: 'my-kafka-producer2',
    brokers: [process.env.CONFLUENT_BROKER_URL],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: process.env.CONFLUENT_API_KEY,
      password: process.env.CONFLUENT_API_SECRET,
    },
    // brokers:['kafka:9092']

    // LOCALDE ÇALIŞTIRMAK İÇİN AŞAĞIDAKİ KODU KULLANINIZ
    // brokers:['localhost:9092']
})

const producer = kafka.producer()

let isConnected = false;

async function connectProducer() {
    try {
        if (!isConnected) {
            await producer.connect();
            isConnected = true;
            console.log("Kafka producer bağlantısı başarılı");
        }
    } catch (error) {
        console.error("Kafka producer bağlantı hatası:", error);
        isConnected = false;
        throw error;
    }
}

async function disconnectProducer() {
    try {
        if (isConnected) {
            await producer.disconnect();
            isConnected = false;
            console.log("Kafka producer bağlantısı kapatıldı");
        }
    } catch (error) {
        console.error("Kafka producer bağlantı kapatma hatası:", error);
        throw error;
    }
}
  
async function sendMessage(topic, message) {
    try {
        if (!isConnected) {
            await connectProducer();
        }
        
        await producer.send({
            topic: topic,
            messages: [
                { value: message },
            ],
        });
        console.log(`Kafka mesajı gönderildi - Topic: ${topic}`);
    } catch (error) {
        console.error('Kafka mesajı gönderilirken hata:', error);
        isConnected = false;
        throw error;
    }
}
  
export {
    connectProducer,
    disconnectProducer,
    sendMessage
};