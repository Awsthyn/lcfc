Cómo hacer las consultas:

GET Resultado del último partido

`/matchs/last`

GET Resultado de un partido en particular

Se pueda buscar por fecha o por id

`/matchs?id=`

`/matchs/date?date=DD-MM-YYYY`

GET Últimos 50 partidos

`/matchs/last50`

GET Partidos por intervalo de fecha

`/matchs/rangedate?minDate=DD-MM-YYYY?maxDate=DD-MM-YYYY`

GET para obtener los puntos que tiene Leicester por un rango de fechas

`/matchs/rangedate?minDate=DD-MM-YYYY?maxDate=DD-MM-YYYY?score=1`

POST para agregar un partido a mano, con las mismas carácterísticas que los partidos provenientes del api

`/matchs`
`(pasar datos por body)`