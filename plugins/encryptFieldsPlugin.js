// plugins/encryptFieldsPlugin.js
const { encryptValue, decryptValue } = require('../utils/cryptoUtil');

/**
 * Helper: get nested value by path (a.b.c)
 */
function getByPath(obj, path) {
  if (!obj) return undefined;
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

/**
 * Helper: set nested value by path (creates intermediate objects)
 */
function setByPath(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (cur[p] == null || typeof cur[p] !== 'object') cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

/**
 * Decide whether a value is already encrypted (simple shape check)
 */
function looksEncrypted(val) {
  return (
    val &&
    typeof val === 'object' &&
    typeof val.iv === 'string' &&
    typeof val.content === 'string' &&
    typeof val.tag === 'string'
  );
}

/**
 * Plugin factory:
 *   schema.plugin(encryptFieldsPlugin, { paths: ['owner_details.name', ...] })
 */
module.exports = function encryptFieldsPlugin(schema, options) {
  if (!options || !Array.isArray(options.paths)) {
    throw new Error('encryptFieldsPlugin requires { paths: [..] }');
  }
  const paths = options.paths;

  // Pre-save: encrypt fields on the document
  schema.pre('save', function (next) {
    try {
      for (const path of paths) {
        const val = getByPath(this, path);
        if (val !== undefined && !looksEncrypted(val)) {
          const enc = encryptValue(val);
          setByPath(this, path, enc);
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  });

  // Pre findOneAndUpdate / updateOne / updateMany - encrypt values in the update payload
  async function encryptUpdate(next) {
    try {
      const update = this.getUpdate && this.getUpdate();
      if (!update) return next();

      // handle $set, top-level fields, $setOnInsert
      const fineTargets = ['$set', '$setOnInsert', '$push', '$addToSet'];
      // also maybe direct set: update.field = value
      for (const path of paths) {
        // 1) check $set / $setOnInsert
        for (const t of fineTargets) {
          if (update[t] && Object.prototype.hasOwnProperty.call(update[t], path)) {
            const raw = update[t][path];
            if (raw !== undefined && !looksEncrypted(raw)) {
              update[t][path] = encryptValue(raw);
            }
          }
        }
        // 2) check direct set update e.g. { 'owner_details.name': 'foo' }
        if (Object.prototype.hasOwnProperty.call(update, path)) {
          const raw = update[path];
          if (raw !== undefined && !looksEncrypted(raw)) {
            update[path] = encryptValue(raw);
          }
        }
      }

      // set modified update back
      this.setUpdate(update);
      next();
    } catch (err) {
      next(err);
    }
  }

  schema.pre('findOneAndUpdate', encryptUpdate);
  schema.pre('updateOne', encryptUpdate);
  schema.pre('updateMany', encryptUpdate);
  schema.pre('update', encryptUpdate);

  // Post-init (after mongoose materializes doc): decrypt these fields on the document instance
  schema.post('init', function (doc) {
    try {
      for (const path of paths) {
        const enc = getByPath(doc, path);
        if (enc !== undefined && looksEncrypted(enc)) {
          const dec = decryptValue(enc);
          setByPath(doc, path, dec);
        }
      }
    } catch (err) {
      // don't crash reads; optionally log
      // console.error('decrypt post init', err);
    }
  });

  // toObject / toJSON - decrypt before returning plain objects
  function decryptForOutput(doc) {
    try {
      const obj = doc.toObject ? doc.toObject() : doc;
      for (const path of paths) {
        const enc = getByPath(obj, path);
        if (enc !== undefined && looksEncrypted(enc)) {
          const dec = decryptValue(enc);
          setByPath(obj, path, dec);
        }
      }
      return obj;
    } catch (err) {
      return doc;
    }
  }

  const origToJSON = schema.methods.toJSON;
  schema.method(
    'toJSON',
    function () {
      return decryptForOutput(this);
    },
    { suppressWarning: true }
  );

  const origToObject = schema.methods.toObject;
  schema.method(
    'toObject',
    function () {
      return decryptForOutput(this);
    },
    { suppressWarning: true }
  );
};
// To use this plugin, add it to your Mongoose schema with the desired paths to encrypt.