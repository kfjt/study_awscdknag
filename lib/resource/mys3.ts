import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as kms from "aws-cdk-lib/aws-kms";

interface MyS3Props {}

/**
 * storage for
 * 1. App
 * 2. Log
 */
export class MyS3 extends Construct {
  public readonly appBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: MyS3Props) {
    super(scope, id);

    const encryptionKey = new kms.Key(this, "S3Key", {
      enableKeyRotation: true,
    });
    const serverAccessLogsBucket = new s3.Bucket(this, "LogBucket", {
      enforceSSL: true,
      encryptionKey,
    });
    const appBucket = new s3.Bucket(this, "AppBucket", {
      serverAccessLogsBucket,
      enforceSSL: true,
      encryptionKey,
    });
    // public
    this.appBucket = appBucket;
  }
}
