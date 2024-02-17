import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // if (req.method === 'POST') {
  //   // Process a POST request
  // } else {
  //   // Handle any other HTTP method
  // }

  return res.status(200).json({ name: 'Successful' });
}
