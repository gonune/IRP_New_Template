# Information about this State Store

This state store is being built up using Redux Toolkit (RTK). It's a very simplified version of the whole set of Actions, Action Creators, Action Types, and Reducers that need to be created if not using the Toolkit. There are a handful of steps for adding to the state store, noted below.

Notice that those steps have been separated into two different sections based on whether or not the data to be stored needs to be collected from external API calls (for example, anything that you might have used Axios for in the past.) In general, the later type requires that we create a custom API using functionality from a part of the Toolkit called RTK Query. When we do so, RTK will automatically generate a new state slice, some thunks, action creators, and a set of generated hooks for our components to use. There is more-detailed commentary provided in the file referenced in the steps for that section below.

# Adding to the Redux State Store

## Data that does not need to be retreived from an external source

An example of this scenario would be the currentUser slice of the state store in this demo app. The data is returned to as us as a part of the sign-in process and we load it into state rather than a component triggering an external API call at a later time.

There are plenty of more-detailed comments in the files mentioned in these steps.

1. Think about the slice of state you need, the shape of the data, the different actions you need (loading? errors? or just data?), etc. Make sure that you have Types created to represent these data shapes.
   - Example: `../types/User.ts`
2. Create a new file in this directory to hold your new slice of data. For the following sub-steps, use the `./currentUserSlice.ts` file as an example.
   1. In this new file, define a new interface and an initial state object.
   2. Then define your simplified action creators as the value of the `reducers` key in a call to Redux Toolkit's `createSlice` function.
   3. Export those action creators
   4. Export the reducer
3. Import the reducer for your slice into `./store.ts` and add it to the root reducer
   - Example: `currentUser: currentUserReducer` in that file
4. Import the action creators for your state slice into `../hooks/userActions.ts` and create a new function to bind them to React-Redux's dispatch function
   - Example: useCurrentUserActions() in that file
5. Create a new custom hook in `../hooks/useSelectors.ts` so components can retreive just the data they care about (e.g. your state slice) with less code duplication
   - Example: The useCurrentUserIs callback function in that file

This setup was heavily inspired by the examples in the [create-react-app redux-typescript template](https://github.com/reduxjs/cra-template-redux-typescript) and Stephen Grider's [Modern React with Redux - 2023 Update](https://sas.udemy.com/course-dashboard-redirect/?course_id=705264) course.
<br />
<br />

## Data retreived from an external source

An example of this scenario would be the exampleCatalogItems slice of the state store in this demo app. The data is queried for via external APIs, triggered from various componentry in the app.

Some text

1. Create a new file in this directory to hold your new slice of data. For the following sub-steps, use the `./exampleCatalogItemsSlice.ts` file as an example.
   1. Define the types to describe the data structures that will be returned and requested through your API. Create these in a new file in `../types` and export them from there
   2. Define a new API with RTK Query's createApi function and provide it a config
   3. Define and type the endpoints in your new API, including their expected return data structure, any input arguments, etc
   4. Export the custom hooks that RTK Query creates for your API
   5. Export your API itself
2. Import the reducer for your slice into `./store.ts` and add it to the root reducer
   - Example: `[catalogItemsApi.reducerPath]: catalogItemsApi.reducer` in that file
3. Concatinate your custom API's middleware to the configuration in `./store.ts`
   - Example: `.concat(catalogItemsApi.middleware);` in that file
4. Export the custom hooks that RTK generates from `../hooks/useAPIs.ts` so components can import them all from a single file
