const { parse } = require('semver');

const v = parse('3.0.0')
pr = v.prerelease
console.log(pr)