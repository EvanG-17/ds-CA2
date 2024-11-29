

aws s3 cp test.txt s3://a-bucket/test.txt --metadata '{"x-amz-meta-cms-id":"34533452"}'


### When file is installed, please ensure that a **env.ts** file is created in the root folder with the following information filled in:

export const SES_REGION = 'eu-west-1';
export const SES_EMAIL_FROM = 'blankMail@test.com' ;
export const SES_EMAIL_TO =  'blankMail@test.com';
