### FOR LOCALHOST 
## Backend setup
step 1: just go to google gemini page and get a gemini api
step 2: copy that 
step 3: create .env file
step 4: go to backend folder/ .env file
copy below and paste in .env file in backend
```
MONGO_URI=mongodb://localhost:27017/lms_portal
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=paste your gemini api key
FRONTEND_URL="http://localhost:5173"
PORT=8000
NODE_ENV=development
```
## Frontend setup
step 4: go to frontend folder/ create .env file
copy below and paste in .env file in frontend
```
VITE_API_BASE_URL=http://localhost:8000
```

### To run the frontend
goto frontend and open CMD in same path,
run command "npm install" //this will install all the dependencies
run command "npm run dev"

### To run the backend  
goto backend and open CMD in same path,
run command "npm install" //this will install all the dependencies
run command "nodemon i"

DONE
