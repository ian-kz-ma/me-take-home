# Magic Eden Coding Challenge

## Table of Contents

- [About](#about)
- [Installation and Setup](#installation-and-setup_)
- [Usage](#usage)
- [Design Explanation](#design-explanation)
- [Limitations and Considerations](#limitations-and-considerations)

## About

NOTE: To view the non-github formatted version of this file, please see the file "README_RAW.txt".

This application simulates the indexing of data on the blockchain. A JSON file is used to act as the stream of data to be indexed by the applicationm when running the program.
The data being streamed consists of accounts with various attributes. An example is shown below:

```sh
{
    "id": "gkDF8QaRcyLCm4A6tsmHiQvqUZ7NqsvpXiZ8K8RQof9n",
    "accountType": "account",
    "tokens": 517,
    "callbackTimeMs": 4100,
    "data": {},
    "version": 39
}
```

Once the JSON file is fully processed and all callbacks are complete the application will generate a report on the highest version, highest token-value accounts by AccountType. The application will then shutdown.

The JSON file used is "coding-challenge-input-ian-ma.json" located at the root of the project.
The starting point of the application is "index.js" located at the root of the project.
The folder named "src" located contains all of the main classes that handle the application logic.
The "test" contains all of the unit tests.

## Installation and Setup

You will need to install Node.js and npm in order to run the application. Please see the below link if you do not already have these:
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

## Usage

Open the project in your preferred IDE (VisualStudioCode)

In the terminal window run `npm -v` and `node -v` to ensure you have node and npm installed correctly.

Next run `npm install` to download and update dependencies.

To start the main application run 
```sh
npm start
```

To start the unit tests run
```sh
npm test
```

## Design Explanation

Initially the application was written in a 1-file script format as a proof of concept (index_old.js). Since this application has multiple components, (account handling, cooldown management, report generation, data streaming) this was eventually rewritten to implement classes in order to improve organization and maintainability. More specifically the design pattern used was dependency injection. This was chosen so that logic from class to class is abstracted out and classes that use other classes know nothing about eachother. The decoupling of the classes makes unit testing as well as future class updates easier provided that interfaces are retained. Its also worth noting that in a situation where asynchronous  operations are a main focus, such as this coding challenge, separation between components is preferred for clarity.

Other smaller notes:

- The map data structure was chosen as the main datastructure given its O(1) time complexity for gets and sets, making it efficient for indexing.

- The output of the account ingestion was purposefully designed in a such a way that the user can quickly discern the event by reading the first word of the output (IGNORED, CANCELED, CALLBACK, INDEXED)

- A "cooldown" method was used to manage the shutting down of the system. Admittedly this is a crude way to manage the shutting down of the system but it was chosen for simplicity sake. Further discussion regarding this is outlined below


## Limitations and Considerations

Its worth considering what would happen if the ingestion rate becomes exceedningly fast. The event loop can become overloaded and its possible that some events can be delayed or even missed. In the context of this challenge specifically its possible that memory issues could occur if enough accounts were streamed and the amount of timers created became very large. Also the Map data structure would become very large.

As mentioned before the "cooldown" method used to manage the shutdown is not ideal as it can be easily broken if an ingestion time was large enough. The approach of matching and counting callback creation/execution was also not used because it is assumed that in a real-world scenario the total number of accounts is unknown and "infinite". I also assume that this is not a service that would ever shut down. Given so its also not practical to use a Map datastructure since if the application crashes all the data is lost. I assume that a real-world version of this application would involve a database as well as fail safes and scalability strategies to minimize losses and ensure data is captured (load balancing, etc.). I imagine that a more realistic setup would involve a server that listens to requests and these requests are the constant account updates.

Also it was noticed that some accounts do not have a version. These were ignored but I would think that in a production environment these accounts would need to be handled differently. Either collected and handled later or some other method.
