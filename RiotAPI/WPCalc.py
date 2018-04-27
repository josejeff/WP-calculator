import WPIntitializer as Consts
import WPCalcRequester as Lolcall
from flask import Flask,jsonify,request
import time

championList = {}
summonerSpellList = {}
app = Flask(__name__)

@app.route('/api', methods=['POST'])
def getInfo():
    api = Lolcall.Requester('RGAPI-53665a9b-e148-4655-83b4-309ffa8090b1')
    data = request.get_json()
    username = data['username']
    # setting up champions list
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
    games = api.get_last_20_games_by_accountId(summoner['accountId'])               # use to get last 20 games

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
    print(summoner)
    return jsonify(summoner)




if __name__ == "__main__":
    app.run(debug=True)