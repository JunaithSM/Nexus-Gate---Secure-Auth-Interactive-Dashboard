import { Pool } from "pg";
import { DB_URL } from "../config/env.js";
const POOL = new Pool(DB_URL)

export {
    POOL
}