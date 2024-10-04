import { db } from "~/utils/database";

export default defineEventHandler((event) => {
    const {id , altText } = getQuery(event) as {id: string, altText: string};
    return db.update(id, "altText", altText) as string | null;
})