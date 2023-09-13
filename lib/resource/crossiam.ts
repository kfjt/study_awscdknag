import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as nag from "cdk-nag";

/**
 * iam for
 * 1. Cross Deploy
 */
export class CrossIam extends Construct {
  public readonly crossDeployRole: iam.Role;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const appBucketArn = cdk.Fn.importValue("AppBucketArn");

    const crossDeployRole = new iam.Role(this, "CrossDeployRole", {
      assumedBy: new iam.ServicePrincipal("codepipeline.amazonaws.com"),
    });
    const appBucket = s3.Bucket.fromBucketArn(this, "AppBucket", appBucketArn);
    appBucket.grantReadWrite(crossDeployRole);

    // public
    this.crossDeployRole = crossDeployRole;
    new cdk.CfnOutput(this, "CrossDeployRoleArn", {
      value: crossDeployRole.roleArn,
      exportName: "CrossDeployRoleArn",
    });
    // nag
    nag.NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      [`${crossDeployRole}/DefaultPolicy/Resource`],
      [
        {
          id: "AwsSolutions-IAM5",
          reason: "DefaultPolicy contains wildcard permissions",
        },
      ]
    );
  }
}
