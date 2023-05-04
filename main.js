// Get the form element
const form = document.getElementById('my-form');

// Get the users element
const userList = document.getElementById('users');

// Initialize users array or retrieve existing one from local storage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Display users from local storage
function displayUsers() {
  userList.innerHTML = '';
  users.forEach((user, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${user.name}</b> (${user.email}) - ${user.phone} 
    <button class="btn btn-danger btn-sm float-right delete" data-index="${index}">Delete</button>
    <button class="btn btn-primary btn-sm float-right edit" data-index="${index}">Edit</button>`;
    userList.appendChild(li);
  });
}

// Display users on page load
displayUsers();

// Add a submit event listener to the form
form.addEventListener('submit', e => {
  e.preventDefault(); // Prevent default form action
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  // Create a new user object
  const user = {
    name,
    email,
    phone
  };

  // Add the new user object to the array of users
  users.push(user);

  // Store the users array in local storage
  localStorage.setItem('users', JSON.stringify(users));

  // Display the updated list of users
  displayUsers();

  // Reset the form
  form.reset();
});

// Add a delete event listener to the users list
userList.addEventListener('click', e => {
  if (e.target.classList.contains('delete')) {
    const index = e.target.dataset.index;
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers();
  } else if (e.target.classList.contains('edit')) {
    const index = e.target.dataset.index;
    const user = users[index];

    // Populate the form fields with the user data
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;

    // Remove the existing user data from the local storage
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));

    // Update the displayed list of users
    displayUsers();
  }
});
