const projectDetector = require('./project-detector');

/**
 * GraphQl query to get project and column information
 *
 * @param {string} url - Issue or Pull request url
 * @param {string} eventName - The current event name
 * @param {string} project - The project to find
 */
const projectQuery = (url, eventName, project) => {
	const orgProjectResult = projectDetector.matchOrgProject(project);
	let query = null;
	if (orgProjectResult) {
		query = `query {
		resource( url: "${url}" ) {
			... on ${eventName === 'issues' ? 'Issue' : 'PullRequest'} {
				projectCards {
					nodes {
						id
						isArchived
						project {
							name
							id
							columns(first: 100) {
								nodes {
									id
									name
								}
							}
						}
					}
				}
			}
			... on Organization {
				project(number: ${orgProjectResult[2]}) {
					name
					id
					columns(first: 100) {
						nodes {
							id
							name
						}
					}
				}
			}
		}
		organization(login: "${orgProjectResult[1]}") {
			project(number: ${orgProjectResult[2]}) {
				name
				id
				columns(first: 100) {
					nodes {
						id
						name
					}
				}
			}
		}
	}`;
	} else {
		query = `query {
		resource( url: "${url}" ) {
			... on ${eventName === 'issues' ? 'Issue' : 'PullRequest'} {
				projectCards {
					nodes {
						id
						isArchived
						project {
							name
							id
						}
					}
				}
				repository {
					projects( search: "${project}", first: 10, states: [OPEN] ) {
						nodes {
							name
							id
							columns( first: 100 ) {
								nodes {
									id
									name
								}
							}
						}
					}
					owner {
						... on ProjectOwner {
							projects( search: "${project}", first: 10, states: [OPEN] ) {
								nodes {
									name
									id
									columns( first: 100 ) {
										nodes {
											id
											name
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}`;
	}

	return query;
};

module.exports = projectQuery;
