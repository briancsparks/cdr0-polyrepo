
# CDR0 polyrepo

The idea of `monorepos` is great, but it is swimming against the tide in
today's software ecosystem.  Virtually all tooling nowadays assumes that
one Github repo holds one and only one 'thing'.  So, `polyrepo` can give
some of the benefits of monorepos, but still allow
your repos to fit into the mold of one project per Github repo.

### Incantations

Assuming you have `@mygreat/library` and `@mygreat/app`.

#### All the Repos Must be Siblings

`dev` will be the parent of all your repos:

```shell
cd
mkdir dev && cd $_
mkdir library
mkdir app

# ... Lots of other work to setup the repos.
```

In each repo, add `polyrepo`, and prepare the magic directory for your proxy scripts:

```shell
cd
cd library
npm i -S @cdr0/polyrepo
mkdir polyrepo

cd
cd app
npm i -S @cdr0/polyrepo
mkdir polyrepo
touch polyrepo/mygreat-library.js
touch polyrepo/mygreat-other-thing.js
# ... touch more libs / packages ...

cd
cd somewhereelse
# ... npm, mkdir, touch ...

# ... other repos as siblings of `library` and `app`
```

Each proxy file will look similar to these:

```js
// app/polyrepo/mygreat-library.js

// Build the prequire (poly-require) function
const polyrepoRequire   = require('@cdr0/polyrepo')(__dirname);

// The proxy function.
const prequire  = function (name) {
  return polyrepoRequire(name) || require(name);
};

module.exports = prequire('@mygreat/library');
```

```js
// app/polyrepo/mygreat-other-thing.js

// Build the prequire (poly-require) function
const polyrepoRequire   = require('@cdr0/polyrepo')(__dirname);

// The proxy function.
const prequire  = function (name) {
  return polyrepoRequire(name) || require(name);
};

module.exports = prequire('@mygreat/other-thing');
```

Then, to bring one into a file:

```js
// app/index.js

const greatLibrary  = require('./polyrepo/mygreat-library');
```

When running on your development workstation, `greatLibrary` will be the repo that
is a sibling to the `app` package, and will be the package from NPM otherwise.

#### Optional (Other Locations)

`polyrepo` will look at sibling directories by default. You can also define `CDR0_POLYREPO_ROOT`
and point it to a directory that will be assumed to hold packages to look for.

```shell
export CDR0_POLYREPO_ROOT="$HOME/dev"
```

### Some Work Required

`polyrepo` is a small project, so some of the work is left for the reader.

* Create one `.js` file for each item in the multi-project-repo, in the `<root>/polyrepo/`
  directory.
* Require it instead of the general name.
* Keep the entry in package.json for it, that's what will get pulled in outside
  your active-development environment.

### Gotchas / Limitations

* All of the repos must be checked out to sibling directories.
* You must use the env var: CDR0_POLYREPO_ROOT to point to the parent directory.
* You do not get `bin` linking for your development workstation.

## TODO

* [ ] Scripts to manage the `.../polyrepo/` directory, and `package.json`
* [ ] Scripts to allow installed packages' binaries to be called via the NPM
      scripts mechanism.
* [ ] A mo-betta way to organize all of the repos on your development workstation.
* [ ] Scripts to link `bin` items into your path.
* [ ] Scripts to cross-link `bin` items

