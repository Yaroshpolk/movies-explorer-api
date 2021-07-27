const regUrl = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
const mongoLink = 'mongodb://localhost:27017/bitfilmsdb';

module.exports = {
  regUrl,
  mongoLink
}