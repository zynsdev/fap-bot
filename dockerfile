FROM mcr.microsoft.com/playwright:focal

WORKDIR /app

#Setup environment
RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_15.x  | bash -
RUN apt-get -y install nodejs

COPY ["package.json", "./"]

#Install libraries
RUN yarn install -prod 
RUN yarn global add typescript
RUN yarn audit
RUN yarn cache clean

#Copy source code
COPY . .

#Ts to Js
RUN tsc --build

#Remove all *.ts files
RUN rm -rf *.ts

#Run app
CMD PORT=$PORT node ./dist/app.js