const mongoose = require("mongoose");

export default async () => {
  mongoose
    .connect(process.env.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("database connected");
    })
    .catch((err: Error) => console.log(err));
};
