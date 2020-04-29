const core = require('@actions/core')
const github = require('@actions/github')
const {GitHub} = require('@actions/github')

async function run() {
	try {
		console.log(00)
		const github = new GitHub(process.env.GITHUB_TOKEN)

		console.log(11)
		const {data: assets} = await github.repos.listAssetsForRelease({
			owner: 'jeffersonking',
			release_id: 25992490,
		})
		console.log(22)
		for (const asset of assets) {
			console.log(`Asset ${asset.id}`)
		}

		// const r = await github.repos.deleteReleaseAsset({ asset_id: 20256621 })

	} catch (error) {
		core.setFailed(error.message)
	}
}

run()

// repos/jeffersonking/github-actions/releases
// repos/jeffersonking/github-actions/releases/25992490/assets
