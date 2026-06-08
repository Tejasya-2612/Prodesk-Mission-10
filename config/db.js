const mongoose = require('mongoose')
const dns = require('dns')

const connectDB = async () => {
  try {
    // helps when local ISP DNS refuses MongoDB SRV lookup in Node
    dns.setServers(['8.8.8.8', '1.1.1.1'])
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Connected')
  } catch (error) {
    console.log('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB
