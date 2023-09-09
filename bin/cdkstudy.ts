#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { CdkstudyStack } from "../lib/cdkstudy-stack";

const app = new cdk.App();
new CdkstudyStack(app, "CdkstudyStack", {
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
