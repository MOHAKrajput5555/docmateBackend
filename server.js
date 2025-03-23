const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const cors = require('cors');
const { Server } = require('socket.io');

const app = require('./App');

mongoose.set('useCreateIndex', true);
mongoose.set('strictQuery', true);
mongoose.connect("mmongodb+srv://mohakkkk:9t1LnzHBdlwYwFFd@cluster0.bolhsfh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) {
    console.log("mongoose error is " + err)
  } else {
    console.log("Success! Your database is connected.")
  }
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED, Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
