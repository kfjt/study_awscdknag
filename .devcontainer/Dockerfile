FROM public.ecr.aws/codebuild/amazonlinux2-x86_64-standard:5.0
ENTRYPOINT [ "tail", "-f", "/dev/null" ]
ENV AWS_PROFILE=localstack
RUN { \
    echo 'alias awslocal="aws --endpoint-url=http://localstack:4566 --profile localstack"'; \
    } >> /root/.bashrc
RUN <<EOF
npm i -g aws-cdk aws-cdk-local
aws configure set aws_access_key_id dummy --profile localstack
aws configure set aws_secret_access_key dummy --profile localstack
aws configure set region ap-northeast-1 --profile localstack
EOF
# RUN curl -s localstack:4566/_localstack/init