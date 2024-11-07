class Register {
    constructor(URL) {
        this.URL = URL;
    }
    
    // register costumer to database
    registerCostumer(url, data) {
        $.ajax({
            url: `${this.URL}/${url}`,
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: (data) => {
                toastr.success(data.message);
                setTimeout(() => {
                    location.replace('/user/login');
                }, 500);
            },
            error: (error) => {
                toastr.error(error.responseJSON?.message);
            },
        });
    }

    // get state list based on country 
    selectStat(url, data) {
        $.ajax({
            url: `${this.URL}/${url}`,
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: (data) => {
                toastr.success(data.message);
                $('#state').empty();
                $('#state').append('<option value="" disabled selected>Select State</option>');
                data.data.forEach((state) => {
                    $('#state').append(`<option value="${state.isoCode}">${state.name}</option>`)
                });
                $('#city').empty();
                $('#city').html(`<option value="" disabled selected>Select City</option>`)
            },
            error: (error) => {
                toastr.error(error.responseJSON?.message);
            },
        });
    }

    //get city list based on country and state
    selectCity(url, data) { 
        $.ajax({
            url: `${this.URL}/${url}`,
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: (data) => {
                toastr.success(data.message);
                $('#city').empty();
                $('#city').append('<option value="" disabled selected>Select City</option>');
                data.data.forEach((city) => {
                    $('#city').append(`<option value="${city.name}">${city.name}</option>`)
                });
            },
            error: (error) => {
                toastr.error(error.responseJSON?.message);
            },
        });
    }
}

$(document).ready(function () {
    const register = new Register('http://localhost:3000');

    $('#submitRegisterUserData').on('click', function (event) {
        event.preventDefault();
        const confirmPassword = $('#confirm-password').val();
        const userData = {
            name: $('#fullname').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            state: $('#state').val(), 
            country: $('#country').val(),
            city: $('#city').val()
        };

        if (confirmPassword != userData.password) {
            return toastr.error('Both password is not same');
        } else {
            register.registerCostumer(`user/add`, userData);
        }
    });

    $('#country').on('change', function (event) {
        event.preventDefault();
        const country = $('#country').val();
        register.selectStat(`user/country`, { country });
    });

    $('#state').on('change', function (event) {
        event.preventDefault();
        const state = $('#state').val();
        const country = $('#country').val();
        register.selectCity(`user/state`, { country, state });
    });
});
