<!-- ABOUT THE PROJECT -->
## About The Project

this project aim is to output statistics on how often each letter is present in the
JavaScript/TypeScript files of the lodash github repository, in decreasing order.

### Built With

* Nodejs
* Typescript
* octokit
* commander

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* install nodejs by following this [link](https://nodejs.org/en/download/package-manager)
* create a Github personal access token needed in order to access github apis. Follow the instructions [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/xle/search.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

<!-- USAGE EXAMPLES -->
## Usage
from the project root dir run the command
   ```sh
   node ./dist/main.js -t <YOUR_ACCESS_TOKEN>
   ```
## Informations
* a result.json file contains the last execution of the script in readable format
