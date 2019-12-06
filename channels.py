import json
class Channel:
    
    def __init__(self,username):
        self.username=username
        self.channels=[]

    
    def addchannel(self,channelname):
        channeldict={}        
        channeldict['channelname']=channelname
        self.channels.append(channeldict)

    
    def writechannels(self):
        with open('channels.json','w') as channel_file:
            json.dump(self.channels, channel_file)

    def readchannel(self):
        with open('channels.json','r') as channel_file:
            self.channels=json.load(channel_file)

    def checkduplicates(self,inpt):
        # self.readchannel()
        matched=[chnl for chnl in self.channels if chnl['channelname']==inpt]
        if len(matched)>0:
            return True
        else:
            return False


# channelobj=Channel('abc')
# channelobj.readchannel()
# channelobj.addchannel('newchannel2')
# channelobj.writechannels()
