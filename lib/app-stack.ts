import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import { CrossIam } from "./resource/crossiam";

export class AppStack extends cdk.Stack {
  public readonly crossDeployRole: iam.Role;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const crossIam = new CrossIam(this, "CrossIam");
    // public
    this.crossDeployRole = crossIam.crossDeployRole;
  }
}
