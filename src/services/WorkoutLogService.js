class WorkoutLogService {
    constructor(db) {
        this.db = db;
    }

    // Utility method to create a consistent response format
    createResponse(status, message, results = []) {
        if (status >= 400) {
            return {status, message};
        }
        return results;
    }

    // Method to retrieve all workout logs
    async getAllLogs() {
        console.log(`[INFO] Fetching all workout logs`);
        try {
            const { results } = await this.db
                .prepare(`SELECT * FROM workout_logs`)
                .all();

            console.log(`[INFO] Retrieved ${results.length} workout logs`);
            return this.createResponse(200, 'Workout logs retrieved successfully', results);
        } catch (error) {
            console.error(`[ERROR] Failed to fetch all workout logs: ${error.message}`);
            return this.createResponse(500, 'Database error: ' + error.message);
        }
    }

    // Method to add a new workout log
    async addLog(workout_session_date, exercise_name, weight, reps) {
        console.log(`[INFO] Adding new workout log for session ID: ${workout_session_date}, exercise: ${exercise_name}`);
        
        // Validate that weight and reps are numbers
        if (isNaN(weight) || isNaN(reps)) {
            return this.createResponse(400, 'Invalid input: weight and reps must be numeric values.');
        }
        
        const sql = `INSERT INTO workout_logs (workout_session_date, exercise_name, weight, reps) VALUES (?, ?, ?, ?)`;
        try {
            const { success } = await this.db
                .prepare(sql)
                .bind(workout_session_date, exercise_name, weight, reps)
                .run();

            if (success) {
                console.log(`[INFO] Workout log added successfully`);
                // TODO return created object
                return this.createResponse(201, 'Workout log added successfully');
            } else {
                console.error(`[ERROR] Failed to add the workout log`);
                return this.createResponse(500, 'Failed to add the workout log');
            }
        } catch (error) {
            console.error(`[ERROR] Database error: ${error.message}`);
            return this.createResponse(500, 'Database error: ' + error.message);
        }
    }

    // Method to retrieve logs by workout session ID
    async getLogsBySessionId(workout_session_id) {
        console.log(`[INFO] Fetching workout logs for session ID: ${workout_session_id}`);
        try {
            const { results } = await this.db
                .prepare(`SELECT * FROM workout_logs WHERE workout_session_id = ?`)
                .bind(workout_session_id)
                .all();

            if (results.length > 0) {
                console.log(`[INFO] Retrieved ${results.length} workout logs for session ID: ${workout_session_id}`);
                return this.createResponse(200, 'Workout logs found', results);
            } else {
                console.log(`[WARN] No workout logs found for session ID: ${workout_session_id}`);
                return this.createResponse(404, 'No workout logs found for the specified session');
            }
        } catch (error) {
            console.error(`[ERROR] Failed to fetch workout logs: ${error.message}`);
            return this.createResponse(500, 'Database error: ' + error.message);
        }
    }

    // Method to retrieve logs by exercise name
    async getLogsByExerciseName(exercise_name) {
        console.log(`[INFO] Fetching workout logs for exercise: ${exercise_name}`);
        try {
            const { results } = await this.db
                .prepare(`SELECT * FROM workout_logs WHERE exercise_name = ?`)
                .bind(exercise_name)
                .all();

            if (results.length > 0) {
                console.log(`[INFO] Retrieved ${results.length} workout logs for exercise: ${exercise_name}`);
                return this.createResponse(200, 'Workout logs found', results);
            } else {
                console.log(`[WARN] No workout logs found for exercise: ${exercise_name}`);
                return this.createResponse(404, 'No workout logs found for the specified exercise');
            }
        } catch (error) {
            console.error(`[ERROR] Failed to fetch workout logs: ${error.message}`);
            return this.createResponse(500, 'Database error: ' + error.message);
        }
    }
}

export default WorkoutLogService;
