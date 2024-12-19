Django Backend for User Authentication and Profile Management
Overview
This Django backend provides APIs for user authentication, registration, password management, and user profile retrieval. It is integrated with a React frontend for a full-stack application.

Key Features:
User Registration: Allows users to register using their username, email, and password.
User Login: Users can log in with their credentials and receive a JWT token for authentication.
Change Password: Authenticated users can change their password.
Forgot Password: Users can request a password reset link.
Reset Password: Users can reset their password by following the link sent to their email.
User Profile: Users can retrieve their profile information, including the last password change date.
Backend Implementation Details
Technologies Used:
Django: Framework for building the backend APIs.
Django REST Framework (DRF): For building and managing RESTful APIs.
Simple JWT: JSON Web Tokens (JWT) for secure authentication.
Django ORM: For interacting with the database.
Django Email: For sending password reset emails.
SQLite: Default database used for development. You can switch to another database if needed (e.g., PostgreSQL, MySQL).
Setup Instructions
1. Clone the repository
bash
Copy code
git clone https://github.com/your-repo-name/backend.git
cd backend
2. Set up a virtual environment
bash
Copy code
python -m venv env
source env/bin/activate  # On Windows, use 'env\Scripts\activate'
3. Install dependencies
bash
Copy code
pip install -r requirements.txt
4. Apply migrations
Run the following command to apply migrations for setting up the database:

bash
Copy code
python manage.py migrate
5. Create a superuser (optional for admin panel)
To access the Django admin panel, create a superuser:

bash
Copy code
python manage.py createsuperuser
6. Run the development server
Start the server to test the APIs:

bash
Copy code
python manage.py runserver
The backend will be available at http://127.0.0.1:8000/.

API Endpoints
1. User Registration
URL: /api/auth/register/
Method: POST
Request body:
json
Copy code
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "yourpassword123"
}
Response:
json
Copy code
{
  "message": "User created successfully"
}
2. User Login
URL: /api/auth/login/
Method: POST
Request body:
json
Copy code
{
  "username": "john_doe",
  "password": "yourpassword123"
}
Response:
json
Copy code
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token"
}
3. Get User Profile
URL: /api/user/profile/
Method: GET
Headers:
Authorization: Bearer <access_token>
Response:
json
Copy code
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "date_joined": "2024-12-19T10:00:00Z",
  "last_updated": "2024-12-19T10:00:00Z"
}
4. Change Password
URL: /api/user/change-password/
Method: POST
Request body:
json
Copy code
{
  "old_password": "youroldpassword123",
  "new_password": "yournewpassword123"
}
Response:
json
Copy code
{
  "message": "Password changed successfully"
}
5. Forgot Password
URL: /api/auth/forgot-password/
Method: POST
Request body:
json
Copy code
{
  "email": "john@example.com"
}
Response:
json
Copy code
{
  "message": "Password reset instructions sent to your email"
}
6. Reset Password
URL: /api/auth/reset-password/
Method: POST
Request body:
json
Copy code
{
  "uidb64": "uid_encoded_string",
  "token": "password_reset_token",
  "password": "newpassword123"
}
Response:
json
Copy code
{
  "message": "Password has been reset successfully"
}
Models
UserProfile
user: A one-to-one relationship with the User model.
last_password_change: A datetime field to store the last password change date.
python
Copy code
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    last_password_change = models.DateTimeField(null=True, blank=True)
JWT Authentication
Simple JWT is used for authentication. The CustomTokenObtainPairSerializer class customizes the token retrieval process to allow login with either a username or email.
Password Reset Flow
The user requests a password reset with their email.
A reset link with a token is sent to the user's email.
The user clicks the link and resets the password using the ResetPasswordView.
Security Considerations
Passwords are stored securely using Django's built-in hashing mechanisms.
JWT tokens are used for stateless authentication. Ensure that the frontend stores the token securely.
Frontend Integration
To interact with these endpoints, the React frontend will make HTTP requests to the backend using Axios or Fetch. Ensure that you send the appropriate JWT token in the Authorization header for protected routes.

Example:

javascript
Copy code
axios.post('/api/auth/login/', {
  username: 'john_doe',
  password: 'yourpassword123'
}).then(response => {
  localStorage.setItem('access_token', response.data.access);
});
Conclusion
This Django backend provides a robust API for managing users, passwords, and profiles, and it integrates seamlessly with the React frontend. For further modifications or enhancements, feel free to update the serializers, views, or models as needed.
