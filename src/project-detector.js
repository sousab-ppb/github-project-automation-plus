const orgProject = /https:\/\/github.com\/orgs\/([^/]+)\/projects\/([0-9]+)\.*/i;

module.exports = {
	regex: {
		org: orgProject
	},
	matchOrgProject: project => project.match(orgProject)
};
