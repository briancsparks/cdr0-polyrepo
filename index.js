
const fs = require('fs');
const path = require('path');

let g_doTrick = true;

module.exports = mkPolyrepoRequire;

function mkPolyrepoRequire(theirDirname, config ={}) {

  let   doTrick     = config.doTrick || g_doTrick;

  return polyrepoRequire;

  // ==================================================================================================================
  function polyrepoRequire(pkgName) {
    let result;
    let requiredName;

    // Get 'name' from @org/name, if it is that style
    const name = capture(/^@[^/]+(.*)$/, pkgName) || pkgName;

    // Check if we have been given a list of packages.
    if (config.polyPkgs) {
      doTrick = config.polyPkgs.indexOf(pkgName) !== -1;
    }

    // Make sure we even need to do this trick (or if we should just 'require' it).
    if (!doTrick) {
      return require(pkgName);    // NOT loud
    }

    // CDR0_POLYREPO_ROOT overrides
    require('dotenv').config();

    const CDR0_POLYREPO_ROOT = process.env.CDR0_POLYREPO_ROOT;
    if (CDR0_POLYREPO_ROOT) {
      result = requireSiblingOfTheirs(CDR0_POLYREPO_ROOT, name);
      if (result) {
        return loud(result);
      }
    }

    // Ideally, this repo/dir is a sibling of the root of where the other polyrepos are
    result = requireSiblingOfMine(name);
    if (result) {
      return loud(result);
    }

    // Maybe their repo is a sibling
    result = requireSiblingOfTheirs(theirDirname, name);
    if (result) {
      return loud(result);
    }

    // TODO: Try other things...
    //       JSON entry to point to root
    //       Specific item for this specific entry


    // If we get here, just blindly require it, so caller will get their expected error
    return require(pkgName);


    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // TODO: report that we are requiring thru a non-standard mechanism
    function loud(result) {
      if (requiredName) {
        console.log(`NOTE: when requiring "${pkgName}", polyrepoRequire used: "${requiredName}"`)
      }
      return result;
    }

    // ----------------------------------------------------------------------------------------------------------------
    function requireSiblingOfTheirs(theirDirname, name) {
      return requireFull(theirDirname, name, 'js') ||
        requireFull(theirDirname, name, 'json') ||
        requireFull(theirDirname, name, 'jsx');
    }

    function requireSiblingOfMine(name) {
      return requireFullSiblingOfMine(name, 'js') ||
        requireFullSiblingOfMine(name, 'json') ||
        requireFullSiblingOfMine(name, 'jsx');
    }

    function requireFullSiblingOfMine(name, ext) {
      return requireFull(__dirname, name, ext);
    }

    function requireFull(dirname, name, ext) {
      const fullname = path.join(dirname, name);
      return require(fullname);

      // const ok = fs.accessSync(fullname, fs.constants.R_OK);
      //
      // if (ok) {
      //   requiredName = fullname;
      //   return require(fullname);
      // }
    }

    function requireFullOrig(dirname, name, ext) {
      const fullname = path.join(dirname, `${name}.${ext}`);
      const ok = fs.accessSync(fullname, fs.constants.R_OK);

      if (ok) {
        requiredName = fullname;
        return require(fullname);
      }
    }

  }
}

function capture(re, str) {
  const res = re.exec(str);
  if (res && res[1]) {
    return res[1];
  }
}

