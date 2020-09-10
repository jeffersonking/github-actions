const { readFileSync, writeFileSync } = require('fs')
const { execFileSync } = require('child_process')
const { parse } = require('semver')

const package = JSON.parse(readFileSync('./package.json', 'utf8'))
const packageVer = parse(package.version)

let prerelease = 0 // Main was changed, or no prev version, restart prerelease from 0.
try {
	// `abbrev=0` finds the closest tagname without any suffix.
	execFileSync('git', ['fetch', '--depth=10'])
	execFileSync('git', ['fetch', '--tags'])
	const tag = execFileSync('git', ['describe', '--tags', '--abbrev=0'], { encoding: 'utf8' }).trim()
	const lastReleaseVer = parse(tag)
	if (packageVer.compareMain(lastReleaseVer) === 0) {
		prerelease = lastReleaseVer.prerelease[0] + 1 // Main is equal, auto-increment the prerelease.
	}
} catch (error) {
}

packageVer.prerelease = [ prerelease ]
package.version = packageVer.format()
console.log('Computed package version:', package.version)
writeFileSync('./package.json', JSON.stringify(package, null, 4))
