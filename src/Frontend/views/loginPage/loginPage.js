// Função executada quando a página é carregada
$(document).ready(() => {
    // Obter parâmetro type da url
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const type = urlParams.get('type')

    const form = $('.loginForm')
    const loginButton = $('.loginBtn')
    const errorBadge = $('.errorBadge')
    const termInput = $('#terms')

    let url = ''
    let nextPage = ''

    // Checar o parâmetro da url e setar o atributo src dos botões
    if (type == 'user') {
        url = '/user/login'
        nextPage = '/views/companyMatch/companyMatch.html'
        $('.noAccountLink').attr('href', '/views/userSignUp/userSignUp.html')
    } else if (type == 'company') {
        url = '/company/login'
        nextPage = '/views/jobs/jobs.html'
        $('.noAccountLink').attr('href', '/views/companyRegistration/companyRegistration.html')
    } else if (type == 'admin') {
        url = '/admin/login'
        nextPage = '/views/companyApproval/companyApproval.html'
        $('.noAccountLink').css('display', 'none')
    }

    loginButton.click(() => {
        errorBadge.css('display', 'none')
        errorBadge.html('')

        if (termInput.is(':checked')) {
            $.ajax({
                url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ email: $('#email').val(), password: $('#password').val() }),
                success: function (res) {
                    window.location.replace(nextPage)
                },
                error: function (err) {
                    errorBadge.css('display', 'block')
                    errorBadge.html(err.responseText)
                },
            })
        } else {
            errorBadge.css('display', 'block')
            errorBadge.html('É necessário que você concorde com os termos de uso!')
        }
    })
})
