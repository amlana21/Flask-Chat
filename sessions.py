import json

class Sessions:

    def __init__(self,username):
        self.username=username


    def addsession(self,sessionid):
        session_read=[]
        with open('sessions.json','r') as read_session:
            session_read=json.load(read_session)
        for s in  session_read:
            if self.username==s['username']:
                print('exist')
                outpt='error'
                return outpt
        session_read.append({'username':self.username,'sessionid':sessionid})
        with open('sessions.json','w') as write_session:
            json.dump(session_read,write_session)
        return session_read

    @staticmethod
    def readsession():
        session_read=[]
        with open('sessions.json','r') as read_session:
            session_read=json.load(read_session)
        return session_read

    @staticmethod
    def readsessionid(usrname):
        session_read=[]
        with open('sessions.json','r') as read_session:
            session_read=json.load(read_session)
        sessionarry=list(filter(lambda x:x['username']==usrname,session_read))
        return sessionarry[0]['sessionid']

    @staticmethod
    def delsession(sessionid):
        session_read = []

        with open('sessions.json', 'r') as read_session:
            session_read = json.load(read_session)
        session_out=list(filter(lambda x:x['sessionid']!=sessionid,session_read))
        session_del=list(filter(lambda x:x['sessionid']==sessionid,session_read))
        print(session_out)
        with open('sessions.json','w') as write_sess:
            json.dump(session_out,write_sess)
        return session_del

# sessionob=Sessions('xyz')

# print(sessionob.readsession())
# print(sessionob.addsession())

# sessionob.delsession()