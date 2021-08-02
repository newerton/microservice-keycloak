FROM node:16.2

ARG UID=1000

RUN apt install bash

ADD https://yarnpkg.com/latest.tar.gz /opt/yarn.tar.gz
RUN cd /opt \
  && mkdir yarn \
  && tar xzf yarn.tar.gz -C yarn --strip-components 1 \
  && cd /usr/local/bin

USER ${UID}

WORKDIR /home/node/app