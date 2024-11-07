class Dashboard {
    constructor(URL) {
        this.URL = URL;
    }

    // update user status
    changeUserStatus(url, data) {
        const newStatus = !data;
        $.ajax({
            url: `${this.URL}/${url}`,
            method: 'PATCH',
            data: JSON.stringify({ status: newStatus }),
            contentType: 'application/json',
            success: (data) => {
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

    // logout user or Admin
    logout(url) {
        $.ajax({
            url: `${this.URL}/${url}`,
            method: 'POST',
            contentType: 'application/json',
            success: (data) => {
                window.localStorage.clear();
                toastr.success(data.message);
                setTimeout(() => {
                    location.replace('/');
                }, 500);
            },
            error: (error) => {
                window.localStorage.clear();
                toastr.success('Logout successfully');
                setTimeout(() => {
                    location.replace('/');
                }, 500);
            },
        });
    }

    // update user detail
    updateUserDetail(url, data) {
        $.ajax({
            url: `${this.URL}/${url}`,
            method: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: (data) => {
                toastr.success(data.message);
                window.localStorage.setItem(
                    'userDetail',
                    JSON.stringify(data?.data)
                );
                setTimeout(() => {
                    location.replace(`/user/dashboard`);
                }, 500);
            },
            error: (error) => {
                window.localStorage.clear();
                toastr.error(error.responseJSON?.message);
            },
        });
    }
}

$(document).ready(function () {
    const dashboard = new Dashboard('http://localhost:3000');

    $(document).on('change', '.changeStatus', function (event) {
        event.preventDefault();
        event.stopPropagation();
        const postId = $(this).data('id');
        const status = $(this).data('status');
        dashboard.changeUserStatus(`user/status/${postId}`, status);
    });

    $(document).on('click', '#logoutButton', function (event) {
        event.preventDefault();
        dashboard.logout('logout');
    });

    $(document).on('click', '#updateUserDetail', function (event) {
        event.preventDefault();
        const postId = $(this).data('id');
        const name = $('#updateName').val();
        const email = $('#updateEmail').val();
        dashboard.updateUserDetail(`user/update/${postId}`, { name, email });
    });
});
