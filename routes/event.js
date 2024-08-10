const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { google } = require("googleapis");
const { oAuth2Client } = require("../googleAuth");

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

// create
router.post("/", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();

    const googleEvent = {
      summary: savedEvent.title,
      description: savedEvent.description,
      start: {
        dateTime: new Date(savedEvent.date + " " + savedEvent.time),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: new Date(
          new Date(savedEvent.date + " " + savedEvent.time).getTime() +
            savedEvent.duration * 60 * 60 * 100
        ),
        timeZone: "America/Los_Angeles",
      },
    };

    const calendarEvent = await calendar.events.insert({
      calendarId: "primary",
      resource: googleEvent,
    });
    savedEvent.googleCalendarEventId = calendarEvent.data.id;
    await savedEvent.save();

    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get All Events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get Single Event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Event by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Event by ID
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
