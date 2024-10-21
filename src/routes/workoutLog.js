import { Hono } from 'hono';
import WorkoutLogService from '../services/WorkoutLogService.js';

const workoutLog = new Hono();

// Middleware to inject the WorkoutLogService into the request
workoutLog.use('*', async (c, next) => {
    c.req.workoutLogService = new WorkoutLogService(c.env.DB);
    await next();
});

// Get all workout logs
workoutLog.get('/', async (c) => {
    const response = await c.req.workoutLogService.getAllLogs();
    c.status(response.status);
    return c.json(response);
});

// Add a new workout log
workoutLog.post('/', async (c) => {
    const { workout_session_date, exercise_name, weight, reps } = await c.req.json();

    if (!workout_session_date || !exercise_name || !weight || !reps) {
        return c.text("'workout_session_date', 'exercise_name', 'weight', and 'reps' are required parameters", 400);
    }

    const response = await c.req.workoutLogService.addLog(workout_session_date, exercise_name, weight, reps);
    c.status(response.status);
    return c.json(response);
});

// Get logs by workout session ID
workoutLog.get('/session/:workoutSessionId', async (c) => {
    const { workoutSessionId } = c.req.param();

    const response = await c.req.workoutLogService.getLogsBySessionId(workoutSessionId);
    c.status(response.status);
    return c.json(response);
});

// Get logs by exercise name
workoutLog.get('/exercise/:exerciseName', async (c) => {
    const { exerciseName } = c.req.param();

    const response = await c.req.workoutLogService.getLogsByExerciseName(exerciseName);
    c.status(response.status);
    return c.json(response);
});

export default workoutLog;
