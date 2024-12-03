## Assignment 2 (EDA app) - Distributed Systems.

__Name:__ Evan Geary

__YouTube Demo link__ - [The URL of the video demonstration of the app.]

[ Note: The video must include an audio.]

### Phase 1.

[ List the Lambda functions in this phase's architecture and state their working status - Fully implemented / Partially working / Not implemented. For partially working lambdas, state briefly what is defective in their implementation.]

e.g.

+ Confirmation Mailer - Fully implemented.
+ Rejection Mailer - Fully implemented.
+ Log Image -  Fully implemented. 

### Phase 2 (if relevant).

[ List the Lambda functions in this phase's architecture and state their working status - Fully implemented / Partially working / Not implemented. For partially working lambdas, state briefly what is defective in their implementation.]

e.g.

+ Confirmation Mailer - Fully implemented.
+ Rejection Mailer - Fully implemented 
+ Log Image - Fully implemented 
+ Update Table -  Fully implemented.

### Phase 3 (if relevant).

[ List the Lambda functions in this phase's architecture and state their working status - Fully implemented / Partially working / Not implemented. For partially working lambdas, state briefly what is defective in their implementation.]

e.g.

+ Confirmation Mailer - Fully implemented.
+ Process Image - Fully implemented.
+ Update Table - Fully implemented.
+ Delete Table - Fully Implemented.
+ Delete Bucket Image - Fully Implemented.
+ Confirmation Mailer Lambda Trigger - Fully Implemented.



To begin, please ensure a **env.ts** file is created in the root directory of the cloned file.

Please ensure that these email addresses have been verified on AWS.

Here is the file format below:

```
export const SES_REGION = 'eu-west-1';
export const SES_EMAIL_FROM = 'verifiedEmail@test.com'; 
export const SES_EMAIL_TO =  'verifiedEmail@test.com'; 
```
Next step is to run **npm install**
```
npm install
```
Once that is complete please run **cdk deploy**
```
cdk deploy
```

aws s3 cp test.txt s3://a-bucket/test.txt --metadata '{"x-amz-meta-cms-id":"34533452"}'



