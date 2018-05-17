from __future__ import print_function
import WPIntitializer as Consts
import WPCalcRequester as Lolcall
from flask import Flask,jsonify,request, render_template
import collections

from statsmodels.compat import lzip
import statsmodels
import numpy as np
import pandas as pd
import statsmodels.formula.api as smf
from sklearn.linear_model import LinearRegression
from sklearn.feature_selection import RFE
from sklearn.cross_validation import train_test_split
import statsmodels.stats.api as sms
import matplotlib.pyplot as plt
import WPCalcRequester as Lolcall
import time
from collections import OrderedDict
import time

championList = {}
summonerSpellList = {}
games = {}
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
api = Lolcall.Requester('RGAPI-692a835f-6675-4d10-b234-47c8765d2995')

url = 'stats1.csv'
dat = pd.read_csv('stats1.csv')
df_x = pd.DataFrame(dat.values[:, 0:43], columns=dat.axes[1][0:43])
df_y = pd.DataFrame(dat.values[:, 43], columns=[dat.axes[1][43]])
reg = LinearRegression()
x_train, x_test, y_train, y_test = train_test_split(df_x, df_y, test_size=0.2, random_state=4)
# x2_train, x2_test, y2_train, y2_test = train_test_split(df_x2, df_y2, test_size=0.2, random_state=4)
reg.fit(x_train, y_train)


        # ur2 = 'stats2.csv'
        # dat2 = pd.read_csv(ur2)
        #
        # df_x2 = pd.DataFrame(dat2.values[:,2:56], columns=dat.axes[1][2:56])
        # df_y2 = pd.DataFrame(dat2.values[:,56], columns=[dat.axes[1][56]])

def sample():
    print("x describe")
    print(df_x)
    a = reg.predict(x_test)
    print("mean square error")
    print(np.mean((a - y_test) ** 2))
    corrections(a)
    print("predictions")
    print(a)
    print("actual results")
    print(y_test)


def corrections(a):
    for point in range(0, len(a)):
        if a[point] > 0.5:
            a[point] = 1
        else:
            a[point] = 0
    return a


def predict(playerStats):
#    print(playerStats)

    stats = OrderedDict({
    'item1': playerStats['item1'],
    'item2': playerStats['item2'],
    'item3': playerStats['item3'],
    'item4': playerStats['item4'],
    'item5': playerStats['item5'],
    'item6': playerStats['item6'],
    'kills': playerStats['kills'],
    'deaths': playerStats['deaths'],
    'assists': playerStats['assists'],
    'largestKillingSpree': playerStats['largestKillingSpree'],
    'largestMultiKill': playerStats['largestMultiKill'],
    'killingSprees': playerStats['killingSprees'],
    'longestTimeSpentLiving': playerStats['longestTimeSpentLiving'],
    'doubleKills': playerStats['doubleKills'],
    'tripleKills': playerStats['tripleKills'],
    'quadraKills': playerStats['quadraKills'],
    'pentaKills': playerStats['pentaKills'],
    'totalDamageDealt': playerStats['totalDamageDealt'],
    'magicDamageDealt': playerStats['magicDamageDealt'],
    'physicalDamageDealt': playerStats['physicalDamageDealt'],
    'trueDamageDealt': playerStats['trueDamageDealt'],
    'largestCriticalStrike': playerStats['largestCriticalStrike'],
    'totalDamageDealtToChampions': playerStats['totalDamageDealtToChampions'],
    'totalHeal': playerStats['totalHeal'],
    'totalUnitsHealed': playerStats['totalUnitsHealed'],
    'damageSelfMitigated': playerStats['damageSelfMitigated'],
    'damageDealtToObjectives': playerStats['damageDealtToObjectives'],
    'damageDealtToTurrets': playerStats['damageDealtToTurrets'],
    'visionScore': playerStats['visionScore'],
    'timeCCingOthers': playerStats['timeCCingOthers'],
    'totalDamageTaken': playerStats['totalDamageTaken'],
    'magicalDamageTaken': playerStats['magicalDamageTaken'],
    'physicalDamageTaken': playerStats['physicalDamageTaken'],
    'trueDamageTaken': playerStats['trueDamageTaken'],
    'goldEarned': playerStats['goldEarned'],
    'goldSpent': playerStats['goldSpent'],
    'turretKills': playerStats['turretKills'],
    'inhibitorKills': playerStats['inhibitorKills'],
    'totalMinionsKilled': playerStats['totalMinionsKilled'],
    'neutralMinionsKilled': playerStats['neutralMinionsKilled'],
    'champLevel': playerStats['champLevel'],
    'visionWardsBoughtInGame': playerStats['visionWardsBoughtInGame'],
    })

    if playerStats['firstBloodKill'] == True or playerStats['firstBloodAssist'] == True:
        stats['firstBloodKill'] = 1
    else:
        stats['firstBloodKill'] = 0

    if playerStats['win'] == True:
        stats['win'] = 1
    else:
        stats['win'] = 0


    print(stats)
    statsData = [stats]

    dframe = pd.DataFrame(data=statsData)
    data_x = pd.DataFrame(dframe.values[:, 0:43], columns=dframe.axes[1][0:43])
    data_y = pd.DataFrame(dframe.values[:, 43], columns=[dframe.axes[1][43]])

    # print(data_x)
    # print(data_y)
