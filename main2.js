// Get the form element
const form = document.getElementById('my-form');

// Get the users element
const userList = document.getElementById('users');

// Initialize users array or retrieve existing one from cloud storage
let users = [];

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

// fetch users from clod to show on Page
function fetchUsers() {
    axios.get('https://crudcrud.com/api/9bf6c8641cf44f059970340ce7d3d528/appointmentData')
      .then(response => {
        users = response.data;
        displayUsers();
      })
      .catch(error => {
        console.error('Error fetching users from the cloud:', error);
      });
  }
  

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

  // Store the users array in cloud storage
  axios.post('https://crudcrud.com/api/9bf6c8641cf44f059970340ce7d3d528/appointmentData', user)
    .then(response => {
      console.log('Object stored in the cloud:', response.data);
      users.push(user);
      displayUsers();
      form.reset();
    })
    .catch(error => {
      console.error('Error storing object in the cloud:', error);
    });
});

// Add a delete event listener to the users list
userList.addEventListener('click', e => {
  if (e.target.classList.contains('delete')) {
    const index = e.target.dataset.index;
    users.splice(index, 1);
    displayUsers();
  } else if (e.target.classList.contains('edit')) {
    const index = e.target.dataset.index;
    const user = users[index];

    // Populate the form fields with the user data
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;

    // Remove the existing user data from the storage
    users.splice(index, 1);

    // Update the displayed list of users
    displayUsers();
  }
});
// Fetch users on page load
fetchUsers();
