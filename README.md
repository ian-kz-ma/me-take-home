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
There is a folder named "src" located at the root of the project which contains all of the main classes that handle the application logic.
There is a folder named "test" located at the root of the project which contains all of the unit tests.

## Installation and Setup

## Usage

## Design Explanation

## Limitations and Considerations
