
const test            = require('ava');
const mkPrequire      = require('..');

const polyrepoRequire        = mkPrequire(__dirname, {polyPkgs:[]});
const prequire = function (name) {
  return polyrepoRequire(name) || require(name);
};

// -------------------------------------------------------------------------------------------------------------------
test('ava works', (t) => {
  t.pass();
});

test('prequire', (t) => {
  // const mod = prequire('dotenv') || require('dotenv');
  const mod = prequire('dotenv');

  t.is(typeof mod, "object");
  t.is(typeof mod.config, "function");
});







// test('it does something', t => {
// const   startData = {a:42};
// const   result    = underTest.doSomething(startData);
// const   value     = result.a;
//
// t.truthy(true);
// t.falsy(0);
//
// t.pass('passes');
// t.fail('fail');
//
// t.true(true);
// t.false(false);
//
// t.assert(value, 'msg');
//
// t.is(value, 42);
// t.not(value, 45);
//
// t.deepEqual(result, {a:42});
// t.notDeepEqual(result, {a:55});

// t.throws(fn, expectation);
// t.throwsAsync(thrower, expectation, message);
// t.notThrows(fn, message);
// t.notThrowsAsync(nonThrower, message);

// t.regex(contents, regex, message);
// t.notRegex(contents, regex, message);
// t.snapshot(expected, message);
// t.snapshot(expected, options, message);



// https://github.com/avajs/ava/blob/master/docs/03-assertions.md
// t.like({b:'c'}, x);
// t.try(title, implementation | macro | macro[], ...args);


// function fnI() {
//   // blah
// }
// });

// test('skip assertion', t => {
//   t.plan(2);
//   t.is.skip(foo(), 5); // No need to change your plan count when skipping
//   t.is(1, 1);
// });

