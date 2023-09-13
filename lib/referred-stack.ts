import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { MyS3 } from "./resource/mys3";
import { MyIam } from "./resource/myiam";

export class ReferredStack extends cdk.Stack {
  public readonly appBucket: s3.Bucket;
  public readonly codepipelineServiceRole: iam.Role;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { appBucket } = new MyS3(this, "Storage");
    const { codepipelineServiceRole } = new MyIam(this, "Identity");
    // public
    this.appBucket = appBucket;
    this.codepipelineServiceRole = codepipelineServiceRole;
  }
}
