'use strict';
const csv = require('csv-stream');
const fs = require('fs');

const CSV_OPTIONS = {
  escapeChar: '"',
  enclosedChar: '"'
};

function csvToJson(path, cb) {
  const csvStream = csv.createStream(CSV_OPTIONS);
  const result = [];
  const fileStream = fs.createReadStream(path);

  let ddfRecord = {};

  fileStream.on('error', err => cb(err));
  fileStream.on('readable', () => {
    fileStream
      .pipe(csvStream)
      .on('error', err => {
        cb(err);
      })
      .on('data', () => {
        result.push(ddfRecord);
        ddfRecord = {};
      })
      .on('column', (key, value) => {
        if (value) {
          ddfRecord[key] = value;
        }
      });
  });
  fileStream.on('end', () => {
    cb(null, result);
  });
}

exports.csvToJson = csvToJson;
