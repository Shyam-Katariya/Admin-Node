class Admin {
    constructor(URL) {
        this.URL = URL;
    }

    addUserAdminForm(url, data) {
        const { name, email, password, image } = data;
        const form = new FormData();
        form.append('name', name);
        form.append('email', email);
        form.append('password', password);
        if (image) { 
            form.append('file', image);
        }
        $.ajax({
            url: `${this.URL}/${url}`,
            method: 'POST',
            data: form,
            processData: false,
            contentType: false,
            success: (data) => {
                window.localStorage.clear();
                toastr.success(data.message);
                setTimeout(() => {
                    location.replace('/admin/dashboard');
                }, 500);
            },
            error: (error) => {
                toastr.error(error.responseJSON?.message);
            },
        });
    }
}

$(document).ready(function () {
    const admin = new Admin('http://localhost:3000');

    // get image id and set default image
    const preview = $('#preview');
    preview.attr('src', '/image/file-user.png').show();

    /* get image id and set image from file url */
    $('#profile').on('change', function (event) {
        const input = event.target;
        if (input?.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.attr('src', e.target.result).show();
            };
            reader.readAsDataURL(input.files[0]);
        }
        if (input?.files[0]?.size > 2 * 1024 * 1024) {
            return toastr.error('File or Image size must be less than 2MB ');
        }
    });

    $('#adminRegister').on('click', function (event) {
        event.preventDefault();
        const data = {
            name: $('#fullname').val(),
            email: $('#email').val(),
            password: $('#password').val(),
        };
        const image = $('#profile')[0].files[0];
        if (image) {
            if (image?.size < 2 * 1024 * 1024) {
                data.image = image;
            } else {
                return toastr.error('File or Image size must be less than 2MB to submit form');
            }
        }
        admin.addUserAdminForm(`admin/add`, data);
    });
});
