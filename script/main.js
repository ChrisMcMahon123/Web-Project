/*
====================================================================================
UI Updating functions
====================================================================================
*/
var categoryArray;

$(document).ready(function () {
    //set the dropdown widths on page load
    dropDownResize();

    //get the hidden select values which allow our php array to be transfered to javascript
    if ($("#category-array").length != 0) {
        categoryArray = document.getElementById('category-array').options;
    }

    if ($("#search-results").length != 0) {
        validateSearchResults();
    }
});

//when the window is resized, update the dropdown widths
$(window).resize(function () {
    dropDownResize();
});

//update dropdown menu widths to match its related button / input
function dropDownResize() {
    if ($("#account-dropdown-menu").length != 0) {
        $("#account-dropdown-menu").width($("#account-dropdown-button").outerWidth());
    }

    if ($("#category-dropdown-menu").length != 0) {
        $("#category-dropdown-menu").width($("#category-search").outerWidth());
    }
}

//will launch the model and assign it all the values of that specific textbook
function openEditModal(callFrom) {
    $("#title-upload").val($("#" + callFrom + "-title").val());
    $("#year-upload").val($("#" + callFrom + "-year").val());
    $("#author-upload").val($("#" + callFrom + "-author").val());
    $("#category-search").val($("#" + callFrom + "-category").val());
    $("#textbook-id").val($("#" + callFrom + "-id").val());
    $("#modal-edit").modal();
}

function openUploaderModal(callFrom) {
    $("#name-uploader").html($("#" + callFrom + "-name-uploader").val());
    $("#uploader-avatar").attr("src", $("#" + callFrom + "-uploader-avatar").val());
    $("#uploader-email").html($("#" + callFrom + "-uploader-email").val());
    $("#uploader-joined").html($("#" + callFrom + "-uploader-joined").val());
    $("#uploader-type").html($("#" + callFrom + "-uploader-type").val());
    $("#modal-uploader").modal();
}

function openDeleteModal(callFrom) {
    $("#delete-name").html($("#" + callFrom + "-title").val());
    $("#delete-delete").attr("href", "../php/delete_textbook.php?id=" + $("#" + callFrom + "-id").val());
    $("#modal-delete").modal();
}

//display custom error model for file inputs
function openErrorFileModal(message) {
    $("#error-message").html(message);
    $("#modal-file-error").modal();
}

//update the text input when a dropdown entry is clicked
function updateCategory(value) {
    $("#category-search").val(value);
}

//filter the custom dropdown with any entries that match the inputted text
function filterCategories(value) {
    for (i = 0; i < categoryArray.length; i++) {
        if (categoryArray[i].text.toLowerCase().includes(value.toLowerCase())) {
            $("#" + categoryArray[i].value).attr("tabindex", "-1");
            $("#" + categoryArray[i].value).attr("role", "menuitem");
            $("#" + categoryArray[i].value).addClass("dropdown-item");
            $("#" + categoryArray[i].value).show();
        }
        else {
            $("#" + categoryArray[i].value).removeAttr("tabindex");
            $("#" + categoryArray[i].value).removeAttr("role");
            $("#" + categoryArray[i].value).removeClass("dropdown-item");
            $("#" + categoryArray[i].value).hide();
        }
    }
}

//used for the custom bootstrap text + dropdown input
function enterKeySelection(key, value) {
    if (key === "Enter") {
        $("#" + value).click();
    }
}

//any file select will call this to display the selected file
function displayFileName(value, id) {
    //console.log(id);
    if (value != null) {
        var fileName = value.slice(value.lastIndexOf("\\") + 1, value.length)
        $("#" + id).text(fileName);
    }
    else {
        $("#" + id).text("Select File");
    }
}

