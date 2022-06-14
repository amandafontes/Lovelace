$(document).ready(() => {
    const logoutButton = $('#logoutButton')

    logoutButton.click(() => {
        $.ajax({
            url: '/logout',
            type: 'POST',
            contentType: 'application/json',
            success: function (res) {
                window.location.replace('/views/landingPage/landingPage.html')
            },
            error: function (err) {
                window.location.replace('/views/landingPage/landingPage.html')
            },
        })
    })
})