#    print(dframe)
    a = reg.predict(data_x)
#    print(a)
#    reg.fit(data_x, data_y)
    return a
@app.route('/api', methods=['POST'])
def getInfo():

    data = request.get_json()
    username = data['username']
    return userData(username,1)

@app.route('/games',methods=['POST'])
def matches():
    data = request.get_json()
    username = data['username']
    return userData(username,2)


def userData(username,cat):
    champions = api.get_static_champ_info()
    champions = champions['data']

    for champion in champions:
        championList[str(champions[champion]['id'])] = champions[champion]
    #   print(championList)

    # setting up spells list
    spells = api.get_spell_list_info()
    spells = spells['data']

    for spell in spells:
        summonerSpellList[str(spells[spell]['id'])] = spells[spell]
    #    print(summonerSpellList)

    # use to get summoner Id or summoner account number
    summoner = api.get_summoner_by_name(username)
    games = api.get_last_20_games_by_accountId(summoner['accountId'])

    # use to get last 20 games

    # for x in range(0, len(games['matches'])):
    #     last_game = api.get_match_history_by_match_id(games['matches'][x]['gameId'])  # use to get last game history
    #
    #     print('-------------------------------------------------------------------')
    #     print('-------------------------------------------------------------------')
    #     print('game '+str(x+1))
    #     print('game duration: ' + str(last_game['gameDuration']))                       # use to get game duration
    #     print('-------------------------------------------------------------------')
    #     # for each game participant
    #     for participant in last_game['participantIdentities']:
    #         print('player: '+str(participant['player']['summonerName']))
    #         print(str(participant['player']['summonerName'])+' info: '+str(last_game['participants'][int(participant['participantId']) - 1]))
    #
    #         champ = championList[str(last_game['participants'][int(participant['participantId']) - 1]['championId'])]
    #         print(champ)
    #
    #         sumSpell1 = summonerSpellList[str(last_game['participants'][int(participant['participantId']) - 1]['spell1Id'])]
    #         print(sumSpell1)
    #
    #         sumSpell2 = summonerSpellList[str(last_game['participants'][int(participant['participantId']) - 1]['spell2Id'])]
    #         print(sumSpell2)
    #
    #         print('-------------------------------------------------------------------')
    #         print('-------------------------------------------------------------------')
    if cat == 1:
        print(summoner)
        print(championList)
        return jsonify(summoner)
    if cat == 2:
        print(championList)
        print(games)
        return jsonify(games)
    if cat == 3:
        return championList

@app.route('/totalWinRate',methods=['POST'])
def totalWinRatioForSeason():
    data = request.get_json()
    username = data['username']
    summoner = api.get_summoner_by_name(username)
    summonerInfo = api.get_league_info(summoner['id'])
    winRatio = float(summonerInfo[0]['wins'])/float((summonerInfo[0]['wins']+summonerInfo[0]['losses']))
    print(winRatio)
    return jsonify(winRatio)
