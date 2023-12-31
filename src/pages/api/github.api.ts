import { Octokit } from '@octokit/rest';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth].api';

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
            id: issue.number,
            body: issue.body,
            updateTime: issue.updated_at,
            label: issue.labels.map((label) => (typeof label === 'string' ? label : label.name)),
          };
        });
      });

    return res.send(data);
  }

  if (request.method === 'POST') {
    const session = await getServerSession(request, res, authOptions);
    if (!session?.user?.email) {
      return res.status(200).json({
        success: false,
        data: [],
        error: 'Not logged in',
      });
    }
    if (session?.user?.name !== 'chenshuai2144') {
      return res.status(200).json({
        success: false,
        data: [],
        error: 'No Access',
      });
    }
    const { owner, repo, id, body } = JSON.parse(request.body);

    const data = await octokit.rest.issues.createComment({
      repo,
      owner,
      issue_number: id,
      body,
    });
    return res.send(data);
  }
}
