Modify "page function" of  each task (use code in directory page_function)
Run node server

Use demo (only without mongodb)
	- Run task of apify:
		+ Request url: {domnain}:{port}/run_write?task={task}
	- Get detail data:
		+ Request url (get 1 item/time) : {domnain}:{port}/get_detail
		+ Request url (auto run)		: {domnain}:{port}/get_detail?auto=1
		+ if use crontab/cronjob on server (auto run by time) use url: {domnain}:{port}/get_detail
	-Provide json data via:
		+ url: {domnain}:{port}/read
    
    Run Local
    node server  (to run the server)
    to get temp data file -- all file will be store in file temp
    http://127.0.0.1:3000/run_write?task=tin-trung-vu~indeed
    http://127.0.0.1:3000/run_write?task=tin-trung-vu~ziprecruiter
    To get the full JSON FILE -- plese take a look at the get detail data
    for now -- can run auto -- to prevent locked as BOT 1 minutes will get 1 full items
    http://127.0.0.1:3000/get_detail?auto=1
    
Other for API apify page
https://api.apify.com/v2/datasets/ZwtYBlf5fIjO1RCPo/items?format=json&clean=1
