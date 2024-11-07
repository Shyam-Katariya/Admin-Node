class Login {
    constructor(URL) {
        this.URL = URL;
    }

    // this method do user login
    userLogin(URL, data) {
        const { email, password } = data;
        $.ajax({
            url: `${this.URL}/${URL}`,
            method: 'POST',
            data: JSON.stringify({ email, password }),
            contentType: 'application/json',
            success: (data) => {
                window.localStorage.setItem(
                    'userDetail',
                    JSON.stringify(data?.data)
                );
                toastr.success('Success', data.message);
                setTimeout(() => {
                    location.replace(`/user/dashboard`);
                }, 500);
            },
            error: (error) => {
                toastr.error('Error', error.responseJSON?.message);
            },
        });
    }

    adminLogin(URL, data) {
        $.ajax({
            url: `${this.URL}/${URL}`,
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: (data) => {
                toastr.success('Success', data.message);
                setTimeout(() => {
                    location.replace('/admin/dashboard');
                }, 500);
            },
            error: (error) => {
                toastr.error('Error', error.responseJSON?.message);
            },
        });
    }
}

$(document).ready(function () {
    const API_PREFIX = 'http://localhost:3000';
    const login = new Login('http://localhost:3000');

    $('#loginButton').on('click', function (event) {
        event.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();
        // user login method
        login.userLogin(`user/login`, { email, password });
    });

    $('#adminLoginButton').on('click', function (event) {
        event.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();
        // admin login method
        login.adminLogin(`admin/login`, { email, password });
    });
});
