Problem Statement:
Expense Tracking Application. Final Web Design Project

Technologies Used:

```
AngularJS
ExpressJS
Typescript
JavaScript
MongoDB
Mongoose
Crypto
Express-JWT (Token Based Authentication)
Passport
SendGrid
AWS Route 53
Plaid Financial Service
```

Features:

```
1.  User's registration and login functionality.
2.  Hashing and Salt generation for the user's password while registration.
3.  Json Web Token to manage the User's login state.
4.  Logging done using pino middleware. Logs all incoming requests to the server in a json format.
5.  Once authenticated, user can create/update expenses between him and another user with customizable splitting options.
6.  Implemented One to Many (User -> Expense) bidirectional mapping using Mongoose.
7.  Added SendGrid dependency for Email service, linking it with AWS Route 53 DNS.
8.  Implemented Forget Password Time based OTP Email functionality.
9.  Users can create Groups with other users.
10. Users can add a group expense to the group and split it between group members.
11. Users can find Amount owed to them or amount due to them by other people in the group.
12. Users can settle amount they owe to other members in the group.
13. Integrated Plaid Client to add banking functionality to the application (Access to All US Banks).
14. User can fetch and monitor the recent transactions for the accounts linked by the user to the application.
```

Requirements:

```
AngularJS
NodeJS
MongoDB Sever
Robo3T
Postman
MongoDB service - (Up and Running)
IDE - VS Code, IntelliJ etc
```

STEPS:

```
1. git clone git@github.com:neu-mis-info6150-spring-2020/final-project-enforcers.git (Via SSH)
2. Open VS Code or any other Editor to view the code
3. The code will have controllers, routers, services, app (frontend) etc
4. Open the terminal, do an "npm install" for frontend (webapp) as well as backend (server)
5. Run "node server.js" to start the server. Before running the application have the env variables setup
6. Go to the app folder
7. Type "ng serve" to start the Frontend application
```
