import "dotenv/config"


export default {
    expo: {
        name: "limebikeapp",
        slug: "limebikeapp",
        extra: {
            mapboxAccessToken: process.env.MAPBOX_TOKEN
        }
    }
}