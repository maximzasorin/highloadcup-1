FROM ubuntu

WORKDIR /usr/app

# Install Node
RUN apt-get update -qq && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

# Install MongoDB
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
RUN echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.4.list
RUN apt-get update -qq && apt-get install -y mongodb-org

RUN mkdir -p /data/db /data/configdb

# Install supervisor
RUN apt-get install -y supervisor

# Install unzip
RUN apt-get install -y unzip

# Install jq
RUN apt-get install -y jq

# Copy app
COPY . .

# Install dependencies
RUN npm install

# Create logs dir
RUN bash -c 'mkdir -p /usr/app/logs'

CMD ["/usr/bin/supervisord", "-c", "supervisord.conf"]

EXPOSE 80