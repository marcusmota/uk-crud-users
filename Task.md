# Web Development API Task

## Your task is to create an API to manage a user persistence layer.

We would expect this task to take a few hours, however there is no strict time limit and you won't be judged on how long it took you to complete. Please find a few pointers below:

Your solution _must_:

  - Expose a **user** model. It's reasonable to expect that a user has (at least) the following attributes:
    - **`id`** - _a unique user id_
    - **`email`** - _a user's email address_
    - **`givenName`** - _in the UK this is the user's first name_
    - **`familyName`** - _in the UK this is the user's last name_
    - **`created`** - _the date and time the user was added_
  - Have the ability to persist user information for at least the lifetime of the test.
  - Expose functionality to create, read, update and delete (CRUD) users.
  - Be easily consumable by a plain HTTP client (e.g. cURL or Postman) or, if using a transport other than HTTP, be trivial to write a client application to consume it.

Although the main outcomes of the task are listed above, if you feel like you want to go that extra mile and show us what you're capable of, here is a list of potential enhancements that we have come up with:

- Provide a way for your API to be easily tested/consumed (e.g. a custom front-end, a [Postman](https://www.getpostman.com/) collection or a [Swagger/OpenAPI](https://swagger.io/) API specification).
- Use of an industry standard data exchange format.
- Sanitisation checks of inputs.
- Implementation of test coverage.
