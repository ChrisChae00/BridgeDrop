import { getDatabase, ref, set, push } from "firebase/database";
import { app } from "./firebase-app.js";

const database = getDatabase(app);

export { database, ref, set, push };
