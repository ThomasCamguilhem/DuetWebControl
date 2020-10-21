#import json
import requests
import datetime
import time
import sys
import os
import traceback
from functools import partial
from urllib.parse import urlencode, quote_plus

ip = "192.168.99.10"
sent = 0
err = 0
cpt = 0
globDate = datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S')

#python3 main.py -d /home/Shared/tmp/ES_v1.0.2/ -l /home/Shared/tmp/curl.log -o /var/www/html/rr/reply

def log_print(*msg, file=sys.stdout):
	if type(file) == type(''):
		file=open(file, "a")
		print(datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S'), *msg, file=file)
		file.close()
	else :
	 print(datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S'), *msg, file=file)

# Print iterations progress
def printProgressBar (iteration, total, prefix = '', suffix = '', decimals = 2, length = 100, fill = '\u2588', printEnd = "\r", file = sys.stdout):
	"""
	Call in a loop to create terminal progress bar
	@params:
		iteration   - Required  : current iteration (Int)
		total	   - Required  : total iterations (Int)
		prefix	  - Optional  : prefix string (Str)
		suffix	  - Optional  : suffix string (Str)
		decimals	- Optional  : positive number of decimals in percent complete (Int)
		length	  - Optional  : character length of bar (Int)
		fill		- Optional  : bar fill character (Str)
		printEnd	- Optional  : end character (e.g. "\r", "\r\n") (Str)
	"""
	percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
	partLength = int(length * 8 * iteration // total)
	filledLength = int(partLength / 8)
	lastPart = partLength - (filledLength * 8)
	switch = {
		0 : '-',
		1 : '\u2581',
		2 : '\u2582',
		3 : '\u2583',
		4 : '\u2584',
		5 : '\u2585',
		6 : '\u2586',
		7 : '\u2587',
		8 : '\u2588',
#		7 : '\u2589',
#		6 : '\u258A',
#		5 : '\u258B',
#		4 : '\u258C',
#		3 : '\u258D',
#		2 : '\u258E',
#		1 : '\u258F',
	}
	if lastPart > 0 :
		bar = fill * filledLength + switch.get(lastPart) + '-' * (length-1 - filledLength)
	else:
		bar = fill * filledLength + '-' * (length - filledLength)
		
	if type(file) == type(''):
		file=open(file, "wb")
		file.write(f'\r{{"prefix": "{prefix}" , "bar" : "{bar}",  "percent": {percent}, "suffix" : "{suffix}"}}'.encode())
		# Print New Line on Complete
		if iteration == total: 
			print()
		file.close()
	else :
		print(f'\r{prefix} |{bar}| {percent}% {suffix}', end = printEnd)
		# Print New Line on Complete
		if iteration == total: 
			print()

def readDir(path = "", logFile = sys.stdout, progFile = sys.stdout) :
	localList = os.listdir("./" + path)
	for item in localList :
		if os.path.isdir("./" + path + item + '/') :
			log_print("Creating " + item, file = logFile)
			makeDir(path + item + "/", logFile, progFile)
			readDir(path + item + "/", logFile, progFile)
		elif os.path.isfile("./" + path + item) :
			log_print("Sending " + item, file = logFile)
			sendFile(path = path + item, item = item, logFile = logFile, progFile=progFile)
	
def makeDir(path = "", logFile = sys.stdout, progFile = sys.stdout) :
	global sent
	global globDate
	payload = {'dir': "0:/" + path}
	encoded = "?" + urlencode(payload, quote_via=quote_plus)
	url = "http://" + ip + "/rr_filelist" + encoded
	response = requests.get(url)
	if 'err' in response.json():
		uri = 'http://' + ip + '/rr_mkdir?dir=0:/' + path
		url = requests.utils.requote_uri(uri)
		response = requests.get(url)
		if 'err' in response.json() and response.json()['err'] == 0:
			log_print('Directory created', file = logFile)
			sent += 1
			# Update Progress Bar
			printProgressBar(sent, cpt, prefix = 'Update', suffix = 'Complete', length = 50, file = progFile)
		else :
			log_print(response.text, file = sys.stderr)
	log_print('Creating backup directory ' + "/var/www/html/SD/Backup/" + globDate + "/" + path , file = logFile)
	os.makedirs("/var/www/html/SD/Backup/" + globDate + "/" + path , exist_ok=True)
	time.sleep(1)
	   
def sendFile(path = "", item = "", logFile = sys.stdout, progFile = sys.stdout) :
	global sent
	global globDate
	date = (datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S'))
	payload = {'name': "0:/" + path, 'time': date}
	encoded = "?" + urlencode(payload, quote_via=quote_plus)
	url = "http://" + ip + "/rr_fileinfo" + encoded
	response = requests.get(url)
	if 'err' in response.json() and response.json()['err'] == 0:
			url = "http://" + ip + "/rr_download" + encoded
			response = requests.get(url)
			with open("/var/www/html/SD/Backup/" + globDate + "/" + path, 'wb') as f :
					for chunk in response:
							f.write(chunk)
	url = "http://" + ip + "/rr_upload" + encoded
	printProgressBar(sent, cpt, prefix = 'Update', suffix = 'Complete\n' + item + ' sent', length = 50, file = progFile)
	data = b''
	try :
		with open(path, 'rb') as file :
			for line in iter(partial(file.read, 1024), b''):
				data += line
				#print(line)
			response = requests.post(url, data)
			file.close()
		if 'err' in response.json() and response.json()['err'] == 0:
			sent += 1
			log_print('File Sent ' + "{:.2f}".format((sent/cpt)*100) + "% done", file = logFile)
			# Update Progress Bar
			printProgressBar(sent, cpt, prefix = 'Update', suffix = 'Complete', length = 50, file = progFile)
		else :
			log_print(response.text, file = sys.stderr)
			err += 1
	except Exception as e:
		log_print('ERROR', e, file=sys.stderr)
		traceback.print_exc()
		print(url)
		print(response.text)
	time.sleep(1)
	
################################################################################

if __name__ == "__main__":
	print(sys.argv)
	logFile = sys.stdout
	progFile = sys.stdout
	
	x = 1
	while x < len(sys.argv) :
		if sys.argv[x] == "-d" or sys.argv[x] == "--dir":
			x = x+1
			os.chdir(sys.argv[x])
		elif sys.argv[x] == "-l" or sys.argv[x] == "--log":
			x = x+1
			logFile = sys.argv[x]
		elif sys.argv[x] == "-o" or sys.argv[x] == "--output":
			x = x+1
			progFile = sys.argv[x]
		else:
			print("unsupported option " + sys.argv[x], sys.stderr)
			sys.exit(1)
		x = x+1
	
	localList = os.listdir("./")
	if "Duet" in localList:
		os.chdir("Duet")
		cpt = sum([len(files) for r, d, files in os.walk("./")])
		# Initial call to print 0% progress
		printProgressBar(0, cpt, prefix = 'Update', suffix = 'Complete', length = 50, file = progFile)
		readDir(logFile = logFile, progFile = progFile)
		os.chdir("../")
		
	# if "Firmware" in localList :
		# os.chdir("Firmware")
		# localList = os.listdir("./")
	# #	print(localList)
		# date = (datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S'))
		# uri = "http://" + ip + "/rr_upload?name=0:/sys/" + localList[0] + "&time=" + date
		# url = requests.utils.requote_uri(uri)
		# data = b''
		# with open(localList[0] , 'rb') as file :
			# for line in iter(partial(file.read, 1024), b''):
				# data += line
				# #print(line)
			# response = requests.post(url, data)
			# file.close()
		# log_print(url, logFile)
		# if 'err' in response.json() and response.json()['err'] == 0:
			# log_print('File Sent', file = logFile)
		# else :
			# log_print(response.text, file = sys.stderr)
		# os.chdir("../")
		
	# localList = os.listdir("./")
	# if "PC" in localList :
		# os.chdir("PC")
		# try :
			# os.popen("rm /var/www/html/*/app.*")
		# except Exception as e:
			# log_print('ERROR', e, file=sys.stderr)
		# os.popen("cp -R * /var/www/html/")
		# try :
			# os.popen("rm /var/www/html/*.gz")
			# os.popen("rm /var/www/html/*.zip")
			# os.popen("rm /var/www/html/*/*.gz")
			# os.popen("chmod -Rc 777 /var/www/html/")
		# except Exception as e:
			# log_print('ERROR', e, file=sys.stderr)
			# os.chdir("../")
		
	# if "Firmware" in localList :
		# payload = {'gcode': "M997"}
		# encoded = "?" + urlencode(payload, quote_via=quote_plus)
		# url = "http://" + ip + "/rr_gcode" + encoded
		# response = requests.get(url)
		# if 'err' in response.json() and response.json()['err'] == 0:
			# log_print('File Sent', file = logFile)
		# else :
			# log_print(response.text, file = sys.stderr)
		# time.sleep(2)
		# os.popen("pkill chromium-browse")
		# time.sleep(10)
		# os.popen("(DISPLAY=:0 chromium-browser localhost --kiosk --start-fullscreen --incognito --noerrdialogs --disable-translate --no-first-run --fast --fast-start --disable-infobars --disable-features=TranslateUI --disk-cache-dir=/dev/null --disable-pinch --overscroll-history-navigation=0 --force-device-scale-factor=1.20 || notify-send 'Web Control' 'The interface was unable to restart' -u critical)&")
		
