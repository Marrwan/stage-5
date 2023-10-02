const amqp = require('amqplib/callback_api');
const { Whisper } = require('whisper');

class TranscriptionService {
  constructor() {
    this.whisper = new Whisper();
    this.transcribeQueue = 'transcription_queue';
  }

  async connect() {
    await this.whisper.connect();
    await this.whisper.createQueue(this.transcribeQueue);

    return this;
  }

  async startListening() {
    return new Promise((resolve, reject) => {
      amqp.connect('amqp://localhost', (err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        connection.createChannel((err, channel) => {
          if (err) {
            reject(err);
            return;
          }

          channel.assertQueue(this.transcribeQueue, { durable: false });
          console.log('Listening for transcription requests...');

          channel.consume(
            this.transcribeQueue,
            (msg) => {
              const message = JSON.parse(msg.content.toString());
              const videoId = message.videoId;

              // Transcribe the video here (e.g., using Whisper)
              const videoPath = `./videos/${videoId}.mp4`;
              // Implement video transcription logic

              // Once transcription is complete, save the results to the database
              // and optionally perform any other desired actions
            },
            { noAck: true }
          );

          resolve();
        });
      });
    });
  }
}

module.exports = TranscriptionService;
