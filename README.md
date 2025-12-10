# TravelStatusAPI

The travelStatusAPI \_\_\_ the travel status from the foreign ministerium in Denmark.
The response is formatted as metadata and a list of countries:

```
{
  "httpCode": 200,
  "retrievedTime": "10.12.2025, 13.12.38",
  "version": "1.0.0",
  "countries": [
    {
      "httpCodeUM": 204,
      "errorMessage": "No travel advice available for Albania."
    },
    {
      "httpCodeUM": 404,
      "errorMessage": "Travel advice for Azores not found (404)."
    },
    {
      "httpCodeUM": 200,
      "country": "Belgien",
      "updatedDateUM": "11.11.2025",
      "updatedTimeUM": "15.51",
      "travelStatuses": [
        {
          "travelStatus": "minimal",
          "headingText": "Vær opmærksom: Hele landet.",
          "contentText": "Brug din sunde fornuft og vær opmærksom på mistænkelig adfærd som du ville være det, hvis du var i Danmark."
        }
      ]
    },
{
      "httpCodeUM": 200,
      "country": "Tyrkiet",
      "updatedDateUM": "08.12.2025",
      "updatedTimeUM": "14.08",
      "travelStatuses": [
        {
          "travelStatus": "low",
          "headingText": "Vær ekstra forsigtig: Hele landet, undtagen områderne i den orange bjælke og den røde bjælke nedenfor.",
          "contentText": "Vær til enhver tid opmærksom på din personlige sikkerhed og hold dig opdateret om udviklingen via de lokale myndigheder, nyhedsmedierne og dit rejsebureau."
        },
        {
          "travelStatus": "medium",
          "headingText": "Vi fraråder alle ikke-nødvendige rejser til: De sydøstlige provinser Hatay, Kilis, Sirnak og Hakkari.",
          "contentText": "Risiciene er så alvorlige, at du bør have særlige grunde til at besøge området/landet. Vigtige forretningsrejser og presserende familiebegivenheder kan få rejsende til at vurdere, at et besøg er nødvendigt."
        },
        {
          "travelStatus": "high",
          "headingText": "Vi fraråder alle rejser til: Områder inden for 10 km fra grænsen til Syrien og Irak.",
          "contentText": "Meget høj sikkerhedsrisiko. Hvis du vælger at rejse, bør du søge professionel rådgivning."
        }
      ]
    }
]
}

```

## architecture

<img width="393" height="208" alt="image" src="https://github.com/user-attachments/assets/01c7915d-9843-474b-8827-a0950cbe128b" />
 
The TravelStatus API is built with Express and fetches data from a local JSON-file. The scraper runs every hour as a CRONjob. The scraper uses Axios to retrieve HTML from the Danish Ministry of Foreign Affairs’ travel advisories, after which Cheerio extracts the necessary information. The data is then cached in the local JSON file. The project runs on Node.js, and uses Jest to write and run tests.

## Getting started

When first starting up the project run

```

npm install

```

In dev mode first build the project by using command

```

npm run build

```

Then start the api and cron scheduler

```

npm run start

```

The API will start in browser

## API routes

To get all the countries use path:

http://localhost:3000/travelstatus/getall

To get a specific country use the path:

http://localhost:3000/travelstatus/get/[ISOcode]
e.g for Finland
http://localhost:3000/travelstatus/get/fi

## Testing

To run jest tests use command

```

npm run test

```

## Deployment

To deploy to Azure, run the Github workflow "Build and deploy Node.js app to Azure Web App - TravelStatusAPI" on the main branch.

## Postman

A postman test suite can be found [here](https://travelstatusapi.postman.co/workspace/TravelStatus-Workspace~66df0b2a-94d8-4676-b09e-5db347d23ba9/request/38240095-d7bec5af-4cf1-4477-ba56-bd4b0e9fedf8?action=share&creator=38240095&active-environment=50684975-b74f0fa5-e98d-4ee4-ab11-172f725650a8)

## Testdata

We have a mock folder that our methods can use. In Cron shceduler can the second parameter be set to true for use mock and false to not use mock.

```

using mock:
function runScraperHourly(countryCode: string) {
  return extractTravelStatus(countryCode, true);
}

not using mock:
function runScraperHourly(countryCode: string) {
  return extractTravelStatus(countryCode, false);
}

```
