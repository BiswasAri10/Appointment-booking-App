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
    <button class="btn btn-danger btn-sm float-right delete" data-index="${index}" data-id="${user._id}">Delete</button>
    <button class="btn btn-primary btn-sm float-right edit" data-index="${index}">Edit</button>`;
        userList.appendChild(li);
    });
}

// fetch users from cloud to show on Page
function fetchUsers() {
    axios.get('https://crudcrud.com/api/86bacebf0b054579a0f580d2b7b2dbdc/appointmentData')
        .then(response => {
            users = response.data;
            displayUsers();
        })
        .catch(error => {
            console.error('Error fetching users from the cloud:', error);
        });
}

// Add a submit event listener to the form for adding new appointments
form.addEventListener('submit', submitForm);

// Function to handle form submission for adding new appointments
function submitForm(e) {
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

    // Store the user in the cloud storage
    axios.post('https://crudcrud.com/api/86bacebf0b054579a0f580d2b7b2dbdc/appointmentData', user)
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
}

// Add a delete event listener to the users list
userList.addEventListener('click', e => {
    if (e.target.classList.contains('delete')) {
        const index = e.target.dataset.index;
        const id = e.target.dataset.id;

        // Send a DELETE request to the API
        axios.delete(`https://crudcrud.com/api/86bacebf0b054579a0f580d2b7b2dbdc/appointmentData/${id}`)
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

        // Remove the existing user data from the storage
        users.splice(index, 1);

        // Update the displayed list of users
        displayUsers();

        // Update the form submit event listener to handle editing
        form.removeEventListener('submit', submitForm); // Remove the previous event listener
        form.addEventListener('submit', editForm); // Add a new event listener for editing
    }
});

// Function to handle form submission for editing appointments
function editForm(e) {
    e.preventDefault(); // Prevent default form action
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const index = users.findIndex(user => user._id === user._id); // Get the index of the edited user

    // Create a new user object
    const user = {
        name,
        email,
        phone
    };

    // Store the updated user details in the cloud storage
    axios.put(`https://crudcrud.com/api/86bacebf0b054579a0f580d2b7b2dbdc/appointmentData/$${users[index]._id}`, user)
        .then(response => {
            console.log('Object updated in the cloud:', response.data);
            users.splice(index, 0, response.data); // Update the local users array with the edited user
            displayUsers(); // Update the displayed list of users
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            form.reset();

            // Restore the form submit event listener for adding new appointments
            form.removeEventListener('submit', editForm);
            form.addEventListener('submit', submitForm);
        })
        .catch(error => {
            console.error('Error updating object in the cloud:', error);
        });
}

// Fetch users on page load
fetchUsers();
