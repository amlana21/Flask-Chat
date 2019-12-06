import json
from time import localtime,strftime,time

class Message:

    def __init__(self,username):
        self.username=username
        self.messages=[]
        self.directmessages=[]

    def addmessages(self,frm,msgtxt,room):
        # msgdict={'frm':frm,'msgtxt':msgtxt,'room':room,'createdAt':strftime('%m-%d-%Y %H:%M:%S',localtime())}
        # msgdict={'frm':frm,'msgtxt':msgtxt,'room':room,'createdAt':time()}
        # moment('2016-03-12 13:00:00').add(1, 'day').format('LLL')
        self.countmessages(room)
        msgdict={'frm':frm,'msgtxt':msgtxt,'room':room,'createdAt':strftime('%Y-%m-%d %H:%M:%S',localtime())}
        self.messages.append(msgdict)

    def writemessages(self):        
        with open('messages.json','w') as write_message:
            json.dump(self.messages,write_message)
    
    def readmessages(self):
        with open('messages.json','r') as read_file:
            self.messages=json.load(read_file)

    def readmessage(self,channel):
        messagearray=[]
        self.readmessages()
        # for msg in self.messages:
        #     if msg['room']==channel:
        #         messagearray.append(msg)
        messagearray=list(filter(lambda x:x['room']==channel,self.messages))
        return messagearray


    def senddirect(self,to,message,frm):
        msgdict={'frm':frm,'msg':message,'to':to,'createdAt':strftime('%Y-%m-%d %H:%M:%S',localtime())}
        self.directmessages.append(msgdict)
        #

    def writedirect(self):
        with open('directmessages.json','w') as write_direct:
            json.dump(self.directmessages,write_direct)

    def readdirect(self):
        with open('directmessages.json','r') as read_direct:
            self.directmessages=json.load(read_direct)

    def countmessages(self,channel):
        filtered=list(filter(lambda x:x['room']==channel,self.messages))
        
        print(len(filtered))
        print(filtered)
        if len(filtered)==100:
            self.messages=list(filter(lambda x:x['room']!=channel,self.messages))
            popped=filtered.pop(0)
            print(popped)
            print(f'After Filtered:{filtered}')
            for v in filtered:
                self.messages.append(v)
        # else:
        #     self.messages.append(filtered)
        

# channelobj=Message('abc')
# channelobj.readmessages()
# channelobj.addmessages('abc','test message','newchannel2')
# channelobj.writemessages()

# channelobj.readmessage()

# channelobj.readdirect()
# channelobj.senddirect('xyz','a reply','abc')
# channelobj.writedirect()