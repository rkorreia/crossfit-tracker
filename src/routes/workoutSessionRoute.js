import { Hono } from 'hono';
import WorkoutSessionService from '../services/WorkoutSessionService.js';

const workoutSession = new Hono();

// Middleware to inject the WorkoutSessionService into the request
workoutSession.use('*', async (c, next) => {
    c.req.workoutSessionService = new WorkoutSessionService(c.env.DB);
    await next();
});

// Get all workout sessions
workoutSession.get('/', async (c) => {
    const response = await c.req.workoutSessionService.getAllSessions();
    c.status(response.status);
    return c.json(response);
});

// Add a new workout session
workoutSession.post('/', async (c) => {
    const { session_date } = await c.req.json();

    const response = await c.req.workoutSessionService.addSession(session_date);
    c.status(response.status);
    return c.json(response);
});

// Search for workout sessions between start and end dates
workoutSession.get('/between', async (c) => {
    const { startDate, endDate } = c.req.query();

    if (!startDate || !endDate) {
        return c.text("'startDate' and 'endDate' are required parameters", 400);
    }

    const response = await c.req.workoutSessionService.getSessionsBetweenDates(startDate, endDate);
    c.status(response.status);
    return c.json(response);
});

export default workoutSession;
