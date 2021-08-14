FROM node:16-alpine as builder
WORKDIR /root
COPY ./ ./
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
  && apk update --no-cache \
  && apk upgrade --no-cache \
  && yarn config set registry https://registry.npm.taobao.org \
  && yarn global add pm2 \
  && yarn \
  && yarn build \
  && rm -rf node_modules 

FROM node:16-alpine
WORKDIR /root
COPY --from=builder /root/ /root/
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
  && apk update --no-cache \
  && apk upgrade --no-cache \
  && yarn config set registry https://registry.npm.taobao.org \
  && yarn global add pm2 \
  && yarn --production
ENV NODE_ENV="production"
EXPOSE 4000
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]