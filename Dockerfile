FROM node:18-alpine as build

COPY ./tsconfig.build.json .
COPY ./package.json .
COPY ./tslint.json .
COPY ./tsconfig.json .
COPY ./dist .
WORKDIR /src

ADD . /src

RUN yarn  

FROM node:18-alpine
COPY --from=build /src/tsconfig.json /opt/app/tsconfig.json
COPY --from=build /src/tslint.json /opt/app/tslint.json
COPY --from=build /src/dist /opt/app
COPY --from=build /src/node_modules /opt/app/node_modules
WORKDIR /opt/app

ENV NODE_ENV=production

ENTRYPOINT ["yarn", "start:swc"]
