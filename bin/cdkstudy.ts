#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AwsSolutionsChecks, NagSuppressions } from "cdk-nag";
import { ReferredStack } from "../lib/referred-stack";
import { DeployStack } from "../lib/deploy-stack";
import { AppStack } from "../lib/app-stack";

const app = new cdk.App();

const envValsDev = app.node.tryGetContext("dev");
const envDev = {
  account: envValsDev["env"]["account"],
  region: envValsDev["env"]["region"],
};

const envValsPrd = app.node.tryGetContext("prd");
const envPrd = {
  account: envValsPrd["env"]["account"],
  region: envValsPrd["env"]["region"],
};

const referredStack = new ReferredStack(app, "ReferredStack", { env: envDev });
const { appBucket, codepipelineServiceRole } = referredStack;
const deployStack = new DeployStack(app, "DeployStack", {
  env: envDev,
  appBucket,
  codepipelineServiceRole,
});
// const appStack = new AppStack(app, "AppStack", { env: envPrd });
cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
NagSuppressions.addResourceSuppressionsByPath(
  deployStack,
  [deployStack.buildProjectRoleDefaultPolicyPath],
  [
    {
      id: "AwsSolutions-IAM5",
      reason: "DefaultPolicy contains wildcard permissions",
    },
  ]
);