//called when password & password-confirm fields are updated on keyup
function checkPasswords() {
    var password = $("#password-input").val();
    var passwordConfirm = $("#password-confirm").val();

    $("#password-input").removeClass("is-valid is-invalid");
    $("#password-confirm").removeClass("is-valid is-invalid");

    $("#password-input-hint").removeClass("valid-feedback invalid-feedback");
    $("#password-confirm-hint").removeClass("valid-feedback invalid-feedback");
    $("#password-input-hint").text("");
    $("#password-confirm-hint").text("");

    if (password != "" && passwordConfirm != "") {
        if (password === passwordConfirm) {
            $("#password-input").addClass("is-valid");
            $("#password-confirm").addClass("is-valid");

            $("#password-input-hint").addClass("valid-feedback");
            $("#password-confirm-hint").addClass("valid-feedback");
            $("#password-input-hint").text("Passwords Match");
            $("#password-confirm-hint").text("Passwords Match");
        }
        else {
            $("#password-input").addClass("is-invalid");
            $("#password-confirm").addClass("is-invalid");

            $("#password-input-hint").addClass("invalid-feedback");
            $("#password-confirm-hint").addClass("invalid-feedback");
            $("#password-input-hint").text("Passwords Dont Match");
            $("#password-confirm-hint").text("Passwords Dont Match");
        }
    }
}
/*
====================================================================================
Validation functions - all call ajax functions and wait for them to complete
====================================================================================
*/
function validateContact(form) {
    $.when(contactAjaxCall())
        .done(function (result) {
            //console.log(result);

            if (result["form-valid"]) {
                form.submit();
            }
            else {
                //form submission is not valid, give user feedback
                $("#email-contact").removeClass("is-valid is-invalid");
                $("#email-contact-hint").removeClass("valid-feedback invalid-feedback");
                $("#email-contact-hint").text("");

                $("#message-contact").removeClass("is-valid is-invalid");
                $("#message-contact-hint").removeClass("valid-feedback invalid-feedback");
                $("#message-contact-hint").text("");

                if (result["email"]) {
                    $("#email-contact").addClass("is-valid");
                    $("#email-contact-hint").addClass("valid-feedback");
                    $("#email-contact-hint").text("Email Address is Valid");
                }
                else {
                    $("#email-contact").addClass("is-invalid");
                    $("#email-contact-hint").addClass("invalid-feedback");
                    $("#email-contact-hint").text("Email Address is Invalid");
                }

                if (result["message"]) {
                    $("#message-contact").addClass("is-valid");
                    $("#message-contact-hint").addClass("valid-feedback");
                }
                else {
                    $("#message-contact").addClass("is-invalid");
                    $("#message-contact-hint").addClass("invalid-feedback");
                    $("#message-contact-hint").text("Required");
                }

                return false;
            }
        });

    return false;
}

function validateAccountForm(form) {
    $.when(accountAjaxCall())
        .done(function (result) {
            console.log(result);

            if (result["form-valid"]) {
                console.log(form);
                form.submit();
            }
            else {
                $("#name-input").removeClass("is-valid is-invalid");
                $("#name-input-hint").removeClass("valid-feedback invalid-feedback");
                $("#name-input-hint").text("");

                $("#image-avatar").removeClass("is-valid is-invalid");

                $("#password-input").removeClass("is-valid is-invalid");
                $("#password-confirm").removeClass("is-valid is-invalid");
                $("#password-input-hint").removeClass("valid-feedback invalid-feedback");
                $("#password-confirm-hint").removeClass("valid-feedback invalid-feedback");
                $("#password-input-hint").text("");
                $("#password-confirm-hint").text("");

                if (result["name"]) {
                    $("#name-input").addClass("is-valid");

                    $("#name-input-hint").addClass("valid-feedback");
                    $("#name-input-hint").text("Name is Valid");
                }
                else {
                    $("#name-input").addClass("is-invalid");

                    $("#name-input-hint").addClass("invalid-feedback");
                    $("#name-input-hint").text("Required");
                }

                if (result["avatar"]) {
                    $("#image-avatar").addClass("is-valid");
                }
                else {
                    $("#image-avatar").addClass("is-invalid");
                    openErrorFileModal(result["avatar_message"]);
                }

                displayPasswordValidationResults(result);
            }

            return false;
        });

    return false;
}

