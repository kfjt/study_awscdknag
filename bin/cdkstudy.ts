#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { ReferredStack } from "../lib/referred-stack";
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

new ReferredStack(app, "ReferredStack", { env: envDev });
new AppStack(app, "AppStack", { env: envPrd });
cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
