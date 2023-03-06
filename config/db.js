const mongoose = require('mongoose')
mongoose.set('strictQuery', true)


const connectDB = async () => {
    try {
      const db = await mongoose.connect(process.env.DB)
      console.log(`Database connected: ${db.connection.host}`)
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }

module.exports = connectDB