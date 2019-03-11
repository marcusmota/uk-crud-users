
## UK-Recruiment-API 

This is an implementation of this code challenge [github.com/holidayextras/culture/blob/master/recruitment/developer-API-task](https://github.com/holidayextras/culture/blob/master/recruitment/developer-API-task.md)



## Documentation

The documentation is available in [SwaggerHub / uk-Recruiment-api](https://app.swaggerhub.com/apis-docs/marcusmota/uk-recruiment-api/1.0.0)



### API start

The application is built with Node.js and MongoDB as database with docker. To start the application you need `docker` and `docker-compose`.

The application will be avaible on *PORT 3000* by default.



### Running the application in development mode

If you want to run in development mode, use this command

```shell
docker-compose -f docker-compose.yml up --build
```



### Running the tests

To run the tests using docker, use this command:

```shell
docker-compose -f docker-compose.test.yml up --build
```



### Running the application in production mode

If you want to run in production mode, use this command

```shell
docker-compose -f docker-compose-prod.yml up --build
```


And then you will see something like this on your terminal


```shell
Starting ukcrudusers__1 ...
Starting ukcrudusers__1 ... done
Starting ukcrudusers_app_1 ...
Starting ukcrudusers_app_1 ... done
```



## Contributing

Feel free to join us on the API



## Authors

* **Marcus Mota** -  [MarcusMota](https://github.com/marcusmota)
