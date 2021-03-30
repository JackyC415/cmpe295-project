# Pre-req:

1) Download and install Nodejs w/ npm: https://nodejs.org/en/
2) Download and install git
3) Download and install Robo3T (MongoDB GUI) and setup mongo https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
4) Download and install Python (version 3.6.5 recommended) and PIP; install tensorflow (version 1.15.0 recommended)
5) git clone https://github.com/JackyC415/cmpe295-project.git

# Frontend (client) manual run instruction:
1) cd cmpe295-project/client/
2) npm install
3) npm start 

# Backend (server) manual run instruction:
1) cd cmpe295-project/server/
2) npm install
3) npm start

# Run concurrently instruction:
1) Ensure modules are installed in both server and client
2) cd cmpe295-project/server/
3) npm run dev

# Jumpstart instruction:
git clone https://github.com/JackyC415/cmpe295-project.git && cd cmpe295-project && cd client && npm i && cd ../server && npm i && npm run dev

# MISC: to persist scraped data to MongoDB:
1) npm install json2csv
2) cd cmpe295-project/server/
3) node dbparser.js

# install indeed scraper:
npm install indeed-scraper