function validateLogin(form) {
    $.when(loginAjaxCall())
        .done(function (result) {
            console.log(result);

            if (result["form-valid"] === 1) {
                form.submit();
            }
            else {
                //form submission is not valid, give user feedback
                $("#email-login").removeClass("is-valid is-invalid");
                $("#email-login-hint").removeClass("valid-feedback invalid-feedback");
                $("#email-login-hint").text("");

                $("#password-login").removeClass("is-valid is-invalid");
                $("#password-login-hint").removeClass("valid-feedback invalid-feedback");
                $("#password-login-hint").text("");

                if (result["form-valid"] === 0) {
                    $("#email-login").addClass("is-invalid");
                    $("#email-login-hint").addClass("invalid-feedback");

                    $("#password-login").addClass("is-invalid");
                    $("#password-login-hint").addClass("invalid-feedback");
                    $("#password-login-hint").text("Login Credentials are Incorrect");
                }
                else if (result["form-valid"] === -1) {
                    if (result["email"]) {
                        $("#email-login").addClass("is-valid");
                        $("#email-login-hint").addClass("valid-feedback");
                        $("#email-login-hint").text("Email Address is Valid");
                    }
                    else {
                        $("#email-login").addClass("is-invalid");
                        $("#email-login-hint").addClass("invalid-feedback");
                        $("#email-login-hint").text("Email Address is Invalid");
                    }

                    if (result["password"]) {
                        $("#password-login").addClass("is-valid");
                        $("#password-login-hint").addClass("valid-feedback");
                    }
                    else {
                        $("#password-login").addClass("is-invalid");
                        $("#password-login-hint").addClass("invalid-feedback");
                        $("#password-login-hint").text("Required");
                    }
                }
                else if (result["form-valid"] === -2) {
                    $("#email-login").addClass("is-invalid");
                    $("#email-login-hint").addClass("invalid-feedback");

                    $("#password-login").addClass("is-invalid");
                    $("#password-login-hint").addClass("invalid-feedback");
                    $("#password-login-hint").text("Internal Server Error");
                }

                return false;
            }
        });

    return false;
}

function validateSignUp(form) {
    $.when(signupAjaxCall())
        .done(function (result) {
            console.log(result);

            if (result["form-valid"]) {
                console.log(form);
                form.submit();
            }
            else {
                //form submission is not valid, give user feedback
                $("#email-signup").removeClass("is-valid is-invalid");
                $("#email-signup-hint").removeClass("valid-feedback invalid-feedback");
                $("#email-signup-hint").text("");

                $("#name-signup").removeClass("is-valid is-invalid");
                $("#name-signup-hint").removeClass("valid-feedback invalid-feedback");
                $("#name-signup-hint").text("");

                $("#image-avatar").removeClass("is-valid is-invalid");

                $("#password-input").removeClass("is-valid is-invalid");
                $("#password-confirm").removeClass("is-valid is-invalid");
                $("#password-input-hint").removeClass("valid-feedback invalid-feedback");
                $("#password-confirm-hint").removeClass("valid-feedback invalid-feedback");
                $("#password-input-hint").text("");
                $("#password-confirm-hint").text("");

                if (result["email"] === 1) {
                    $("#email-signup").addClass("is-valid");
                    $("#email-signup-hint").addClass("valid-feedback");
                    $("#email-signup-hint").text("Email Address is Valid and Unique");
                }
                else if (result["email"] === 0) {
                    $("#email-signup").addClass("is-invalid");
                    $("#email-signup-hint").addClass("invalid-feedback");
                    $("#email-signup-hint").text("Email Address is Invalid");
                }
                else if (result["email"] === -1) {
                    $("#email-signup").addClass("is-invalid");
                    $("#email-signup-hint").addClass("invalid-feedback");
                    $("#email-signup-hint").text("An Account is Already using this Email Address");
                }
                else if (result["email"] === -2) {
                    $("#email-signup").addClass("is-invalid");
                    $("#email-signup-hint").addClass("invalid-feedback");
                    $("#email-signup-hint").text("Internal Server Error");
                }

                if (result["name"]) {
                    $("#name-signup").addClass("is-valid");

                    $("#name-signup-hint").addClass("valid-feedback");
                    $("#name-signup-hint").text("Name is Valid");
                }
                else {
                    $("#name-signup").addClass("is-invalid");

                    $("#name-signup-hint").addClass("invalid-feedback");
                    $("#name-signup-hint").text("Required");
                }

                if (result["avatar"]) {
                    $("#image-avatar").addClass("is-valid");
                }
                else {
                    $("#image-avatar").addClass("is-invalid");
                    openErrorFileModal(result["avatar_message"]);
                }

                displayPasswordValidationResults(result);

                return false;
            }
        });

    return false;
}

