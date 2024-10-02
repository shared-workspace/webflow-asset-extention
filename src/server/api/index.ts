export default defineEventHandler((event) => {
    sendRedirect(event, "/api/authorize");
});
