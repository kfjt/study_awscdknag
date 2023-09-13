import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";

interface MyIamProps {}

/**
 * iam for
 * 1. Codepipeline Service Role
 */
export class MyIam extends Construct {
  public readonly codepipelineServiceRole: iam.Role;

  constructor(scope: Construct, id: string, props?: MyIamProps) {
    super(scope, id);

    const codepipelineServiceRole = new iam.Role(
      this,
      "CodepipelineServiceRole",
      {
        assumedBy: new iam.ServicePrincipal("codepipeline.aws.com"),
      }
    );
    // public
    this.codepipelineServiceRole = codepipelineServiceRole;
  }
}
