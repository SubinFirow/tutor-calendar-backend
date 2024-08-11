const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const axios = require("axios");
const moment = require("moment");

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

// Get All Events
router.get("/", async (req, res) => {
  try {
    const access_token = req.headers.authorization;
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=${access_token}`
    );
    const eventList = response.data.items;
    eventList.forEach(async (event) => {
      const existingEvent = await Event.findOne({
        googleCalendarEventId: event.id,
      });

      if (!existingEvent) {
        const newEvent = new Event({
          title: event.summary || "title",
          description: event.description,
          participants: event.attendees || [],
          date: moment(event.start.dateTime).toDate(),
          time: moment(event.start).format("HH-MM"),
          duration: event.duration || 1,
          sessionNotes: event.description,
          googleCalendarEventId: event.id,
        });
        const saved = await newEvent.save();
        if (saved) console.log("data saved");
      }
    });

    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// create
router.post("/", async (req, res) => {
  try {
    const access_token = req.headers.authorization;
    const { date, duration } = req.body;
    const response = await axios.post(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=${access_token}`,
      {
        start: {
          dateTime: moment(date).add(1, "hour").toDate(),
          timeZone: "UTC",
        },
        end: {
          dateTime: moment(date).add(duration, "hour"),
          timeZone: "UTC",
        },
        reminders: {},
      }
    );

    if (response) {
      const newEvent = new Event({
        ...req.body,
        googleCalendarEventId: response.data.id,
      });
      const savedEvent = await newEvent.save();
      await savedEvent.save();
      res.status(201).json(response.data);
    } else res.status(500).json({ message: "Internal server error" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Event by ID
router.put("/:id", async (req, res) => {
  const access_token = req.headers.authorization;
  const { date, duration, googleCalendarEventId } = req.body;
  try {
    const response = await axios.put(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleCalendarEventId}?access_token=${access_token}`,
      {
        start: {
          dateTime: moment(date).add(1, "hour").toDate(),
          timeZone: "UTC",
        },
        end: {
          dateTime: moment(date).add(duration, "hour").toDate(),
          timeZone: "UTC",
        },
        reminders: {},
      }
    );

    if (response) {
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedEvent);
    } else res.status(500).json({ message: "Internal server error" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Event by ID
router.delete("/:id", async (req, res) => {
  try {
    const access_token = req.headers.authorization;
    const googleId = req.query.googleCalendarEventId;
    const response = await axios.delete(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${googleId}?access_token=${access_token}`
    );
    if (response) {
      await Event.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Event deleted" });
    } else res.status(500).json({ message: "Internal server error" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
