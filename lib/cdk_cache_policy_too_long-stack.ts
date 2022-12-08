import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class CdkCachePolicyTooLongStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipelineSource = cdk.pipelines.CodePipelineSource.s3(
      new cdk.aws_s3.Bucket(this, "Bucket"),
      "source.zip"
    );

    const pipeline = new cdk.pipelines.CodePipeline(this, "APipelineWithAFancyName", {
      synth: new cdk.pipelines.ShellStep("Synth", {
        input: pipelineSource,
        commands: ["npm ci", "npx cdk synth"],
      }),
    });

    const stageConstruct = new TheStageConstruct(this, "AStageConstructWithAFancyName")
    const stack = new cdk.Stack(stageConstruct.stage, "AStackWithAFancyName");
    new TheConstruct(stack, "TheConstructWithAFancyName")

    pipeline.addStage(stageConstruct.stage);
  }
}

class TheStageConstruct extends Construct {
    readonly stage: cdk.Stage
    constructor(scope: Construct, id: string) {
        super(scope, id)
        this.stage = new cdk.Stage(this, "Stage");

    }
}

class TheConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const distribution = new cdk.aws_cloudfront.Distribution(
      this,
      "DistributionWithAFancyName",
      {
        defaultBehavior: {
          origin: new cdk.aws_cloudfront_origins.S3Origin(
            new cdk.aws_s3.Bucket(this, "WebsiteBucket")
          ),
          cachePolicy: new cdk.aws_cloudfront.CachePolicy(this, "A", { // too long!!
            headerBehavior:
              cdk.aws_cloudfront.CacheHeaderBehavior.allowList("some-header"),
          }),
        },
        defaultRootObject: "index.html",
      }
    );
  }
}
