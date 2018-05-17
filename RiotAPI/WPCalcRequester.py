import WPIntitializer as Consts
import requests


class Requester(object):
    def __init__(self, api_key, region='NA'):
        self.api_key = api_key
        self.region = Consts.REGIONS[region]
        self.regionHost = Consts.REGIONHOST[region]

    # returns JSON file from an api request
    def request(self, api_url, params={}):
        args = {'api_key': self.api_key}
        for key, value in params.items():
            if key not in args:
                args[key] = value

        # Creates the url based off of the base string and replaced api_url
        response = requests.get(Consts.URL['base'].format(
            regionHost=self.regionHost,
            url=api_url
        ),
            params=args
        )
        print(response.headers)
        return response.json()

    def get_summoner_by_name(self, name):
        api_url=Consts.URL['summoner_by_name'].format(
            versionNumber=Consts.versionNumber,
            summonerName=name
        )
        return self.request(api_url)

    def get_last_20_games_by_accountId(self, accountId):
        api_url=Consts.URL['last_20_games'].format(
            versionNumber=Consts.versionNumber,
            accountId=accountId
        )
        return self.request(api_url)

    def get_match_history_by_match_id(self, matchId):
        api_url=Consts.URL['match_history'].format(
            versionNumber=Consts.versionNumber,
            matchId=matchId
        )
        return self.request(api_url)

    def get_champion_info_by_champ_id(self, id):
        api_url=Consts.URL['champion_info'].format(
            versionNumber=Consts.versionNumber,
            id=id
        )
        return self.request(api_url)

    def get_static_champ_info(self):
        api_url = Consts.URL['static_champ_info'].format(
            versionNumber=Consts.versionNumber,
        )
        return self.request(api_url)


    def get_spell_list_info(self):
        api_url=Consts.URL['summoner_spells'].format(
            versionNumber=Consts.versionNumber
        )
        return self.request(api_url)


    def get_spell_info_by_spell_id(self, id):
        return Consts.summoner_spell[id]

    def get_league_info(self, summonerId):
        api_url = Consts.URL['league_info'].format(
            versionNumber=Consts.versionNumber,
            id=summonerId
        )
        return self.request(api_url)

    def get_games_for_champ_by_accountId(self, accountId, champId):
        api_url = Consts.URL['last_few_games'].format(
            versionNumber=Consts.versionNumber,
            accountId=accountId
        )
        return self.request(api_url, {"champion": champId})

    def get_games_by_accountId(self, accountId, resultCount):
        api_url = Consts.URL['last_few_games'].format(
            versionNumber=Consts.versionNumber,
            accountId=accountId
        )
        return self.request(api_url, {"beginIndex": 0,
                                      "endIndex": resultCount})

    def get_current_game(self, summonerId):
        api_url = Consts.URL['current_game'].format(
            versionNumber=Consts.versionNumber,
            summonerId=summonerId
        )
        return self.request(api_url)