# User Authentication System

This project implements a user authentication system using Django for the backend and React for the frontend. It includes user registration, login, password reset functionality, and profile management.

## Backend (Django)

The backend is built using Django with the Django REST framework to provide a RESTful API for handling user-related operations. The authentication uses JSON Web Tokens (JWT) for secure communication.

### Key Features

1. **User Registration**
   - Endpoint: `POST /api/auth/register`
   - Validates and creates a new user with username, email, and password.
   - Sends a success message upon successful registration.

2. **User Login**
   - Endpoint: `POST /api/auth/login`
   - Accepts username/email and password, and returns a JWT token pair (access and refresh tokens).

3. **User Profile**
   - Endpoint: `GET /api/user/profile/`
   - Requires authentication (JWT).
   - Retrieves the authenticated user's profile, including their username, email, and last password change time.

4. **Change Password**
   - Endpoint: `POST /api/user/change-password/`
   - Requires authentication (JWT).
   - Allows the authenticated user to change their password by verifying their old password and setting a new one.

5. **Forgot Password**
   - Endpoint: `POST /api/auth/forgot-password/`
   - Sends a password reset email with a reset link to the user's registered email address.

6. **Reset Password**
   - Endpoint: `POST /api/auth/reset-password/`
   - Allows the user to reset their password using a token and user ID from a password reset link sent via email.

### Models

- **User** (from `django.contrib.auth.models.User`):
  - Standard Django user model with fields such as `username`, `email`, and `password`.
  
- **UserProfile**:
  - A custom model linked to the `User` model with an additional field `last_password_change` to track the user's last password change time.

### Serializers

- **UserSerializer**: Handles serialization and validation for the `User` model.
  - Validates unique email on registration.
  - Creates a new user and associated `UserProfile`.
  
- **UserProfileSerializer**: Serializes the `UserProfile` model to include user details such as `username`, `email`, `date_joined`, and `last_updated`.

- **ChangePasswordSerializer**: Serializes old and new password for the `ChangePasswordView`.
  
- **ForgotPasswordSerializer**: Handles the email field to send a password reset email.

- **ResetPasswordSerializer**: Serializes the password reset process using `uidb64` and `token` from the reset link.

- **CustomTokenObtainPairSerializer**: Customizes the JWT login behavior to allow login using either username or email.

### Views

- **UserProfileView**: Retrieves the authenticated user's profile.
  
- **CreateUserView**: Registers a new user with email and password.

- **ChangePasswordView**: Allows an authenticated user to change their password.

- **CustomTokenObtainPairView**: Custom view for obtaining JWT tokens.

- **ForgotPasswordView**: Sends a password reset email to the user.

- **ResetPasswordView**: Allows the user to reset their password using a valid token and `uidb64`.

### URLs

- `/api/auth/register`: User registration.
- `/api/auth/login`: User login with JWT token response.
- `/api/user/profile/`: User profile details (requires authentication).
- `/api/user/change-password/`: Change the user's password (requires authentication).
- `/api/auth/forgot-password/`: Password reset request.
- `/api/auth/reset-password/`: Password reset using token and user ID.

### Settings

- `FRONTEND_URL`: The base URL of the frontend application, used in password reset emails.
- `DEFAULT_FROM_EMAIL`: The email address used for sending email notifications.

### Token Authentication

JWT is used for authentication, and the access token expires in a set time (default: 5 minutes). The refresh token is used to obtain a new access token.

- **Access Token**: Short-lived, used for authenticating API requests.
- **Refresh Token**: Long-lived, used to refresh the access token.

### Permissions

- **IsAuthenticated**: Ensures that only authenticated users can access certain views like profile and password change.
- **AllowAny**: Used for publicly accessible views like registration and password reset.

### Example Responses

#### User Registration (POST /api/auth/register)
```json
{
  "message": "User created successfully"
}


Login (POST /api/auth/login)
json
Copy code
{
  "access": "access_token",
  "refresh": "refresh_token"
}
Password Reset Email (POST /api/auth/forgot-password/)
json
Copy code
{
  "message": "Password reset instructions sent to your email"
}
Password Reset (POST /api/auth/reset-password/)
json
Copy code
{
  "message": "Password has been reset successfully"
}
Frontend (React)
The frontend is built with React and communicates with the Django backend via API calls. It manages user authentication using JWT tokens and provides the user interface for login, registration, profile management, and password reset.

Features
User login using either email or username.
Password reset functionality using email-based links.
Display user profile information once authenticated.
Setup
Backend Setup
Clone the repository.
Create a virtual environment: python3 -m venv env.
Install dependencies: pip install -r requirements.txt.
Run migrations: python manage.py migrate.
Create a superuser for admin: python manage.py createsuperuser.
Run the server: python manage.py runserver.
Frontend Setup
Clone the frontend repository.
Install dependencies: npm install.
Run the React app: npm start.