To begin, please ensure a **env.ts** file is created in the root directory of the cloned file.

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
