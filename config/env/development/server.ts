export default ({ env }) => ({
    url: `http://127.0.0.1:${env('PORT')}`
});
