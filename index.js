const core = require('@actions/core')
const {context, GitHub} = require('@actions/github')
const fs = require('fs')

// https://help.github.com/en/actions/building-actions/creating-a-javascript-action#commit-and-push-your-action-to-github
// repos/jeffersonking/github-actions/releases
// repos/jeffersonking/github-actions/releases/25992490/assets
async function run() {
	try {
		const github = new GitHub(process.env.GITHUB_TOKEN)
		const { owner, repo } = context.repo;
		const release_id = core.getInput('release_id', { required: true })
		const assetPath = core.getInput('asset_path', {required: true})
		const assetName = core.getInput('asset_name', {required: true})
		const assetContentType = core.getInput('asset_content_type', {required: true})

		const {data: assets} = await github.repos.listAssetsForRelease({ owner, repo, release_id })
		for (const asset of assets) {
			await github.repos.deleteReleaseAsset({
				owner, repo, asset_id: asset.id
			})
		}

		const res = await github.repos.getRelease({ owner, repo, release_id })
		console.log(res)

		const {upload_url} = await github.repos.getRelease({ owner, repo, release_id })
		console.log(111, upload_url)
		await github.repos.uploadReleaseAsset({
			url: upload_url,
			headers: {
				'content-type': assetContentType,
				'content-length': fs.statSync(assetPath).size
			},
			name: assetName,
			data: fs.readFileSync(assetPath)
		})
	} catch (error) {
		core.setFailed(error.message)
	}
}

run()