function validateUploadForm(form) {
    $.when(uploadAjaxCall())
        .done(function (result) {
            console.log(result);

            if (result["form-valid"]) {
                console.log(form);
                form.submit();
            }
            else {
                $("#title-upload").removeClass("is-valid is-invalid");
                $("#title-upload-hint").removeClass("valid-feedback invalid-feedback");
                $("#title-upload-hint").text("");

                $("#year-upload").removeClass("is-valid is-invalid");
                $("#year-upload-hint").removeClass("valid-feedback invalid-feedback");
                $("#year-upload-hint").text("");

                $("#author-upload").removeClass("is-valid is-invalid");
                $("#author-upload-hint").removeClass("valid-feedback invalid-feedback");
                $("#author-upload-hint").text("");

                $("#category-search-hint").removeClass("valid-feedback-custom invalid-feedback-custom");
                $("#category-search-hint").html("");

                $("#file-upload").removeClass("is-valid is-invalid");

                $("#cover-upload").removeClass("is-valid is-invalid");

                if (result['title']) {
                    $("#title-upload").addClass("is-valid");
                    $("#title-upload-hint").addClass("valid-feedback");
                    $("#title-upload-hint").text("Textbook Title is Valid");
                }
                else {
                    $("#title-upload").addClass("is-invalid");
                    $("#title-upload-hint").addClass("invalid-feedback");
                    $("#title-upload-hint").text("Required");
                }

                if (result['year'] == 1) {
                    $("#year-upload").addClass("is-valid");
                    $("#year-upload-hint").addClass("valid-feedback");
                    $("#year-upload-hint").text("Published Year is Valid");
                }
                else {
                    if (result['year'] == 0) {
                        //not filled out
                        $("#year-upload").addClass("is-invalid");
                        $("#year-upload-hint").addClass("invalid-feedback");
                        $("#year-upload-hint").text("Required");
                    }
                    else {
                        //invalid
                        $("#year-upload").addClass("is-invalid");
                        $("#year-upload-hint").addClass("invalid-feedback");
                        $("#year-upload-hint").text("Must be a Valid Year between 1900 and 2019");
                    }
                }

                if (result['author']) {
                    $("#author-upload").addClass("is-valid");
                    $("#author-upload-hint").addClass("valid-feedback");
                    $("#author-upload-hint").text("Author is Valid");
                }
                else {
                    $("#author-upload").addClass("is-invalid");
                    $("#author-upload-hint").addClass("invalid-feedback");
                    $("#author-upload-hint").text("Required");
                }

                displayCategoryValidationResults(result);

                var errorMessage = "";

                if (result['cover']) {
                    $("#cover-upload").addClass("is-valid");
                }
                else {
                    $("#cover-upload").addClass("is-invalid");
                    errorMessage = result["cover_message"] + "<br />";
                }

                if (result['file']) {
                    $("#file-upload").addClass("is-valid");
                }
                else {
                    $("#file-upload").addClass("is-invalid");
                    errorMessage += result["file_message"];
                }

                if (!result['cover'] || !result['file']) {
                    openErrorFileModal(errorMessage);
                }

                return false;
            }
        });

    return false;
}

/*
====================================================================================
Ajax functions
====================================================================================
*/
function contactAjaxCall() {
    return $.ajax({
        url: "../php/authenticate_contact.php",
        type: "POST",
        dataType: "json",
        data: {
            "email": $("#email-contact").val(),
            "message": $("#message-contact").val(),
            "type": $("input:radio[name ='type']:checked").val(),
            "ajax": true
        },
        error: function (event, jqxhr, settings, thrownError) {
            console.log(event + " | " + jqxhr + " | " + settings + " | " + thrownError);
        }
    });
}

function accountAjaxCall() {
    //when dealing with files, need to use FormData 
    var formData = new FormData();
    formData.append("name", $("#name-input").val());
    formData.append("password", $("#password-input").val());
    formData.append("password-confirm", $("#password-confirm").val());
    formData.append("avatar", $("input[type=file]")[0].files[0]);
    formData.append("ajax", true);

    return $.ajax({
        url: "../php/authenticate_account.php",
        type: "POST",
        dataType: "json",
        data: formData,
        type: "POST",
        contentType: false,
        processData: false,
        error: function (event, jqxhr, settings, thrownError) {
            console.log(event + " | " + jqxhr + " | " + settings + " | " + thrownError);
        }
    });
}

function loginAjaxCall() {
    return $.ajax({
        url: "../php/authenticate_login.php",
        type: "POST",
        dataType: "json",
        data: {
            "email": $("#email-login").val(),
            "password": $("#password-login").val(),
            "ajax": true
        },
        error: function (event, jqxhr, settings, thrownError) {
            console.log(event + " | " + jqxhr + " | " + settings + " | " + thrownError);
        }
    });
}

