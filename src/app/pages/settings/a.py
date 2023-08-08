# importing the requests library
import requests
 
# defining the api-endpoint
API_ENDPOINT = "https://utility.arpa.piemonte.it/post_opennoise/send_data.php"
 
 
# data to be sent to api
data = {'lat': 'stefano_py01',
'lon': 'aaa',
'so_type': 'aaa',
'so_version': 'aaa',
'phone_type': 'aaa',
'freq_max': 'aaa',
'fre_min': 'aaa',
'gain': 'aaa',
'calib_type': 'aaa',
'user_type': 'aaa',
'codice_sicurezza': 'AAssEE44ttggVV&rrrr'}
       
 
# sending post request and saving response as response object
r = requests.post(url=API_ENDPOINT, data=data)
 
# extracting response text
pastebin_url = r.text
print("The pastebin URL is:%s" % pastebin_url)