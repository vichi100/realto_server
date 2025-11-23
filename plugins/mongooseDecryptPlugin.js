const { decryptValue, isEncryptedObject } = require("../utils/cryptoUtil");

module.exports = function mongooseDecryptPlugin(schema) {
  schema.post("find", decryptDocumentArray);
  schema.post("findOne", decryptSingleDocument);
  schema.post("findOneAndUpdate", decryptSingleDocument);
  schema.post("save", decryptSingleDocument);

  function decryptDocumentArray(docs) {
    if (!Array.isArray(docs)) return;
    docs.forEach(decryptObjectDeep);
  }

  function decryptSingleDocument(doc) {
    if (!doc) return;
    decryptObjectDeep(doc);
  }

  function decryptObjectDeep(obj) {
    if (!obj || typeof obj !== "object") return;

    for (let key of Object.keys(obj)) {
      const val = obj[key];

      if (isEncryptedObject(val)) {
        obj[key] = decryptValue(val);
      } else if (typeof val === "object") {
        decryptObjectDeep(val);
      }
    }
  }
};
