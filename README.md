# MusicPlayer

Predstavljanje aplikacije - 

MusicPlayer je aplikacija koja omogucava pretragu izvodjaca, njihovih najpoznatijih pesama kao i izbor slicnih izvodjaca. 
Korisnici mogu da da sacuvaju odredjene pesme, kao i da ih uklone. Za tu funkcionalnost se koristi localStorage, tako da su
sacuvane pesme uvek dostupne korisnicima.

Za pretragu izvodjaca, njihovih najpoznatijih pesama i slicnih izvodjaca se koristi last.fm API.
Za sakupljanje informacija o trazenim pesmama se koristi Youtube Data API, dok se za pustanje i manipulaciju istih koristi Youtube IFrame Player API.

Za pokretanje i testiranje na lokalu potrebni su Youtube Data API Key i last.fm Key. Isto tako ogroman broj pesama nije moguce stream-ovati na lokalu, vec 
je potreban public domain koji sam i koristio prilikom testiranja.
