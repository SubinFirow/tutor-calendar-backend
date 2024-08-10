const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  participants: [{ type: String }],
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  sessionNotes: { type: String },
  googleCalendarEventId: { type: String },
});

module.exports = mongoose.model("Event", EventSchema);
