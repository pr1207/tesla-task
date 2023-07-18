# tesla-task

Solution consists of two separate projects:
1. tesla-ui -> User interface that previews site layout based on user configuration
2. tesla-api -> Simple REST API service that returns list of battery types and transformers

#tesla-ui
##Starting
Project can be run from startup.bat script or manually by first installing dependencies with `npm install` and then running the project with `npm start`.
New window will open on port localhost:8000. User can then provide count of devices for each of battery types and site layout will be rendered accordingly.

##Layout rendering
Site layout preview is rendered in an instance of fabricJS canvas. There are two layout modes:
1. Default one, which doesn't care about battery and transformer order (so it might happen that transformers are added last)
2. Ordered one, where after each 4 batteries one transformer is added
Both of them look in the available space of a single row and try to find the next best fit for a device.
User can toggle these modes thru **Change mode** button in top right corner

##Land estimation
Since there is 5ft padding between each row of devices, this number is also included in land estimation.

##Testing
To run tests type `npm test`


#tesla-api
##Starting
Project can be run from startup.bat script or manually by first installing dependencies with `npm install` and then running the project with `npm run dev`.
APIs will be hosted on localhost:8001
