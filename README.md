# Project Setup Instructions

Follow these steps to set up and run the client-side of the project:

## Frontend Setup

1. Open Command Prompt or VS Code terminal and navigate to the directory where you have cloned this repository:
   ```sh
   cd path_of_the_repository
  
2. Install the dependencies for the client-side of the application:
   ```sh
   yarn install

3. Install the iOS dependencies with the application by navigating to the directory of the iOS folder and running the command below step by step
   ```sh
   cd ios  
   pod install
   pod repo update

4. Then navigate to repository directory and start the frontend server:
   ```sh
   cd ..
   yarn expo run:ios

## Additional Information
Ensure that all the dependencies are properly installed.
If you encounter any issues, refer to the project's documentation or contact the project maintainer.  

