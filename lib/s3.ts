import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function createS3Client(): S3Client {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing required AWS environment variables: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY"
    );
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

let _s3Client: S3Client | null = null;

export const s3Client: S3Client = new Proxy({} as S3Client, {
  get(_target, prop, receiver) {
    if (!_s3Client) {
      _s3Client = createS3Client();
    }
    return Reflect.get(_s3Client, prop, receiver);
  },
});

export async function getSignedDownloadUrl(key: string): Promise<string> {
  if (!_s3Client) {
    _s3Client = createS3Client();
  }

  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) {
    throw new Error("AWS_S3_BUCKET environment variable is not defined");
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(_s3Client, command, { expiresIn: 900 });
}
