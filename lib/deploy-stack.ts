import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as codecommit from "aws-cdk-lib/aws-codecommit";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipelineactions from "aws-cdk-lib/aws-codepipeline-actions";
import { Construct } from "constructs";

interface DeployStackProps extends cdk.StackProps {
  appBucket: s3.Bucket;
  codepipelineServiceRole: iam.Role;
}

export class DeployStack extends cdk.Stack {
  public readonly buildProjectRoleDefaultPolicyPath: string;

  constructor(scope: Construct, id: string, props: DeployStackProps) {
    super(scope, id, props);
    const { appBucket, codepipelineServiceRole } = props;
    const codepipelineServiceRoleNoUpdate =
      codepipelineServiceRole.withoutPolicyUpdates();
    const myPipeline = new codepipeline.Pipeline(this, "Pipeline", {
      artifactBucket: appBucket,
      role: codepipelineServiceRoleNoUpdate,
    });
    // source
    const sourceOutput = new codepipeline.Artifact("SourceOutput");
    const codecommitRepository = codecommit.Repository.fromRepositoryName(
      this,
      "CodecommitRepository",
      "ecs-repo"
    );
    const sourceAction = new codepipelineactions.CodeCommitSourceAction({
      actionName: "SourceAction",
      repository: codecommitRepository,
      role: codepipelineServiceRoleNoUpdate,
      output: sourceOutput,
    });
    myPipeline.addStage({ stageName: "SourceStage", actions: [sourceAction] });
    // build
    const buildOutput = new codepipeline.Artifact("BuildOutput");
    const buildProject = new codebuild.PipelineProject(this, "BuildProject");
    const buildAction = new codepipelineactions.CodeBuildAction({
      actionName: "BuildAction",
      input: sourceOutput,
      project: buildProject,
      role: codepipelineServiceRoleNoUpdate,
      outputs: [buildOutput],
    });
    myPipeline.addStage({ stageName: "BuildStage", actions: [buildAction] });
    // public
    this.buildProjectRoleDefaultPolicyPath = `${buildProject}/Role/DefaultPolicy/Resource`;
  }
}
