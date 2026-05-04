import express from 'express';
import { Octokit } from 'octokit';

export default async function githubHandler(req: express.Request, res: express.Response) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return res.status(500).json({ error: 'GITHUB_TOKEN is not configured on the server.' });
  }

  const octokit = new Octokit({ auth: token });

  try {
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 6
    });

    res.json({
      user: {
        login: user.login,
        avatar_url: user.avatar_url,
        html_url: user.html_url,
        name: user.name,
        bio: user.bio,
        public_repos: user.public_repos,
        followers: user.followers
      },
      repos: repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        language: repo.language
      }))
    });
  } catch (error: any) {
    console.error('GitHub API Error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to fetch GitHub data' });
  }
}
