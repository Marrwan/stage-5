const multer = require('multer');
const amqp = require('amqplib/callback_api');
const fs = require('fs');
const { Whisper } = require('whisper');


// Multer for handling video chunks
const storage = multer.memoryStorage();
const upload = multer({ storage });

let startRecording = (req, res) => {
    // Create a new video record
    const video = new Video({
      name: req.body.name,
      timestamps: [],
      url: '',
    });
  
    video.save((err, savedVideo) => {
      if (err) {
        res.status(500).json({ error: 'Unable to start recording.' });
      } else {
        res.status(200).json({ id: savedVideo._id });
      }
    });
  }

  let appendChunk = (req, res) => {
    const videoId = req.params.videoId;
    const videoChunk = req.body.chunk;
  
    // Save the received chunk to the video file on disk as a byte array
    const videoPath = `./videos/${videoId}.mp4`; // Choose a suitable path
    fs.appendFileSync(videoPath, Buffer.from(videoChunk));
  
    res.status(200).json({ message: 'Chunk uploaded successfully.' });
  }

  let completeRecording = (req, res) => {
    const videoId = req.params.videoId;
    const { timestamps, url } = req.body;
  
    Video.findByIdAndUpdate(
      videoId,
      { $set: { timestamps, url } },
      { new: true },
      (err, updatedVideo) => {
        if (err) {
          res.status(500).json({ error: 'Unable to save video info.' });
        } else {
          // Trigger video transcription
          transcribeVideo(videoId);
  
          res.status(200).json(updatedVideo);
        }
      }
    );
    }  

    let getVideo = (req, res) => {
        const videoId = req.params.videoId;
      
        Video.findById(videoId, (err, video) => {
          if (err) {
            res.status(500).json({ error: 'Unable to fetch video details.' });
          } else {
            res.status(200).json(video);
          }
        });
      }

      // Function to transcribe video using RabbitMQ and Whisper
function transcribeVideo(videoId) {
    const whisper = new Whisper();
    const transcribeQueue = 'transcription_queue';
  
    whisper
      .connect()
      .then(() => whisper.createQueue(transcribeQueue))
      .then(() => {
        // Publish a message to the transcription queue
        const message = JSON.stringify({ videoId });
        whisper.publish(transcribeQueue, message);
      })
      .catch((err) => {
        console.error('Error connecting to Whisper:', err);
      });
  }
  
module.exports = {
    startRecording,
    appendChunk,
    completeRecording,
    getVideo
}