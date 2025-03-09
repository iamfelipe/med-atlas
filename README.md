# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

# User Information, EHR, and Form Assignments

## User Information

### User Model

The system stores the following user information:

- **id**: Unique identifier
- **email**: User's email address
- **firstName**: User's first name
- **lastName**: User's last name
- **role**: User's role (default is "patient")
- **createdAt**: When the user was created
- **updatedAt**: When the user was last updated
- **ehrId**: Optional reference to an assigned EHR
- **form**: Optional reference to an assigned form

### User Endpoints

- `GET /user`: Get all users
- `GET /user/patient`: Get all patients
- `GET /user/:id`: Get a specific user by ID
- `POST /user`: Create a new user
- `PUT /user/:id`: Update a user
- `DELETE /user/:id`: Delete a user
- `PATCH /user/:id/ehr`: Assign an EHR to a user

## EHR (Electronic Health Record)

### EHR Model

- **id**: Unique identifier
- **name**: Name of the EHR system (e.g., Athena, Allscripts, Cerner)
- **baseUrl**: Base URL for the EHR API
- **authType**: Authentication type (e.g., OAuth2, API_KEY)
- **mappings**: Array of field mappings
- **users**: Array of users assigned to this EHR
- **forms**: Array of forms associated with this EHR

### EHR Mapping Model

- **id**: Unique identifier
- **ehrId**: Reference to the parent EHR
- **entityType**: Type of entity (e.g., Patient, Appointment)
- **fieldName**: Name of the field in the EHR
- **mappingPath**: Path to the field in the EHR API response
- **dataType**: Data type (string, number, date, boolean, multiple, radio, dropdown)
- **required**: Whether the field is required
- **apiEndpoint**: API endpoint for the entity
- **options**: Optional list of options for dropdown/radio fields
- **formQuestions**: Array of form questions using this mapping

### EHR Endpoints

- `GET /ehr`: Get all EHRs
- `GET /ehr/:id`: Get a specific EHR by ID
- `POST /ehr`: Create a new EHR
- `PUT /ehr/:id`: Update an EHR
- `DELETE /ehr/:id`: Delete an EHR

## Form

### Form Model

- **id**: Unique identifier
- **name**: Name of the form
- **status**: Status of the form (pending or completed)
- **createdAt**: When the form was created
- **updatedAt**: When the form was last updated
- **userId**: Reference to the user the form is assigned to
- **ehrId**: Reference to the EHR the form is associated with
- **questions**: Array of questions in the form

### Form Question Model

- **id**: Unique identifier
- **formId**: Reference to the parent form
- **mappingId**: Reference to the EHR mapping
- **value**: The user's response to the question
- **createdAt**: When the question was created
- **updatedAt**: When the question was last updated

### Form Endpoints

- `GET /form`: Get all forms
- `GET /form/:id`: Get a specific form by ID
- `GET /form/user/:userId`: Get a form for a specific user
- `POST /form`: Create a new form
- `PUT /form/:id`: Update a form
- `DELETE /form/:id`: Delete a form

## Relationships

- A user can be assigned one EHR
- A user can have one form
- An EHR can have multiple mappings
- A form is associated with one EHR
- A form has multiple questions
- Each form question is associated with one EHR mapping

## Frontend Display

- The dashboard displays a list of patients
- Each patient has a detail page showing their information
- Patients can have forms assigned to them
- Forms display questions based on the EHR mappings
- Form responses are stored and can be viewed by administrators

This system allows for managing patients, their electronic health records, and custom forms that map to fields in the EHR system. The forms can be filled out by patients and the data can be synchronized with the EHR system.
