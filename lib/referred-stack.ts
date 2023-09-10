import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { MyS3 } from "./resource/mys3";

export class ReferredStack extends cdk.Stack {
  public readonly storage;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const storage = new MyS3(this, "Storage");
    this.storage = storage;
  }
}
