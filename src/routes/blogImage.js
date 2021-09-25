const express = require('express');
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');

const keys = require('../keys/key');
const key = require('../keys/key');
const auth = require('../middlewares/auth');

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
});
const router = express.Router();

router.get('/api/upload', auth, (req, res, next) => {
  const key = `${req.user.id}/${uuid()}.jpeg`;
  s3.getSignedUrl(
    'putObject',
    {
      Bucket: 'bucket-name',
      contentType: 'image/jpeg',
      key,
    },
    (err, url) => {
      res.status(201).json({
        url,
        key,
      });
    }
  );
});
module.exports = router;
