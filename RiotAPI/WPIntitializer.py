
versionNumber = '3'

URL = {
    'base': 'https://{regionHost}{url}',
    'summoner_by_name': '/lol/summoner/v{versionNumber}/summoners/by-name/{summonerName}',
    'last_20_games': '/lol/match/v{versionNumber}/matchlists/by-account/{accountId}?endIndex=20',
    'last_few_games': '/lol/match/v{versionNumber}/matchlists/by-account/{accountId}',
    'match_history': '/lol/match/v{versionNumber}/matches/{matchId}',
    'champion_info': '/lol/static-data/v{versionNumber}/champions/{id}',
    'static_champ_info': '/lol/static-data/v{versionNumber}/champions',
    'summoner_spells': '/lol/static-data/v{versionNumber}/summoner-spells',
    'summoner_spell_info': '/lol/static-data/v{versionNumber}/summoner-spells/{id}',
    'league_info': '/lol/league/v{versionNumber}/positions/by-summoner/{id}',
    'current_game': '/lol/spectator/v{versionNumber}/active-games/by-summoner/{summonerId}'
}

summoner_spell = {
    '[21]': 'Barrier',
    '[30]': 'To the King!',
    '[39]': 'Ultra (Rapidly Flung) Mark',
    '[1]': 'Cleanse',
    '[36]': 'Disabled Summoner Spells',
    '[12]': 'Teleport',
    '[35]': 'Disabled Summoner Spells',
    '[4]': 'Flash',
    '[32]': 'Mark',
    '[7]': 'Heal',
    '[13]': 'Clarity',
    '[31]': 'Poro Toss',
    '[11]': 'Smite',
    '[33]': 'Nexus Siege: Siege Weapon Slot',
    '[34]': 'Nexus Siege: Siege Weapon Slot',
    '[3]': 'Exhaust',
    '[14]': 'Ignite',
    '[6]': 'Ghost'
}


REGIONS = {
           'BR':   'BR1',
           'EUNE': 'EUN1',
           'EUW':  'EUW1',
           'JP':   'JP1',
           'KR':   'KR',
           'LAN':  'LA1',
           'LAS':  'LA2',
           'NAO':  'NA',
           'NA':   'NA1',
           'OCE':  'OC1',
           'TR':   'TR1',
           'RU':   'RU',
           'PBE':  'PBE1'
           }

REGIONHOST ={
           'BR':   'br1.api.riotgames.com',
           'EUNE': 'eun1.api.riotgames.com',
           'EUW':  'euw1.api.riotgames.com',
           'JP':   'jp1.api.riotgames.com',
           'KR':   'kr.api.riotgames.com',
           'LAN':  'la1.api.riotgames.com',
           'LAS':  'la2.api.riotgames.com',
           'NA':   'na1.api.riotgames.com',
           'OCE':  'oc1.api.riotgames.com',
           'TR':   'tr1.api.riotgames.com',
           'RU':   'ru.api.riotgames.com',
           'PBR':  'pbe1.api.riotgames.com'
           }

