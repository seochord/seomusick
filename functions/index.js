const functions = require("firebase-functions");
const { google } = require("googleapis");

// Cloud Function: getLatestVideo
// API_KEY는 Firebase Secrets에서 가져옵니다.
exports.getLatestVideo = functions.runWith({ secrets: ["API_KEY"] }).https.onCall(async (data, context) => {
  const playlistId = data.playlistId;
  const apiKey = process.env.API_KEY;

  if (!playlistId) {
    throw new functions.https.HttpsError("invalid-argument", "playlistId is required");
  }

  const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
  });

  try {
    const response = await youtube.playlistItems.list({
      part: "snippet",
      maxResults: 1,
      playlistId: playlistId,
    });

    const items = response.data.items;
    if (!items || items.length === 0) {
      return { error: "No videos found" };
    }

    const videoId = items[0].snippet.resourceId.videoId;
    const title = items[0].snippet.title;

    return { videoId, title };
  } catch (error) {
    console.error("YouTube API Error:", error);
    throw new functions.https.HttpsError("internal", "Failed to fetch YouTube data");
  }
});
