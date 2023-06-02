// Get the form element
const form = document.getElementById('my-form');

// Get the users element
const userList = document.getElementById('users');

// Initialize users array or retrieve existing one from cloud storage
let users = [];
let editedIndex = -1; // Track the index of the edited user

// Display users from local storage
function displayUsers() {
    userList.innerHTML = '';
    users.forEach((user, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<b>${user.name}</b> (${user.email}) - ${user.phone} 
    <button class="btn btn-danger btn-sm float-right delete" data-index="${index}" data-id="${user._id}">Delete</button>
    <button class="btn btn-primary btn-sm float-right edit" data-index="${index}">Edit</button>`;
        userList.appendChild(li);
    });
}

// fetch users from cloud to show on Page
function fetchUsers() {
    axios.get('https://crudcrud.com/api/2416973768e14590baf608943346915d/appointmentData')
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

    if (editedIndex === -1) {
        // Add a new user
        axios.post('https://crudcrud.com/api/2416973768e14590baf608943346915d/appointmentData', user)
            .then(response => {
                console.log('Object stored in the cloud:', response.data);
                user._id = response.data._id; // Add the generated _id to the user object
                users.push(user); // Add the user to the local users array
                displayUsers(); // Update the displayed list of users
                form.reset();
            })
            .catch(error => {
                console.error('Error storing object in the cloud:', error);
            });
    } else {
        // Edit an existing user
        const id = users[editedIndex]._id;
        axios.put(`https://crudcrud.com/api/2416973768e14590baf608943346915d/appointmentData/${id}`, user)
            .then(response => {
                console.log('User updated:', response.data);
                users[editedIndex] = user; // Update the user in the local users array
                displayUsers(); // Update the displayed list of users
                form.reset();
                editedIndex = -1; // Reset the edited index
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
    }
});

// Add a delete event listener to the users list
userList.addEventListener('click', e => {
    if (e.target.classList.contains('delete')) {
        const index = e.target.dataset.index;
        const id = e.target.dataset.id;

        // Send a DELETE request to the API
        axios.delete(`https://crudcrud.com/api/2416973768e14590baf608943346915d/appointmentData/${id}`)
            .then(response => {
                console.log('User deleted:', response.data);

                // Remove the deleted user from the local array
                users.splice(index, 1);

                // Update the displayed list of users
                displayUsers();
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    } else if (e.target.classList.contains('edit')) {
        const index = e.target.dataset.index;
        const user = users[index];

        // Populate the form fields with the user data
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone;

        // Mark the index of the edited user
        editedIndex = index;
    }
});

// Fetch users on page load
fetchUsers();
