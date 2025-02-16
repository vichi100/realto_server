# How to login mongo db

admin@vmi2390151:~$ mongosh
Current Mongosh Log ID:	67b1076c4264af247b544ca6
Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8
Using MongoDB:		8.0.4
Using Mongosh:		2.3.8
mongosh 2.3.9 is available for download: https://www.mongodb.com/try/download/shell

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

test> use realtodb
switched to db realtodb
realtodb> db.auth("realto", "realto123")
{ ok: 1 }
realtodb> show collections
commercial_customers
commercial_properties
commercialpropertycustomers
customers
reminders
residential_customers
residential_properties
users
realtodb> 



### How to kill Process which is using a port ###

vichirajan@192 ~ % sudo lsof -i 7002       
Password: <your mac password>

vichirajan@192 ~ % sudo lsof -i :7002
COMMAND   PID       USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    68127 vichirajan   19u  IPv4 0xdc4c52e5d1247be6      0t0  TCP 192.168.1.9:afs3-prserver->192.168.1.6:60121 (ESTABLISHED)
node    68127 vichirajan   27u  IPv4 0x22b34ca9b1fbd644      0t0  TCP *:afs3-prserver (LISTEN)
node    68127 vichirajan   29u  IPv4 0xa75a392e36e53a95      0t0  TCP 192.168.1.9:afs3-prserver->192.168.1.6:60114 (ESTABLISHED)
vichirajan@192 ~ % kill 68127
vichirajan@192 ~ % sudo lsof -i :7002
vichirajan@192 ~ % 