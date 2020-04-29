const core = require('@actions/core')
const {GitHub} = require('@actions/github')

// repos/jeffersonking/github-actions/releases
// repos/jeffersonking/github-actions/releases/25992490/assets
async function run() {
	try {
		const github = new GitHub(process.env.GITHUB_TOKEN)
		const {owner, repo} = context.repo;

		const {data: assets} = await github.repos.listAssetsForRelease({
			owner, repo,
			release_id: 25992490,
		})

		for (const asset of assets) {
			console.log(`Asset ${asset.id}`)
		}

		// const r = await github.repos.deleteReleaseAsset({ asset_id: 20256621 })
	} catch (error) {
		core.setFailed(error.message)
	}
}

run()
