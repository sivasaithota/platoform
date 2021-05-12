const Formidable = require('formidable');

const filer = require('../../common/filer');
const logger = require('../../common/logger');
const constants = require('../../common/constants');

class MultipartParser {
  parseRequestData(req) {
    const form = new Formidable.IncomingForm({
      maxFileSize: 300 * 1024 * 1024,
    });
    form.keepExtensions = true;
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          logger.error('Error parsing multi-part form data!', err);
          return reject(constants.parser.parseMultipartError);
        }

        try {
          resolve({
            jsonData: fields.jsonData ? JSON.parse(fields.jsonData) : {},
            fileData: files.fileData,
          });
        } catch (error) {
          filer.deleteFile(files.fileData.path, true);
          logger.error('Error parsing json data!', error);
          reject(constants.parser.parseMultipartJsonError);
        }
      });
    });
  }
}

module.exports = new MultipartParser();
