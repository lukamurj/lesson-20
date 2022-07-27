// // COMMENT modals, popup
function dynamicOpenModal(selector) {
  const modal = document.querySelector(selector);
  if (modal) {
    modal.classList.add("open");

    const closeBtn = modal.querySelector(".modal-close");
    closeBtn.addEventListener("click", () => {
      dynamicCloseModal(selector);
    });
  }
}

function dynamicCloseModal(selector) {
  const modal = document.querySelector(selector);
  if (modal) {
    modal.classList.remove("open");
  }
}

const openRegFormBtn = document.querySelector("#open-reg-form");
openRegFormBtn.addEventListener("click", () => {
  dynamicOpenModal("#reg-modal");
});

//NOTE Requests and Responses

const createUserUrl = "http://borjomi.loremipsum.ge/api/register", //method POST
  getAllUsersUrl = "http://borjomi.loremipsum.ge/api/all-users", //method GET
  getSingleUserUrl = "http://borjomi.loremipsum.ge/api/get-user/", //id method  GET
  updateUserUrl = "http://borjomi.loremipsum.ge/api/update-user/", //id method PUT
  deleteUserUrl = "http://borjomi.loremipsum.ge/api/delete-user/"; //id method DELETE

const regForm = document.querySelector("#reg"),
  user_Name = document.querySelector("#user_name"),
  userSurname = document.querySelector("#user_surname"),
  userEmail = document.querySelector("#user_email"),
  userPhone = document.querySelector("#user_phone"),
  userPersonalID = document.querySelector("#user_personal-id"),
  userZip = document.querySelector("#user_zip-code"),
  userGender = document.querySelector("#user_gender"),
  // user id ფორმში, რომელიც გვჭირდება დაედითებისთვის
  user_id = document.querySelector("#user_id"),
  table = document.querySelector("table");
let edit_btn = "1",
  tr = "",
  delete_btn = "2";

// TODO: დაასრულეთ შემდეგი ფუნქციები
function renderUsers(usersArray) {
  // TODO: usersArray არის სერვერიდან დაბრუნებული ობიექტების მასივი
  // TODO: ამ მონაცმების მიხედვით html ში ჩასვით ცხრილი როგორც "ცხრილი.png" შია

  //   usersArray = [
  //     {
  //       id: user_id.value,
  //       name: user_Name.value,
  //       surname: userSurname.value,
  //       email: userEmail.value,
  //       personalID: userPersonalID.vaule,
  //       mobileNumber: userPhone.value,
  //       zip: userZip.value,
  //       gender: userGender.value,
  //     },
  //   ];
  let text = "";
  console.log(usersArray);
  usersArray.forEach((user) => {
    text += `<tr data-user-ids ="${user.id}">  
	  <td>${user.id}</td>
	  <td>${user.first_name}</td>
       <td>${user.last_name}</td>
       <td>${user.email}</td>
       <td>${user.id_number}</td>
       <td>${user.phone}</td>
	  <td>${user.zip_code}</td>
       <td>${user.gender}</td>
       <td><button class ="edit_btn" data-user-id ="${user.id}">Edit</button> 
	  <button class ="delete_btn" data-user-id ="${user.id}">Delete</button></td>
	  <tr>`;
  });

  table.innerHTML += text;
  edit_btn = document.querySelectorAll(".edit_btn");
  delete_btn = document.querySelectorAll(".delete_btn");
  tr = document.querySelectorAll("tr");
  console.log(usersArray);
  userActions(); // ყოველ რენდერზე ახლიდან უნდა მივაბათ ივენთ ლისნერები
}

// TODO: დაასრულე
function userActions() {
  // 1. ცხრილში ღილაკებზე უნდა მიამაგროთ event listener-ები
  // 2. იქნება 2 ღილაკი რედაქტირება და წაშლა როგორც "ცხრილი.png" ში ჩანს
  // 3. id შეინახეთ data-user-id ატრიბუტად ღილაკებზე, data ატრიბუტებზე წვდომა შეგიძლიათ dataset-ის გამოყენებით
  //  selectedElement.dataset
  // 4. წაშლა ღილაკზე დაჭერისას უნდა გაიგზავნოს წაშლის მოთხოვნა (deleteUser ფუნქციის მეშვეობით) სერვერზე და გადაეცეს id

  delete_btn.forEach((btn) => {
    let idNum = btn.dataset.userId;

    btn.addEventListener("click", () => {
      fetch(`${deleteUserUrl}${idNum}`, {
        method: "delete",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });

      for (let i = 0; i < tr.length; i++) {
        if (idNum === tr[i].dataset.userIds) {
          tr[i].classList.add("hidden");
        }
      }
    });
  });

  // 5. ედიტის ღილაკზე უნდა გაიხსნას მოდალი სადაც ფორმი იქნება იმ მონაცემებით შევსებული რომელზეც მოხდა კლიკი

  edit_btn.forEach((btn) => {
    btn.addEventListener("click", () => {
      let idNum = btn.dataset.userId;
      for (let i = 0; i < tr.length; i++) {
        if (idNum === tr[i].dataset.userIds) {
          user_Name.value = tr[i].childNodes[1].innerHTML;
          userSurname.value = tr[i].childNodes[2].innerHTML;
          userEmail.value = tr[i].childNodes[3].innerHTML;
          userPhone.value = tr[i].childNodes[5].innerHTML;
          userPersonalID.value = tr[i].childNodes[4].innerHTML;
          userZip.value = tr[i].childNodes[6].innerHTML;
          userGender.value = tr[i].childNodes[7].innerHTML;
        }
      }
      getUser();
      user_Name.value = dynamicOpenModal("#reg-modal");
    });
  });
  // ედიტის ღილაკზე უნდა გამოიძახოთ getUser ფუნქცია და რომ დააბრუნებს ერთი მომხმარებლის დატას (ობიექტს
  // და არა მასივს)
  // ეს დატა უნდა შეივსოს ფორმში
  // და ამის შემდეგ შეგიძლიათ დააედიტოთ ეს ინფორმაცია და ფორმის დასაბმითებისას უნდა მოხდეს updateUser()
  // ფუნქციის გამოძახება, სადაც გადასცემთ განახლებულ იუზერის ობიექტს, გვჭირდება იუზერის აიდიც, რომელიც
  // მოდალის გახსნისას user_id-ის (hidden input არის და ვიზუალურად არ ჩანს) value-ში შეგიძლია შეინახოთ
}

