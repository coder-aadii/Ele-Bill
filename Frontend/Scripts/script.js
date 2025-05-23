// Merged DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  // Get the toggle switch and the tab content elements
  const toggleSwitch = document.getElementById("toggleSwitch");
  const loginForm = document.getElementById("pills-login");
  const registerForm = document.getElementById("pills-register");
  const loginLabel = document.querySelector('.login-label');
  const registerLabel = document.querySelector('.register-label');


  // Function to switch between login and register forms
  function switchForms() {
    if (toggleSwitch.checked) {
      loginForm.classList.add("show", "active");
      registerForm.classList.remove("show", "active");

      // Darken "Login" label and fade "Registration" label
      loginLabel.style.color = '#333'; // Darken the Login label
      loginLabel.style.fontWeight = 'bold'; // Bold Login label
      registerLabel.style.color = '#ccc'; // Fade the Registration label

    } else {
      loginForm.classList.remove("show", "active");
      registerForm.classList.add("show", "active");

      // Darken "Registration" label and fade "Login" label
      registerLabel.style.color = '#333'; // Darken the Registration label
      registerLabel.style.fontWeight = 'bold'; // Bold Registration label
      loginLabel.style.color = '#ccc'; // Fade the Login label
    }
  }

  // Initially load the correct form based on the toggle state
  switchForms();

  // Event listener for the toggle switch change
  toggleSwitch.addEventListener("change", switchForms);

  // Event listener for the "Register" link in the login form
  document.getElementById("registerLink").addEventListener("click", function (e) {
    e.preventDefault();
    toggleSwitch.checked = !toggleSwitch.checked; // Toggle the switch
    toggleSwitch.dispatchEvent(new Event("change")); // Trigger the change event
  });

  // Fetch user data logic
  const userId = "6730407923af6ed86bf9ac3b";  // Replace with dynamic user ID
  const apiUrl = `${process.env.REACT_APP_URL}/api/user/${userId}`;
  axios.get(apiUrl)
    .then(response => {
      const user = response.data.user;
      populateUserData(user);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
});

// Toggle password visibility (Login form)
document.getElementById('togglePassword').addEventListener('click', function () {
  const passwordField = document.getElementById('loginPassword');
  const icon = this.querySelector('i');
  const isPasswordVisible = passwordField.type === 'password';

  passwordField.type = isPasswordVisible ? 'text' : 'password';
  icon.classList.toggle('fa-eye', isPasswordVisible);
  icon.classList.toggle('fa-eye-slash', !isPasswordVisible);
});

// Toggle password visibility (Register form)
document.getElementById('toggleRegisterPassword').addEventListener('click', function () {
  const passwordField = document.getElementById('registerPassword');
  const icon = this.querySelector('i');
  const isPasswordVisible = passwordField.type === 'password';

  passwordField.type = isPasswordVisible ? 'text' : 'password';
  icon.classList.toggle('fa-eye', isPasswordVisible);
  icon.classList.toggle('fa-eye-slash', !isPasswordVisible);
});

// Function to send API requests (common for login and register)
function sendApiRequest(url, method, data) {
  return fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(response => {
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  });
}

// Login logic (unchanged)
document.getElementById('login').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent form submission

  // Get the values from the input fields
  const email = document.getElementById('loginName').value;
  const password = document.getElementById('loginPassword').value;

  // Validate input
  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  const loginData = { email: email, password: password };

  sendApiRequest('https://ele-bill.onrender.com/api/auth/login', 'POST', loginData)
    .then(data => {
      if (data.message === 'Login successful') {
        localStorage.setItem('authuser', JSON.stringify(data));
        window.location.href = 'home.html';
      } else {
        alert('Login failed: ' + (data.message || 'Unknown error'));
      }
    })
    .catch(error => {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    });
});

// Register logic
document.getElementById("register").addEventListener("click", function (event) {
  event.preventDefault();  // Prevent form submission to perform validation

  // Get the form values
  const email = document.getElementById("registerEmail").value;
  const dob = document.getElementById("registerDOB").value;
  const firstName = document.getElementById("registerFirstName").value;
  const lastName = document.getElementById("registerLastName").value;
  const password = document.getElementById("registerPassword").value;
  const isChecked = document.getElementById("registerCheck").checked;

  let errorMessage = "";

  // Email Validation (Regex for basic email format)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    errorMessage += "Please enter a valid email address.\n";
  }

  // Age Validation: Check if age is 18 or more
  const userAge = calculateAge(dob);
  if (userAge < 18) {
    errorMessage += "You must be at least 18 years old to register.\n";
  }

  // Check if first and last name are filled
  if (!firstName || !lastName) {
    errorMessage += "Please fill in both your first and last names.\n";
  }

  if (!dob) {
    errorMessage += "Please enter your date of birth.\n";
  }

  if (!isChecked) {
    errorMessage += "You must agree to the terms and conditions.\n";
  }

  const registerData = { firstName, lastName, email, password, dob };

  // Display error message if any validation fails
  if (errorMessage) {
    alert(errorMessage);
  } else {
    sendApiRequest("https://ele-bill.onrender.com/api/auth/signup", "POST", registerData)
      .then(data => {
        alert("Registration successful!");
        localStorage.setItem('authuser', JSON.stringify(data));
        window.location.href = 'index.html';
      })
      .catch(error => {
        alert("An error occurred during registration.");
        console.error("Registration error:", error);
      });
  }
});

// Function to calculate the age from the date of birth
function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Populate user data into the form
function populateUserData(user) {
  document.getElementById('firstName').value = user.firstName || '';
  document.getElementById('lastName').value = user.lastName || '';
  document.getElementById('email').value = user.email || '';
  document.getElementById('phoneNumber').value = user.phoneNumber || '';
  document.getElementById('dateOfBirth').value = user.dateOfBirth || '';
  document.getElementById('billingCycle').value = user.billingCycle || '';
  document.getElementById('address').value = user.address ? `${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.zipCode}` : '';
}

// Toggle the edit mode
function toggleEdit() {
  const isEditing = document.getElementById('firstName').disabled;

  // Toggle the disabled property of inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => input.disabled = !isEditing);

  // Show/Hide the Edit and Save buttons
  document.getElementById('editBtn').style.display = isEditing ? 'none' : 'inline-block';
  document.getElementById('saveBtn').style.display = isEditing ? 'inline-block' : 'none';
}

// Save the profile data
function saveProfile() {
  const userId = JSON.parse(localStorage.getItem('authuser')).user._id;
  const apiUrl = `https://ele-bill.onrender.com/api/auth/user/${userId}`;

  // Gather updated data
  const updatedData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phoneNumber: document.getElementById('phoneNumber').value,
    dateOfBirth: document.getElementById('dateOfBirth').value,
    billingCycle: document.getElementById('billingCycle').value,
    address: document.getElementById('address').value,
  };

  axios.put(apiUrl, updatedData)
    .then(response => {
      alert('Profile updated successfully');
      toggleEdit();  // Switch back to non-editable mode
    })
    .catch(error => {
      console.error('Error saving profile:', error);
    });
}
