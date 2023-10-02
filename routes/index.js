let express = require('express');
let router = express.Router();

let controller = require('../controllers/index');

router.post('/start-recording', controller.startRecording);

router.post('/upload-chunk/:videoId', controller.appendChunk);

router.post('/complete-video/:videoId', controller.completeRecording);


router.get('/video-details/:videoId', controller.getVideo);

module.exports = router;
