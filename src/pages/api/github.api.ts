import { Octokit } from '@octokit/rest';
import { NextApiRequest, NextApiResponse } from 'next';

const { GITHUB_TOKEN } = process.env;

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

export default async function handler(request: NextApiRequest, res: NextApiResponse) {
  if (request.method === 'GET') {
    const { owner, repo, page, pageSize } = (await request.query) as unknown as {
      owner: string;
      repo: string;
      page: number;
      pageSize: number;
    };
    const data = await octokit
      .paginate(
        octokit.rest.issues.listForRepo,
        {
          owner,
          repo,
          since: '2023-01-01',
          state: 'open',
          sort: 'created',
          page,
          per_page: pageSize * page,
        },
        (response) => response.data,
      )
      .then((issues) => {
        return issues.map((issue) => {
          return {
            title: issue.title,
            id: issue.id,
            body: issue.body,
          };
        });
      });

    return res.send(data);
  }

  if (request.method === 'POST') {
    const { owner, repo, issue_number, body } = request.body;
    const data = await octokit.rest.issues.createComment({
      repo,
      owner,
      issue_number,
      body,
    });
    return res.send(data);
  }
}
