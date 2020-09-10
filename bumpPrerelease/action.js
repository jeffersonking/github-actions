const core = require('@actions/core')
const { readFileSync, writeFileSync } = require('fs')
const { execFileSync } = require('child_process')
const { parse } = require('semver')

async function run() {
	try {
		const package = JSON.parse(readFileSync('./package.json', 'utf8'))
		const packageVer = parse(package.version)

		// `abbrev=0` finds the closest tagname without any suffix.
		execFileSync('git', ['fetch', '--depth=10'])
		execFileSync('git', ['fetch', '--tag'])
		const tag = execFileSync('git', ['describe', '--tags', '--abbrev=0'], { encoding: 'utf8' }).trim()
		const lastReleaseVer = parse(tag)
		
		const prerelease = packageVer.compareMain(lastReleaseVer) === 0
			? lastReleaseVer.prerelease[0] + 1	// Main is equal, auto-increment the prerelease.
			: 0 								// Main was changed, restart prerelease from 0.
		
		packageVer.prerelease = [ prerelease ]
		package.version = packageVer.format()
		writeFileSync('./package.json', JSON.stringify(package, null, 4))
	} catch (error) {
		core.setFailed(error.message)
	}
}

run()
