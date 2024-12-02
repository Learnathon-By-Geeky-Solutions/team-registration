"use server";

import { sql } from "@/lib/db";
import { TeamFormData } from "@/lib/validations/team";
import { assignMentorsToTeams } from "@/lib/utils/assignment";
import { Octokit } from "@octokit/rest";
import { getConfig } from "@/lib/actions/config";

async function createTeamRepository(
    teamName: string,
    memberGithubUsernames: string[],
    mentorGithubUsername: string,
    githubToken: string,
    organizationName: string
) {
    const octokit = new Octokit({ auth: githubToken });
    const repoName = teamName.toLowerCase().replace(/[^a-z0-9-]/g, "-");

    try {
        // Create repository
        const { data: repo } = await octokit.repos.createInOrg({
            org: organizationName,
            name: repoName,
            private: false,
            auto_init: true, // This creates an initial commit with README
            description: `Repository for team ${teamName}`,
        });

        // Wait briefly for the repository to be fully initialized
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Add team members as collaborators
        const collaborators = [...memberGithubUsernames, mentorGithubUsername];
        for (const username of collaborators) {
            try {
                await octokit.repos.addCollaborator({
                    owner: organizationName,
                    repo: repoName,
                    username: username,
                    permission:
                        username === mentorGithubUsername ? "maintain" : "push",
                });
            } catch (error) {
                console.error(`Failed to add collaborator ${username}:`, error);
                // Continue with other collaborators even if one fails
            }
        }

        // Update README with team information
        const readmeContent = `# ${repoName}

## Team Members
${memberGithubUsernames
    .map(
        (username, index) =>
            `- ${username}${index === 0 ? " (Team Leader)" : ""}`
    )
    .join("\n")}

## Mentor
- ${mentorGithubUsername}

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

        // Get the current README content to get its SHA
        const { data: currentReadme } = await octokit.repos.getContent({
            owner: organizationName,
            repo: repoName,
            path: "README.md",
        });

        // Update README
        await octokit.repos.createOrUpdateFileContents({
            owner: organizationName,
            repo: repoName,
            path: "README.md",
            message: "Initial project setup",
            content: Buffer.from(readmeContent).toString("base64"),
            sha: (currentReadme as any).sha,
            committer: {
                name: "Team Registration Platform",
                email: "noreply@example.com",
            },
            author: {
                name: "Team Registration Platform",
                email: "noreply@example.com",
            },
        });

        return {
            success: true,
            repoUrl: repo.html_url,
        };
    } catch (error) {
        console.error("GitHub repository creation error:", error);
        return {
            success: false,
            error: "Failed to create GitHub repository. Please try again.",
        };
    }
}

export async function registerTeam(data: TeamFormData) {
    try {
        // Get GitHub configuration
        const config = await getConfig();
        if (!config?.github_token || !config?.organization_name) {
            return {
                success: false,
                error: "GitHub configuration is incomplete. Please contact the administrator.",
            };
        }

        // Insert team data
        const result = await sql`
      INSERT INTO teams (
        team_name, tech_stack, pitch_deck_url,
        leader_name, leader_github,
        member1_name, member1_github,
        member2_name, member2_github
      ) VALUES (
        ${data.teamName}, ${data.techStack}, ${data.pitchDeckUrl},
        ${data.leaderName}, ${data.leaderGithub},
        ${data.member1Name}, ${data.member1Github},
        ${data.member2Name}, ${data.member2Github}
      ) RETURNING id
    `;

        const teamId = result[0].id;

        // Assign mentor
        await assignMentorsToTeams();

        // Get assigned mentor
        const teamData = await sql`
      SELECT t.*, m.github_username as mentor_github
      FROM teams t
      LEFT JOIN mentors m ON t.mentor_id = m.id
      WHERE t.id = ${teamId}
    `;

        if (!teamData[0].mentor_id) {
            return {
                success: false,
                error: "No suitable mentor available for your technology stack",
            };
        }

        // Create GitHub repository
        const githubResult = await createTeamRepository(
            data.teamName,
            [data.leaderGithub, data.member1Github, data.member2Github],
            teamData[0].mentor_github,
            config.github_token,
            config.organization_name
        );

        if (!githubResult.success) {
            // Roll back team creation if GitHub repo creation fails
            await sql`DELETE FROM teams WHERE id = ${teamId}`;
            return {
                success: false,
                error: "Failed to create GitHub repository. Please try again.",
            };
        }

        return {
            success: true,
            teamId: teamId,
            mentorId: teamData[0].mentor_id,
            repoUrl: githubResult.repoUrl,
        };
    } catch (error) {
        console.error("Team registration error:", error);
        return { success: false, error: "Failed to register team" };
    }
}

export async function getTeams() {
    try {
        return await sql`
      SELECT t.*, 
             m.full_name as mentor_name,
             m.github_username as mentor_github
      FROM teams t
      LEFT JOIN mentors m ON t.mentor_id = m.id
      ORDER BY t.created_at DESC
    `;
    } catch (error) {
        return [];
    }
}

export async function updateTeam(id: number, data: TeamFormData) {
    try {
        await sql`
      UPDATE teams SET
        team_name = ${data.teamName},
        tech_stack = ${data.techStack},
        pitch_deck_url = ${data.pitchDeckUrl},
        leader_name = ${data.leaderName},
        leader_github = ${data.leaderGithub},
        member1_name = ${data.member1Name},
        member1_github = ${data.member1Github},
        member2_name = ${data.member2Name},
        member2_github = ${data.member2Github}
      WHERE id = ${id}
    `;
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update team" };
    }
}

export async function deleteTeam(id: number) {
    try {
        await sql`DELETE FROM teams WHERE id = ${id}`;
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete team" };
    }
}

export async function getTechStacks() {
    try {
        const stacks = await sql`SELECT name FROM tech_stacks ORDER BY name`;
        return stacks.map((stack) => stack.name);
    } catch (error) {
        return [];
    }
}
