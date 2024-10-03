import { db } from "~/utils/database";

export default defineEventHandler((event) => {
    const id = getQuery(event).id as string;
    return db.getById(id)?.altText || null;
})