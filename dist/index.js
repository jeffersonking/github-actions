const core = require('@actions/core')
const {context, GitHub} = require('@actions/github')

// repos/jeffersonking/github-actions/releases
// repos/jeffersonking/github-actions/releases/25992490/assets
async function run() {
	try {
		const github = new GitHub(process.env.GITHUB_TOKEN)
		const {owner, repo} = context.repo;
		// const release_id = core.getInput('asset_name', {required: true})

		const {data: assets} = await github.repos.listAssetsForRelease({
			owner, repo, release_id,
		})

		for (const asset of assets) {
			await github.repos.deleteReleaseAsset({
				owner, repo, asset_id: asset.id
			})
		}

		// await github.repos.deleteReleaseAsset({
		// 	owner, repo, asset_id: 20256621
		// })
	} catch (error) {
		core.setFailed(error.message)
	}
}

run()
