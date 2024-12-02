import { Octokit } from 'octokit';

export async function createTeamRepository(
  teamName: string,
  teamMembers: string[],
  mentorUsername: string,
  githubToken: string,
  orgName: string
) {
  try {
    const octokit = new Octokit({
      auth: githubToken
    });

    // Create repository
    const repoName = teamName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const { data: repo } = await octokit.rest.repos.createInOrg({
      org: orgName,
      name: repoName,
      private: true,
      auto_init: true,
      description: `Project repository for team ${teamName}`,
      homepage: '',
      has_issues: true,
      has_projects: true,
      has_wiki: true
    });

    // Add team members and mentor as collaborators
    const collaborators = [...new Set([...teamMembers, mentorUsername])];
    for (const username of collaborators) {
      try {
        await octokit.rest.repos.addCollaborator({
          owner: orgName,
          repo: repoName,
          username,
          permission: 'admin'
        });
      } catch (error) {
        console.error(`Failed to add collaborator ${username}:`, error);
        // Continue with other collaborators even if one fails
      }
    }

    // Create initial README content
    const readmeContent = `# ${teamName}

## Team Members
- ${teamMembers[0]} (Team Leader)
- ${teamMembers[1]}
- ${teamMembers[2]}

## Mentor
- ${mentorUsername}

## Project Description
Add your project description here.

## Getting Started
1. Clone the repository
2. Install dependencies
3. Start development

## Development Guidelines
1. Create feature branches
2. Make small, focused commits
3. Write descriptive commit messages
4. Create pull requests for review

## Resources
- [Project Documentation](docs/)
- [Development Setup](docs/setup.md)
- [Contributing Guidelines](CONTRIBUTING.md)
`;

    // Update README
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: orgName,
      repo: repoName,
      path: 'README.md',
      message: 'Initial project setup',
      content: Buffer.from(readmeContent).toString('base64'),
      committer: {
        name: 'Team Registration Platform',
        email: 'noreply@example.com'
      },
      author: {
        name: 'Team Registration Platform',
        email: 'noreply@example.com'
      }
    });

    return { success: true, repoUrl: repo.html_url };
  } catch (error) {
    console.error('GitHub repository creation error:', error);
    return { success: false, error: 'Failed to create GitHub repository' };
  }
}