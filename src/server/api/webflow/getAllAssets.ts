import { db } from "~/utils/database";

export default defineEventHandler((event) => {
    console.log('Dummy Webflow provider plugin loaded');
    return db.read()
})