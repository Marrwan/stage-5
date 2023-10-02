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
