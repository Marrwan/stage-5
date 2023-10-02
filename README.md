# Screen Recording Extension API Documentation

This API is designed to support a Chrome extension for screen recording. It provides endpoints for starting and managing video recordings, saving video chunks, and transcribing videos using RabbitMQ and Whisper.

## Endpoints

### Start Video Recording

Start a new video recording and receive an ID for the recording.

- **URL**: `/start-recording`
- **Method**: POST
- **Request Body**:

```json
{
  "name": "Test Video" // Name of the video recording
}
```

#### Response
```json{
  "id": "1234567890" // Unique ID for the new video recording
}
```
### Upload Video Chunk
Upload video chunks in real-time during recording.

- **URL**: `/upload-chunk/:videoId`
- **Method**: POST
- **Parameters**:
```json 
videoId (string): ID of the video recording
```
#### Request Body:
```json
{
  "chunk": "base64_encoded_data" // Base64-encoded video chunk data
}
```
#### Response: 
```json
{
  "message": "Chunk uploaded successfully"
}
```
### Complete Video Recording

- **URL**: `/complete-video/:videoId`
- **Method**: POST
- **Parameters**:
```json
videoId (string): ID of the video recording
```
#### Request Body:
```json{
  "timestamps": [1, 2, 3], // Timestamps for the video
  "url": "video_url" // URL to the saved video file
}
```
#### Response:
```json 
{
  "name": "Test Video",
  "timestamps": [1, 2, 3],
  "url": "video_url"
}
```
## Get Video Details
Retrieve details of a completed video recording.

- **URL**: `/video-details/:videoId`
- **Method**: GET
- **Parameters**:
```json
videoId (string): ID of the video recording
```
#### Response:
```json
{
  "name": "Test Video",
  "timestamps": [1, 2, 3],
  "url": "video_url"
}
```

## Transcription Service (Background Process)
Video transcription is handled as a background process using RabbitMQ and Whisper. When a video is marked as complete, the transcription process is triggered. The transcription service listens for transcription requests, transcribes videos, and saves results to the database.

Usage
Start a video recording using the /start-recording endpoint and receive a recording ID.

Send video chunks to the /upload-chunk/:videoId endpoint in real-time as the recording progresses.

Once the recording is complete, call the /complete-video/:videoId endpoint with video details.

Retrieve video details using the /video-details/:videoId endpoint.

Video transcription is automatically triggered upon completing a video recording and is handled by the background transcription service.


