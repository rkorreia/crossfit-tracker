// Method to get the current date in 'YYYY-MM-DD' format
function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

class WorkoutSessionService {
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

    // Method to retrieve all workout sessions
    async getAllSessions() {
        console.log(`[INFO] Fetching all workout sessions`);
        try {
            const { results } = await this.db
                .prepare(`SELECT * FROM workout_sessions`)
                .all();

            console.log(`[INFO] Retrieved ${results.length} workout sessions`);
            return this.createResponse(200, 'Workout sessions retrieved successfully', results);
        } catch (error) {
            console.error(`[ERROR] Failed to fetch all workout sessions: ${error.message}`);
            return this.createResponse(500, 'Database error: ' + error.message);
        }
    }

    // Method to add a new workout session
    async addSession(session_date) {
        console.log(`[INFO] Adding new workout session for date: ${session_date}`);
        const sql = `INSERT INTO workout_sessions DEFAULT VALUES`;

        try {
            const { success, lastInsertRowId } = await this.db
                .prepare(sql)
                .run();

            if (success) {
                console.log(`[INFO] Workout session added successfully`);
                // TODO return created object
                return this.createResponse(201, 
                    'Workout session added successfully', 'Workout session added successfully');
            } else {
                console.error(`[ERROR] Failed to add the workout session`);
                return this.createResponse(500, 'Failed to add the workout session');
            }
        } catch (error) {
            console.error(`[ERROR] Database error: ${error.message}`);
            return this.createResponse(500, 'Database error: ' + error.message);
        }
    }

    // Method to search workout sessions between start and end dates
    async getSessionsBetweenDates(startDate, endDate) {
        console.log(`[INFO] Fetching workout sessions between ${startDate} and ${endDate}`);
        try {
            const { results } = await this.db
                .prepare(`SELECT * FROM workout_sessions WHERE session_date BETWEEN ? AND ?`)
                .bind(startDate, endDate)
                .all();

            if (results.length > 0) {
                console.log(`[INFO] Retrieved ${results.length} workout sessions between the specified dates`);
                return this.createResponse(200, 'Workout sessions found', results);
            } else {
                console.log(`[WARN] No workout sessions found between the specified dates`);
                return this.createResponse(404, 'No workout sessions found between the specified dates');
            }
        } catch (error) {
            console.error(`[ERROR] Failed to fetch workout sessions: ${error.message}`);
            return this.createResponse(500, 'Database error: ' + error.message);
        }
    }
}

export default WorkoutSessionService;
