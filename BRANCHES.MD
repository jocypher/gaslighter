J00001
feat: Updated dependencies and configuration files for a TypeScript project

J00002
feat: add dotenv support and refactor datasource options; implement alert and notification entities and enums

feat: implement user authentication and account management; add alert entities and refactor datasource

feat: add authentication and profile retrieval features
- Added Joi for request validation and integrated it into the registration controller.
- Implemented JWT for user authentication.
- Introduced logging middleware using Pino for better request tracking.
- Created a new endpoint for deleting users and retrieving user profiles.
- Refactored the API structure for better organization and maintainability.
- Added TypeScript interfaces for profile responses.
- Enhanced error handling and response formatting in controllers.

J00003
feat: implement user profile management and authentication features; add password change functionality.

feat: add Ethereum wallet balance alert functionality; implement alert creation, validation, and listener service.

feat: update login and registration controllers; add async password validation and access token storage.

feat: refactor change password functionality; update controller and validation schema exports.

feat: implement Ethereum alert functionality; add controllers, validations, and seeding for alert types.

feat: refactor incoming Ethereum alert controller; streamline validations and response DTO integration

feat: enhance Ethereum alert functionality; add incoming ETH alert route, validation, and listener service

feat: implement Ethereum alert processing; add handlers for incoming ETH and wallet balance rules

feat: implement alert management features; add update and delete alert controllers, validations, and schemas

feat: implement outgoing ETH alert processing; add handler for outgoing ETH alerts with recent alert checks


J00004
feat: implement create ETH alert functionality; add controller and validation schema, update alert router

feat: implement alert history listing functionality; add controller and DTO for alert history responses

feat: update alert history retrieval; log alert history response and adjust pagination structure


J00005
feat: integrate Redis for caching alert rules and types; implement Redis client and update alert type seeding

feat: integrate BullMQ for handling incoming ETH alerts and refactor alert processing

- Added BullMQ queues for incoming ETH, outgoing ETH, and wallet balance alerts.
- Refactored IncomingEthHandler to use BullMQ for processing alerts.
- Created utility functions for checking recent alerts and creating alert history.
- Updated app and environment constants to include queue names and Redis options.
- Modified EthereumListenerService to enqueue incoming ETH alerts.
- Updated package.json and package-lock.json to include BullMQ and related dependencies.
- Refactored Redis configuration to utilize environment constants.

feat: refactor alert history utilities and integrate into outgoing ETH alert processing

feat: add health check endpoint for queue status and refactor alert processing workers

feat: enhance wallet balance alert processing with queue integration and recent alert checks

feat: add morgan for logging and update express URL encoding options