@app.route('/winLoss',methods=['POST'])
def winLoss20Games():
    data = request.get_json()
    username = data['username']
    summoner = api.get_summoner_by_name(username)
    games = api.get_games_by_accountId(summoner['accountId'],20)               # use to get last 20 games
    result = {}
    matchInfo = []
    wins = 0
    for x in range(0, len(games['matches'])):
        last_game = api.get_match_history_by_match_id(games['matches'][x]['gameId'])  # use to get last game history
        matchInfo.append(last_game)

        # for each game participant
        for participant in last_game['participantIdentities']:
            if str(participant['player']['summonerName']) == str(summoner['name']):
                if last_game['participants'][int(participant['participantId']) - 1]['stats']['win']:
                    wins += 1
    result['wins'] = wins
    result['loss'] = 20 - wins
    result['infoOfMatches'] = matchInfo
    print(result)
    return jsonify(result)

@app.route('/top20WinRate',methods=['POST'])
def top20WinChamp():
    data = request.get_json()
    username = data['username']
    summoner = api.get_summoner_by_name(username)
    list = userData(username,3)
    champWinRate = []
    for x in list:
        champWinRate[x] = winRatioForChampion(summoner,list[x]['id'])
    champWinRate.sort(key=lambda x: x.champWinRatio)
    return jsonify(champWinRate[:20])

@app.route('/top20Played',methods=['POST'])
def top20MostPlay():
    data = request.get_json()
    username = data['username']
    summoner = api.get_summoner_by_name(username)
    games = api.get_games_by_accountId(summoner['accountId'], 100)
    list = []
    for x in range(0, len(games['matches'])):
        list.append(games['matches'][x]['champion'])
    counter = collections.Counter(list).most_common()
    print(counter)
    return jsonify(counter)


@app.route('/calculate',methods=['POST'])
def probabilityCalculator():

    noOfGames = 5
    data = request.get_json()
    username = data['username']
    #api = Lolcall.Requester('RGAPI-78eb931c-73eb-448d-bc6d-a8b7bb5ca3ff')
    summoner = api.get_summoner_by_name(username)

    game = api.get_current_game(summoner['id'])
    print(game)
    print(game['participants'])

    teamId = 0
    teamA = 0
    teamB = 0

    for player in game['participants']:
        summonerInGame = api.get_summoner_by_name(player['summonerName'])

        if summonerInGame['name'] == summoner['name']:
            teamId = player['teamId']

        if player['teamId'] == 100:
            teamA += playerProbScore(summonerInGame, noOfGames)
        elif player['teamId'] == 200:
            teamB += playerProbScore(summonerInGame, noOfGames)
        else:
            print("error with identifying team")

    if teamId == 100:
        result1 = teamA / (teamA + teamB)
        print(result1[0][0])
        return jsonify(result1[0][0])
    elif teamId == 200:
        result2 = teamB/(teamA + teamB)
        print(result2[0][0])
        return jsonify(result2[0][0])
    else:
        print("error retrieving team Id")
        return jsonify(0)


def playerProbScore(summoner, numberOfGames):
#    time.sleep(1)

    games = api.get_games_by_accountId(summoner['accountId'], numberOfGames)               # use to get last 20 games
    winScore = 0

    for x in range(0, len(games['matches'])):
        last_game = api.get_match_history_by_match_id(games['matches'][x]['gameId'])  # use to get last game history
        for player in last_game['participantIdentities']:
            if player['player']['summonerName'] == summoner['name']:
                for participant in last_game['participants']:
                    if participant['participantId'] == player['participantId']:
                       winScore += predict(participant['stats'])
    return winScore
def winRatioForChampion(summoner, champId):
    games = api.get_games_for_champ_by_accountId(summoner['accountId'], champId)               # use to get last 20 games
    result = {}
    matchInfo = []
    wins = 0
    for x in range(0, len(games['matches'])):
        last_game = api.get_match_history_by_match_id(games['matches'][x]['gameId'])  # use to get last game history
        matchInfo.append(last_game)

        # for each game participant
        for participant in last_game['participantIdentities']:
            if str(participant['player']['summonerName']) == str(summoner['name']):
                if last_game['participants'][int(participant['participantId']) - 1]['stats']['win']:
                    wins += 1
    result['wins'] = wins
    result['loss'] = len(games['matches']) - wins
    result['totalNoOfMatches'] = len(games['matches'])
    result['champWinRatio'] = result['wins']/result['totalNoOfMatches']
    result['infoOfMatches'] = matchInfo
    print(result)
    return result
if __name__ == "__main__":
    app.run(debug=True)