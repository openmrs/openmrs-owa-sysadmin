<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS"/>

# Module Management - GSoC 2017 Project

This repository contains the OpenMRS Module Management OpenMRS Open Web App developed for [MetaData Management in Admin UI Project](https://wiki.openmrs.org/display/projects/More+Metadata+Management+in+AdminUI).

> Module Management functionality implemented as an OWA for OpenMRS

For further documentation about OpenMRS Open Web Apps see [the wiki page](https://wiki.openmrs.org/display/docs/Open+Web+Apps+Module).

## Project

### The Project goals

1. Implement all functionalities in the Manage Module to Open Web App.
2. List all the installed Modules and allow admin users to control the Modules using Start, Stop and Unload actions.
3. View the Installed module’s details with required Module’s.
4. Upload Modules(.omod File) to the OpenMRS Server and Start uploaded Module
5. Search the modules from OpenMRS Modules Repo and Install to the OpenMRS Server
6. Check installed modules updates
7. Start All modules functionalities


### OWA Development Progress

Under Development Stage, Completed Functionalities are
 1. List all the Installed Modules (Completed)
 2. Installed Modules Details (Completed)
 3. Upload New Modules and start (Completed)
 4. Search Modules from Online Module Repo (Completed)
 5. Working on Module Upgrades (under Development)

## Development

### Setup OpenMRS server

You will need JDK 1.7, maven and OpenMRS SDK. Please refer to [the wiki page] (https://wiki.openmrs.org/display/docs/OpenMRS+SDK#OpenMRSSDK-Installation) for installation instructions.

You need to setup a server (first time only) as follows:

````
mvn openmrs-sdk:setup-platform -DserverId=adminmodule
mvn openmrs-sdk:install -DartifactId=owa -Dversion=1.4-SNAPSHOT -DserverId=adminmodule
mvn openmrs-sdk:install -DartifactId=webservices.rest -Dversion=2.13 -DserverId=adminmodule
mvn openmrs-sdk:install -DartifactId=uiframework -Dversion=3.6 -DserverId=adminmodule
mvn openmrs-sdk:install -DartifactId=uicommons -Dversion=1.7 -DserverId=adminmodule
````

Now you can run the server:
````
mvn openmrs-sdk:run -DserverId=adminmodule
````
Once it says "Started Jetty Server", visit http://localhost:8080/openmrs in your browser.

### Production Build

You will need NodeJS 4+ installed to do this. See the install instructions [here](https://nodejs.org/en/download/package-manager/).

Once you have NodeJS installed, you need to install Gulp and Bower (first time only) as follows:
````
npm install -g gulp bower
````

Install the dependencies (first time only):

```
npm install && bower install
```

Build the distributable using [Gulp](http://gulpjs.com/) as follows:

````
gulp
````

This will create a file called `ManageModule.zip` file in the `dist` directory, which can be uploaded to the OpenMRS Open Web Apps module.

## License

[MPL 2.0 w/ HD](http://openmrs.org/license/) © [OpenMRS Inc.](http://www.openmrs.org/)
