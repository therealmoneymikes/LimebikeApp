import "dotenv/config"


export default {
    expo: {
        name: "limebikeapp",
        slug: "limebikeapp",
        extra: {
            mapboxAccessToken: process.env.MAPBOX_TOKEN,
            appVersion: process.env.APP_VERSION,
            googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
        }
    }
}