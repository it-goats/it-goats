FROM node:16.14.2

WORKDIR /cabra

ADD entrypoint.sh /bin/docker-entrypoint.sh

RUN chmod +x /bin/docker-entrypoint.sh

COPY package.json package-json.lock* /cabra/

RUN npm install

COPY . /cabra

ENTRYPOINT ["/bin/docker-entrypoint.sh"]
CMD npm run dev