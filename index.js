
const fs      = require('fs');
const path    = require('path');
const ad      = require('@cdr0/active-development')(module);

let g_doTrick = true;

module.exports = mkPolyrepoRequire;

function mkPolyrepoRequire(theirDirname, config ={}) {

  let   doTrick     = config.doTrick || g_doTrick;

  return polyrepoRequire;

  // ==================================================================================================================
  function polyrepoRequire(pkgName) {
    let result;
    let requiredName;
    let step = '';

    // The whole polyrepo idea only makes sense during active development
    if (!ad.isActiveDevelopment()) {
      doTrick = false;
      step = 'not_active_development';
      return loud(null);
    }

    // Get 'name' from @org/name, if it is that style
    const name = capture(/^@[^/]+[/](.*)$/, pkgName) || pkgName;

    // // Check if we have been given a list of packages.
    // if (config.polyPkgs) {
    //   doTrick = config.polyPkgs.indexOf(pkgName) !== -1;
    // }

    // Make sure we even need to do this trick (or if we should just 'require' it).
    if (!doTrick) {
      // return require(pkgName);    // NOT loud
      step = 'do_not_do_trick';
      return loud(null);
    }

    // CDR0_POLYREPO_ROOT overrides
    require('dotenv').config();

    const CDR0_POLYREPO_ROOT = process.env.CDR0_POLYREPO_ROOT;
    if (CDR0_POLYREPO_ROOT) {
      result = requireSiblingOfTheirs(CDR0_POLYREPO_ROOT, name);
      if (result) {
        step = 'CDR0_POLYREPO_ROOT';
        return loud(result);
      }
    }

    // Ideally, this repo/dir is a sibling of the root of where the other polyrepos are
    result = requireSiblingOfMine(name);
    if (result) {
      step = 'polyrepo_sibling';
      return loud(result);
    }

    // Maybe their repo is a sibling
    result = requireSiblingOfTheirs(theirDirname, name);
    if (result) {
      // step = `their_sibling__${theirDirname}`;
      step = `their_sibling__`;
      console.log(`their sibling`, {theirDirname, name})
      return loud(result);
    }

    // TODO: Try other things...
    //       JSON entry to point to root
    //       Specific item for this specific entry


    // If we get here, just blindly require it, so caller will get their expected error
    // return require(pkgName);
    step = 'last_resort';
    return loud(null);


    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // TODO: report that we are requiring thru a non-standard mechanism
    function loud(result) {
      let msg = `NOTE: when requiring ${pkgName}`;

      if (requiredName) {
        msg += `, polyrepoRequire used ${requiredName}`;
      }

      if (result === null) {
        msg += `, polyrepoRequire returned null`;
      }

      if (step) {
        msg += `, at step ${step}`;
      }

      console.log(msg);

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

      try {
        console.log(`REQUIRING ${fullname}`)
        const result = require(fullname);
        requiredName = fullname;
        return result;

      } catch(e) {}

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

