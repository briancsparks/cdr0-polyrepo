
/**
 * @file
 *
 * Polyrepo is great, but how do you get it when it is one of your poly-repos? get-local-polyrepo,
 * of course!
 *
 * cd $PROJECT_DIR
 * mkdir -p polyrepo && touch polyrepo/{get-local-polyrepo,cdr0-sg,cdr0-grumpy}.js
 *
 * Then, copy this file into polyrepo/get-local-polyrepo.js, and see (1) and (2) below.
 */

// (1) - Copy this line (or one like it for one of your polyrepo libs) into polyrepo/cdr0-sg.js,
// or appropriate file.
//
// const polyPkgs = ['@cdr0/sg', '@cdr0/grumpy'];
//
// module.exports = require('./get-local-polyrepo')(__dirname, polyPkgs)('@cdr0/sg');
// module.exports = require('./get-local-polyrepo')(__dirname, polyPkgs)('@cdr0/grumpy');

// (2) - require the above file, instead of the plain package in whatever files you need
//
// const sg                      = require('../../polyrepo/cdr0-sg');
// const grumpy                  = require('../../polyrepo/cdr0-grumpy');
//
// const sg                      = require('./polyrepo/cdr0-sg');
// const grumpy                  = require('./polyrepo/cdr0-grumpy');

// -------------------------------------------------------------------------------------------------------------------
module.exports = getUnpublishedPolyrepo;


// -------------------------------------------------------------------------------------------------------------------
function getUnpublishedPolyrepo(dirname, config ={}) {
  // Returns a function that is equivalent to the caller doing 'require("@cdr0/polyrepo")', but prefers a local copy

  require('dotenv').config();

  const CDR0_POLYREPO_ROOT = process.env.CDR0_POLYREPO_ROOT;

  if (CDR0_POLYREPO_ROOT) {
    const path  = require('path');

    const localPath = path.join(CDR0_POLYREPO_ROOT, 'polyrepo');

    const mkPolyrepoRequire = require(localPath);
    if (mkPolyrepoRequire) {
      const polyrepoRequire = mkPolyrepoRequire(dirname, config);
      if (polyrepoRequire) {
        return polyrepoRequire;
      }
    }
  }

  /* otherwise */
  return require;
}

