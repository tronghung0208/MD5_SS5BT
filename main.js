// PHẦN KHAI BÁO DỮ LIỆU

const bodySelector = document.querySelector("tbody");

const nameSelector = document.querySelector("#name");
const emailSelector = document.querySelector("#email");
const telNumberSelector = document.querySelector("#telNumber");
const addressSelector = document.querySelector("#address");
const genderSelector = document.querySelector(".gender-radio:checked");
const submitSelector = document.querySelector(".save-student");
const searchSelector = document.querySelector(".search");
const inputSearchSelector = document.querySelector(".search-value");
const sortSelector = document.querySelector(".sort");

//PHẦN HÀM THỰC THI
let isUpdateMode = false;
let isSort = false;
let getDataAPI;

// render dữ liệu
const getData = () => {
  $.ajax({
    method: "GET",
    url: "http://localhost:8080/category",
    dataType: "JSON",
    success: (response) => {
      getDataAPI = [...response];
      showData(response);
    },
    error: (err) => {
      console.log(err);
    },
  });
};
getData();
// SẮP XẾP
const sortAlphabetically = () => {
  console.log(isSort);
  // Lấy dữ liệu hiện tại từ API hoặc nơi nào đó
  if (!isSort) {
    getDataAPI.sort((a, b) => a.name.localeCompare(b.name));
    showData(getDataAPI);
  } else {
    getData();
  }
  isSort = !isSort;
};

// Hiển thị dữ liệu lên table
const showData = (allData) => {
  let result = "";
  for (let i = 0; i < allData.length; i++) {
    result += `<tr>
      <td>${i + 1}</td>
      <td>${allData[i].id}</td>
      <td>${allData[i].name}</td>
      <td>${allData[i].status ? "Hiện" : "Ẩn"}</td>
      <td>
        <button class="btn-edit" onclick="editItem(${
          allData[i].id
        })">Edit</button>
        <button class="btn-denger" onclick="deleteItem(${
          allData[i].id
        })">Delete</button>
      </td>
    </tr>`;
  }
  bodySelector.innerHTML = result;
};

// thêm dữ liệu
$("#btn-category").click(function (e) {
  e.preventDefault();
  let categoryId = $("#category-id").val();
  let categoryName = $("#category-name").val();
  let categoryStatus = $('input[name="category-status"]:checked').val();
  categoryStatus = categoryStatus == "true" ? true : false;
  let data = { id: categoryId, name: categoryName, status: categoryStatus };
  data = JSON.stringify(data);
  if (isUpdateMode) {
    $.ajax({
      method: "PUT",
      url: `http://localhost:8080/category/${categoryId}`,
      dataType: "JSON",
      contentType: "application/json",
      data: data,
      success: (response) => {
        getData();
        document.getElementById("category-form").reset();
      },
      error: (err) => {
        console.log(err);
      },
    });

    isUpdateMode = false;
    toggleButton();
  } else {
    $.ajax({
      method: "POST",
      url: "http://localhost:8080/category",
      dataType: "JSON",
      contentType: "application/json",
      data: data,
      success: (response) => {
        getData();
        document.getElementById("category-form").reset();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
});

// Edit dữ liệu
let idEdit;
const editItem = (id) => {
  (idEdit = id),
    $.ajax({
      method: "GET",
      url: `http://localhost:8080/category/${idEdit}`,
      success: (response) => {
        // Đổ dữ liệu từ response vào form
        $("#category-id").val(response.id);
        $("#category-name").val(response.name);
        $(
          "input[name='category-status'][value='" +
            (response.status ? "false" : "true") +
            "']"
        ).prop("checked", true);
        isUpdateMode = true;
        toggleButton();
      },
      error: (err) => {
        console.log(err);
      },
    });
};
// Xóa dữ liệu
let deleteId;
const deleteItem = (id) => {
  deleteId = id;
  if (confirm("Bạn muốn xóa ?")) {
    $.ajax({
      method: "DELETE",
      url: `http://localhost:8080/category/${deleteId}`,
      success: (response) => {
        getData();
      },
      error: (err) => {
        console.log(err);
      },
    });
  } else {
    console.log("Deletion canceled");
  }
};

function toggleButton() {
  const button = document.getElementById("btn-category");

  // Nếu đang ở chế độ Submit, chuyển sang chế độ Update
  if (isUpdateMode) {
    button.innerText = "Update";
    // button.id = "btn-update"; // Thiết lập giá trị mới cho thuộc tính id
  } else {
    // Nếu đang ở chế độ Update, chuyển sang chế độ Submit
    button.innerText = "Submit";
    // button.id = "btn-category"; // Thiết lập giá trị mới cho thuộc tính id
  }

  // Đảo ngược trạng thái của biến isUpdateMode
  // isUpdateMode = true;
  console.log(isUpdateMode);
}

const searchData = () => {
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase();
  console.log("getDataAPI", getDataAPI);

  // Lọc dữ liệu theo giá trị tìm kiếm
  const filteredData = getDataAPI.filter((item) =>
    item.name.toLowerCase().includes(searchValue)
  );

  // Hiển thị kết quả tìm kiếm
  showData(filteredData);
};
