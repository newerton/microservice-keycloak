FROM node:16.2-alpine

RUN apk add --no-cache bash

ADD https://yarnpkg.com/latest.tar.gz /opt/yarn.tar.gz
RUN cd /opt \
  && mkdir yarn \
  && tar xzf yarn.tar.gz -C yarn --strip-components 1 \
  && cd /usr/local/bin

USER node

WORKDIR /home/node/app