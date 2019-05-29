# Home Appliance Monitor (HAM) Bot

HAM is a NLP Messenger Bot that can remotely change the state of connected appliances.

It uses a pre-trained [RASA](https://rasa.com) NLU Model to parse users text to get their intent and based 
on the intents dispatches the appropriate command to the users connected appliance.

It uses websockets to communicate with the appliances through a proprietry set of commands. If an appliance is not online at the moment of sending the command, the command is pushed into a queue and resent as soon as the device is available to handle the command.

This project has an accompany dashboard for configuring devices at https://ham-portal.herokuapp.com. It uses your facebook accounts to link you with the bot. Its code can be found [here](https://bitbucket.org/perfectmak/ham-portal).

## Configuration

You would need to set the appropriate environment variables in order to run this service.

### Dependencies
- Mongo DB
- Messenger Bot API (you would need to create a facebook application)
- [Iron MQ](https://www.iron.io/mq)

### Environment Variables
See the `.env.sample` file a list of environment variables needed to run.


## Running

To run ensure all dependencies and environment variables are properly set then run:

```
npm start
```


## Development
To run tests:
```
npm run test
```
