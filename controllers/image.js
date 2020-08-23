/* eslint-disable no-process-env */
/* eslint-disable max-len */
const Clarifai = require('clarifai');

// Initialize with your api key. This will also work in your browser via http://browserify.org/
const app = new Clarifai.App({
  apiKey: process.env.API_CLARIFAI
 });

 // eslint-disable-next-line no-unused-vars
 const handleApiCall = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input).
  then(data => {
    res.json(data).
    catch(res.status(400).json('unable to work with api'))
  })
}

const handleImage = db => (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id).
    increment('entries', 1).
    returning('entries').
    then(entries => {
      if (entries.length > 0) {
        res.json(entries[0]);
      }
      else
      {
        res.status(400).json('id not found');
      }
  }).
  catch(err => {
    res.status(400).json(err);
  })
}

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
}
