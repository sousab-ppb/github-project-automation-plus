const test = require('ava');

const generateProjectQuery = require('../src/generate-project-query');

const issueQuery = `query {
		resource( url: "https://github.com/alex-page/test-actions/issues/52" ) {
			... on Issue {
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
					projects( search: "Backlog", first: 10, states: [OPEN] ) {
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
							projects( search: "Backlog", first: 10, states: [OPEN] ) {
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

const pullrequestQuery = `query {
		resource( url: "https://github.com/alex-page/test-actions/pulls/1" ) {
			... on PullRequest {
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
					projects( search: "Backlogg", first: 10, states: [OPEN] ) {
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
							projects( search: "Backlogg", first: 10, states: [OPEN] ) {
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

const pullrequestQueryForOrgProject = `query {
		resource( url: "https://github.com/alex-page/test-actions/pulls/1" ) {
			... on PullRequest {
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
			}
		}
		organization(login: "SomeOrg") {
			project(number: 2) {
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

test('generateProjectQuery should create a query for issues', t => {
	const url = 'https://github.com/alex-page/test-actions/issues/52';
	const eventName = 'issues';
	const project = 'Backlog';

	t.is(generateProjectQuery(url, eventName, project), issueQuery);
});

test('generateProjectQuery should create a query for pull requests', t => {
	const url = 'https://github.com/alex-page/test-actions/pulls/1';
	const eventName = 'pull_request';
	const project = 'Backlogg';

	t.is(generateProjectQuery(url, eventName, project), pullrequestQuery);
});

test('generateProjectQuery should create a query for pull requests when project belongs to org', t => {
	const url = 'https://github.com/alex-page/test-actions/pulls/1';
	const eventName = 'pull_request';
	const project = 'https://github.com/orgs/SomeOrg/projects/2';

	t.is(generateProjectQuery(url, eventName, project), pullrequestQueryForOrgProject);
});