function signupAjaxCall() {
    //when dealing with files, need to use FormData 
    var formData = new FormData();
    formData.append("email", $("#email-signup").val());
    formData.append("name", $("#name-signup").val());
    formData.append("password", $("#password-input").val());
    formData.append("password-confirm", $("#password-confirm").val());
    formData.append("avatar", $("input[type=file]")[0].files[0]);
    formData.append("ajax", true);

    return $.ajax({
        url: "../php/authenticate_signup.php",
        type: "POST",
        dataType: "json",
        data: formData,
        type: "POST",
        contentType: false,
        processData: false,
        error: function (event, jqxhr, settings, thrownError) {
            console.log(event + " | " + jqxhr + " | " + settings + " | " + thrownError);
        }
    });
}

function uploadAjaxCall() {
    //when dealing with files, need to use FormData 
    var formData = new FormData();
    formData.append("title", $("#title-upload").val());
    formData.append("year", $("#year-upload").val());
    formData.append("author", $("#author-upload").val());
    formData.append("category", $("#category-search").val());
    formData.append("file", $("input[type=file]")[0].files[0]);
    formData.append("cover", $("input[type=file]")[1].files[0]);
    formData.append("ajax", true);

    return $.ajax({
        url: "../php/authenticate_upload.php",
        type: "POST",
        dataType: "json",
        data: formData,
        type: "POST",
        contentType: false,
        processData: false,
        error: function (event, jqxhr, settings, thrownError) {
            console.log(event + " | " + jqxhr + " | " + settings + " | " + thrownError);
        }
    });
}

function validateSearchResults() {
    $("#search-results").load("../php/form_search.php",
        {
            "title": $("#title-search").val(),
            "year": $("#year-search").val(),
            "author": $("#author-search").val(),
            "category": $("#category-list-search").val(),
        }
    );
}

//used by the validation functions to update feedback on attempted form submission
function displayPasswordValidationResults(result) {
    if (result['password-compare']) {
        $("#password-input").addClass("is-valid");
        $("#password-confirm").addClass("is-valid");

        $("#password-input-hint").addClass("valid-feedback");
        $("#password-confirm-hint").addClass("valid-feedback");
        $("#password-input-hint").text("Passwords Match");
        $("#password-confirm-hint").text("Passwords Match");
    }
    else {
        if (result['password'] && result['password-confirm']) {
            //both passwords filled out, don't match
            $("#password-input").addClass("is-invalid");
            $("#password-confirm").addClass("is-invalid");

            $("#password-input-hint").addClass("invalid-feedback");
            $("#password-confirm-hint").addClass("invalid-feedback");
            $("#password-input-hint").text("Passwords Dont Match");
            $("#password-confirm-hint").text("Passwords Dont Match");
        }
        else if (result['password'] && !result['password-confirm']) {
            //password is only filled out
            $("#password-confirm").addClass("is-invalid");

            $("#password-confirm-hint").addClass("invalid-feedback");
            $("#password-confirm-hint").text("Required");
        }
        else if (!result['password'] && result['password-confirm']) {
            //password-confirm is only filled out
            $("#password-input").addClass("is-invalid");

            $("#password-input-hint").addClass("invalid-feedback");
            $("#password-input-hint").text("Required");
        }
        else if (!result['password'] && !result['password-confirm']) {
            //neither password inputs are filled out
            $("#password-input").addClass("is-invalid");
            $("#password-confirm").addClass("is-invalid");

            $("#password-input-hint").addClass("invalid-feedback");
            $("#password-confirm-hint").addClass("invalid-feedback");
            $("#password-input-hint").text("Required");
            $("#password-confirm-hint").text("Required");
        }
    }
}

function displayCategoryValidationResults(result) {
    if (result['category'] == 2) {
        //valid, new category
        $("#category-search-hint").html("New Category will be Created");
        $("#category-search-hint").addClass("valid-feedback-custom");
    }
    else if (result['category'] == 1) {
        //valid, exisitng category
        $("#category-search-hint").html("Category is Valid");
        $("#category-search-hint").addClass("valid-feedback-custom");
    }
    else if (result['category'] == 0) {
        //not filled out
        $("#category-search-hint").html("Required");
        $("#category-search-hint").addClass("invalid-feedback-custom");
    }
    else if (result['category'] == -1) {
        //no authority to create new category
        $("#category-search-hint").html("Not Allowed to Create New Category");
        $("#category-search-hint").addClass("invalid-feedback-custom");
    }
    else if (result['category'] == -2) {
        //no authority to create new category
        $("#category-search-hint").html("Internal Server Error");
        $("#category-search-hint").addClass("invalid-feedback-custom");
    }
}
