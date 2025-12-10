# TravelStatusAPI

The travelStatusAPI \_\_\_ the travel status from the foreign ministerium in Denmark.
The response is formatted as metadata and a list of countries:

```
{
  "countries": [
    {
      "country": "Finland",
      "travelStatuses": [
        {
          "travelStatus": "low",
          "headingText": "Vær ekstra forsigtig: Hele landet undtagen området i den røde bjælke.",
          "contentText": "Vær til enhver tid opmærksom på din personlige sikkerhed og hold dig opdateret om udviklingen via de lokale myndigheder, nyhedsmedierne og dit rejsebureau."
        },
        {
          "travelStatus": "high",
          "headingText": "Vi fraråder alle rejser til: Grænseområdet til Thailand i en zone på 20 km fra grænsen.",
          "contentText": "Meget høj sikkerhedsrisiko. Hvis du vælger at rejse, bør du søge professionel rådgivning."
        }
      ],
      "httpCodeUM": 200,
      "updatedTimeUM": "Rejsevejledning opdateret: 10.11.2025 Kl. 12:38"
    },
    {
      "country": "Cambodja",
      "travelStatuses": [
        {
          "travelStatus": "low",
          "headingText": "Vær ekstra forsigtig: Hele landet undtagen området i den røde bjælke.",
          "contentText": "Vær til enhver tid opmærksom på din personlige sikkerhed og hold dig opdateret om udviklingen via de lokale myndigheder, nyhedsmedierne og dit rejsebureau."
        },
        {
          "travelStatus": "high",
          "headingText": "Vi fraråder alle rejser til: Grænseområdet til Thailand i en zone på 20 km fra grænsen.",
          "contentText": "Meget høj sikkerhedsrisiko. Hvis du vælger at rejse, bør du søge professionel rådgivning."
        }
      ],
      "httpCodeUM": 200,
      "updatedTimeUM": "Rejsevejledning opdateret: 10.11.2025 Kl. 12:38"
    }
  ],
  "httpCode": 200,
  "retrievedTime": "2025-12-03T08:56:30.084Z",
  "version": "1.0.0"
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