function getUsers() {
  fetch("http://borjomi.loremipsum.ge/api/all-users")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // console.log(data);
      let users = data.users;
      // console.log(users);

      // html-ში გამოტანა მონაცემების
      renderUsers(users);
    })
    .catch((error) => {
      console.log(error);
    });
}

function deleteUser(id) {
  fetch(`http://borjomi.loremipsum.ge/api/delete-user/${id}`, {
    method: "delete",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // გვიბრუნებს სტატუსს
    })
    .catch((error) => {
      console.log(error);
    });
}

function getUser() {
  fetch(`http://borjomi.loremipsum.ge/api/get-user/${id}`, {
    method: "get",
  })
    .then((res) => res.json())
    .then((data) => {
      // გვიბრუნებს იუზერის ობიექტს
      console.log(data);
      getUsers(); //TODO: შენახვის, ედიტირების და წაშლის შემდეგ ახლიდან წამოიღეთ დატა
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateUser(userObj) {
  // მიიღებს დაედითებულ ინფორმაციას და გააგზავნით სერვერზე
  // TODO დაასრულეთ ფუნქცია
  //  method: "put",  http://borjomi.loremipsum.ge/api/update-user/${userObj.id}
  // TODO: შენახვის, ედიტირების და წაშლის შემდეგ ახლიდან წამოიღეთ დატა

  fetch(`http://borjomi.loremipsum.ge/api/update-user/${userObj.id}`, {
    method: "put",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });

  fetch(`http://borjomi.loremipsum.ge/api/get-user/${userObj.id}`, {
    method: "get",
  })
    .then((res) => res.json())
    .then((data) => {
      // გვიბრუნებს იუზერის ობიექტს
      console.log(data);
      getUsers(); //TODO: შენახვის, ედიტირების და წაშლის შემდეგ ახლიდან წამოიღეთ დატა
    })
    .catch((error) => {
      console.log(error);
    });
}

function createUser(userData) {
  fetch("http://borjomi.loremipsum.ge/api/register", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // გვიბრუნებს სტატსუსს (წარმატებით გაიგზავნა თუ არა) და დამატებული იუზერის ობიექტს
      // დატის მიღების შემდეგ ვწერთ ჩვენს კოდს
      console.log(data);
      // ხელახლა გამოგვაქვს ყველა იუზერი
      // TODO: შენახვის, ედიტირების და წაშლის შემდეგ ახლიდან წამოიღეთ დატა
      // getUsers();
    })
    .catch((error) => {
      console.log(error);
    });
}

getUsers();

regForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const userInfo = {
    id: user_id.value,
    first_name: user_Name.value,
    last_name: userSurname.value,
    phone: userPhone.value,
    id_number: userPersonalID.value,
    email: userEmail.value,
    gender: userGender.value,
    zip_code: userZip.value,
  };
  //  TODO: თუ user_id.value არის ცარიელი მაშინ უნდა შევქმნათ  -->  createUser(userData);
  // TODO: თუ user_id.value არის მაშინ უნდა დავაედიტოთ, (როცა ფორმს ედითის ღილაკის შემდეგ იუზერის ინფოთი
  // ვავსებთ, ვაედითებთ და ვასაბმითებს) -->  updateUser(userData);

  if (user_id === undefined) {
    createUser(userInfo);
  } else {
    updateUser(userInfo);
  }

  // console.log(userInfo, JSON.stringify(userInfo));
  // ინფორმაციის გაგზავნის შემდეგ ფორმის გასუფთავება
  regForm.reset();
});

// რადგან fetch ასინქრონული ფუნქციაა კოდის ამ ნაწილის შესრულებას არ აფერხებს

console.log("example text");

// jsonplaceholder-ის სატესტო დატა, გაგზავნა მონაცემების

// function createData(testData) {
// 	fetch("https://jsonplaceholder.typicode.com/posts", {
// 		method: "POST",
// 		body: JSON.stringify(testData),
// 		headers: {
// 			"Content-type": "application/json; charset=UTF-8",
// 		},
// 	})
// 		.then((response) => response.json())
// 		.then((json) => {
// 			console.log(json);
// 		});
// }

// const data = {
// 	title: "example title",
// 	body: "example text",
// 	userId: 1,
// };

// const data2 = {
// 	title: "example title 2",
// 	body: "example text",
// 	userId: 1,
// };

// createData(data);
// createData(data2);
