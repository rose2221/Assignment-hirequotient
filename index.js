const endpoint =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
let users = [];
let displayedUsers = []
let cp = 1;
const upp = 10;
let ogusers = [];
async function fetchData() {
    try {
        const response = await fetch(endpoint);
        users = await response.json();
        ogusers = [...users];
        displayedUsers = users;
        rtable(displayedUsers);
        rpagination(displayedUsers);
    } catch (error) {
        console.error("Error fetching data:", error);
    }


}
fetchData();


function rtable(displayedUsers) {
    const tableContainer = document.getElementById("userTable");
    tableContainer.innerHTML = "";
    console.log(displayedUsers.length);


    const start = (cp - 1) * upp;
    const end = start + upp;
    const currentUsers = displayedUsers.slice(start, end);



    const table = document.createElement("table");
    table.classList.add("user-table");

    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
          <th>User ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
          <th>Select Rows</th>
        </tr>
      `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    currentUsers.forEach((user) => {
        const row = document.createElement("tr");
        row.id = `user${user.id}`;
        row.innerHTML = `
        <td>${user.id}</td>
        <td><span class="editable" datafield="name">${user.name}</span></td>
        <td><span class="editable" datafield="email">${user.email}</span></td>
        <td><span class="editable" datafield="role">${user.role}</span></td>
        <td>
          <button class="edit" onclick="toggleEditSave(${user.id})">Edit</button>
          <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
        </td>
        <td><input type="checkbox" id="${user.id}" name="${user.id}" value="${user.id}" onchange="toggleRowColor(${user.id})" /></td>
      `;

        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    tableContainer.appendChild(table);
}

function toggleRowColor(userId) {
    const row = document.getElementById(`user${userId}`);
    const checkbox = document.getElementById(`${userId}`);


    if (checkbox.checked) {
        row.style.backgroundColor = "#fff6";
    } else {
        row.style.backgroundColor = "";;
    }
}

function toggleEditSave(userId) {
    const row = document.getElementById(`user${userId}`);
    console.log(row);
    const editableFields = row.querySelectorAll(".editable");
    const editButton = row.querySelector(".edit");

    if (row.classList.contains("editing")) {

        row.classList.remove("editing");
        editButton.textContent = "Edit";
        // let row = displayedUsers.inserRow(userId - 1);
        // let c1 = row.insertCell(0);

        // let c2 = row.insertCell(1);
        // let c3 = row.insertCell(2);
        // let c4 = row.insertCell(3);
        let newValue;

        editableFields.forEach((field) => {
            newValue = row.querySelector(`.edit-${field.dataset.field}`).value;



            field.innerText = newValue;
            let x = field.attributes[1].nodeValue.toString();
            console.log(x);
            //console.log(displayedUsers[userId].field);
            //c1.innerText = newValue
            // console.log(field == "name");
            // const fieldName = field.dataset.field;
            // console.log('fieldName:', fieldName);

            // const userId = row.parentElement.dataset.id;
            // console.log('userId:', userId);
            // console.log('displayedUsers[userId]:', displayedUsers[userId]);

            // const extractedField = displayedUsers[userId][fieldName];
            // console.log('extractedField:', extractedField);
            if (x == "name") {
                displayedUsers[userId - 1].name = newValue;
            }
            if (x == "email") {
                displayedUsers[userId - 1].email = newValue;
            }
            if (x == "role") {
                displayedUsers[userId - 1].role = newValue;
            }
            //console.log(displayedUsers[userId].role);
            rtable(displayedUsers);
            rpagination(displayedUsers);



        });



        // let x = `.edit-${field.dataset.field}`;

        // if (userId !== -1) {
        //     displayedUsers[userId].x = newValue;
        // }
        // console.log(displayedUsers[userId].field.dataset.field);

        //console.log(displayedUsers[1].name);
    }
    // rtable(displayedUsers);
    // rpagination(displayedUsers);
    else {

        row.classList.add("editing");
        editButton.textContent = "Save";

        //console.log("saved");
        editableFields.forEach((field) => {
            const currentValue = field.innerText;
            field.innerHTML = `<input type="text" value="${currentValue}" class="edit-${field.dataset.field}" />`;
        });
        // rtable(displayedUsers);
        // rpagination(displayedUsers);
        //const userIndex = displayedUsers.findIndex((user) => user.id === userId);
        //console.log(userId);
        // if (userId !== -1) {
        //     displayedUsers[userId].field.dataset.field = field.querySelector(`.edit-${field.dataset.field}`).value;
        // }
        // console.log(displayedUsers[userId].field.dataset.field);
        // rtable(displayedUsers);
        // rpagination(displayedUsers);

    }
}




function rpagination(ogusers) {
    const paginationcon = document.querySelector(".pagination");
    paginationcon.innerHTML = "";
    const tp = Math.ceil(ogusers.length / upp);
    const maxbutton = 1;
    let startPage = 1;
    let endPage = tp;
    if (tp > maxbutton) {
        const middleButton = Math.floor(maxbutton / 2);
        const leftOffset = cp - middleButton;
        const rightOffset = cp + middleButton;

        if (leftOffset > 1) {
            startPage = leftOffset;
        } else {
            startPage = 1;
        }

        if (rightOffset < tp) {
            endPage = rightOffset;
        } else {
            endPage = tp;
        }
    }
    if (startPage > 1) {
        console.log(startPage)
        paginationcon.appendChild(
            createPaginationButton(1, "1", "first-btn", ogusers)
        );
        paginationcon.appendChild(
            createPaginationButton(cp - 1, "<", "prev-btn", ogusers)
        );
    }
    for (let i = startPage; i <= endPage; i++) {
        paginationcon.appendChild(createPaginationButton(i, i, "page-btn", ogusers));
    }
    if (endPage < tp) {
        paginationcon.appendChild(
            createPaginationButton(cp + 1, ">", "next-btn", ogusers)
        );
        paginationcon.appendChild(
            createPaginationButton(tp, ">>", "last-btn", ogusers)
        );
    }
}

function createPaginationButton(pageNum, text, className, ogusers) {
    const button = document.createElement("button");
    let buttonContent = text;

    button.textContent = buttonContent;
    button.classList.add(className);
    if (cp === pageNum) {

        button.disabled = true;
        button.classList.add("active");
    } else {

        button.addEventListener("click", () => {
            document.getElementById("selectAll").checked = false;
            cp = pageNum;
            rtable(ogusers);
            rpagination(ogusers);
        });
    }
    return button;
}



function searchUsers() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const searchButton = document.getElementById("searchButton");
    const clearButton = document.getElementById("clearButton");
    if (searchTerm.trim() === "") {

        users = [...ogusers];
        console.log(clearButton.style.visibility);
        clearButton.style.display = "none";

        console.log(clearButton.style.visibility);
    } else {

        const filteredUsers = displayedUsers.filter((user) => {
            for (const prop in user) {
                if (user[prop].toString().toLowerCase().includes(searchTerm)) {
                    return true;
                }
            }
            for (const prop in user) {

                if (prop === "id" && user[prop].toString().toLowerCase().includes(searchTerm)) {
                    return true;
                } else if (user[prop].toString().toLowerCase().includes(searchTerm)) {
                    return true;
                }
            }
            return false;
        });

        users = filteredUsers;
        //clearButton.style.visibility = "visible";
        clearButton.style.display = "block";
    }
    cp = 1;
    rtable(users);
    rpagination(users);




}

function clearSearch() {

    users = [...ogusers];
    cp = 1;
    rtable(displayedUsers);
    rpagination(displayedUsers);

    const searchButton = document.getElementById("searchButton");
    const clearButton = document.getElementById("clearButton");

    searchButton.style.display = "block";
    clearButton.style.display = "none";

    document.getElementById("searchInput").value = "";
}

document.getElementById("searchInput").addEventListener("keyup", function(event) {

    if (event.key === "Enter") {
        searchUsers();
    }
});

document.getElementById("searchButton").addEventListener("click", searchUsers);
document.getElementById("clearButton").addEventListener("click", clearSearch);




function deleteUser(userId) {

    const row = document.getElementById(`user${userId}`);
    if (row) {
        row.remove();


        users = users.filter(user => user.id !== userId);
        displayedUsers.splice(userId - 1, 1);
        console.log(displayedUsers.length, users.length);


        rtable(displayedUsers);
        console.log("aa");
        rpagination(displayedUsers);
        console.log("bb");
    }
}

function deleteSelected() {
    const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    selectedCheckboxes.forEach((checkbox) => {
        const userId = checkbox.value;
        users = users.filter(user => user.id !== userId);
        displayedUsers.splice(userId - 1, 1);
        deleteUser(userId);
    });
    document.getElementById("selectAll").checked = false;
}

document.getElementById("selectAll").addEventListener("change", function() {
    const checkboxes = document.querySelectorAll(
        '#userTable input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
        checkbox.checked = this.checked;
        toggleRowColor(checkbox.value);
    });
});