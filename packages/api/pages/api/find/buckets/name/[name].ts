import type { NextApiRequest, NextApiResponse } from "next";
import { StorageBucket } from "@core/types/api";
import { apiFetchBucketByName } from "@handlers/apiBucketServices";

type ResponseData = StorageBucket | null;
type ResponseError = { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ResponseError>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { name } = req.query;

    const bucket = await apiFetchBucketByName(String(name));

    if (!bucket) {
      return res.status(404).json({ message: "Bucket not found" });
    }

    return res.status(200).json(bucket);
  } catch (e) {
    return res
      .status(500)
      .json({ message: "An error occurred on the server." });
  }
}
