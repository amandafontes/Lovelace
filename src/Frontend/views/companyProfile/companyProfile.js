$(document).ready(() => {
    // Obter parâmetro id da url
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const id = urlParams.get('id')

    const likeButton = () => {
        $('#like').addClass('like')
        $('#like').removeClass('dislike')
        $('#like').html('Like')
    }

    const dislikeButton = () => {
        $('#like').removeClass('like')
        $('#like').addClass('dislike')
        $('#like').html('Dislike')
    }

    $.ajax({
        url: '/user/getCompanies/' + id,
        type: 'GET',
        contentType: 'application/json',
        success: function ({company, isLiked}) {
            
            $('.title').html(company.name)
            $('#philosophy').html(company.companyPhilosophy)
            $('#culture').html(company.companyCulture)
            $('#openingDate').html('Data de Abertura: ' + company.openingDate)
            $('#marketNiche').html('Nicho: ' + company.marketNiche)
            $('#badges').html('Mais detalhes: ' + company.badges)
            console.log(isLiked)
            if (isLiked) {
                dislikeButton()
            } else {
               likeButton()
            }
        },
        error: function (err) {
            console.log(err)
        },
    })

    $('#like').click(() => {
        if ($('#like').hasClass('like')) {
            $.ajax({
                url: '/user/likeCompany/' + id,
                type: 'GET',
                contentType: 'application/json',
                success: function (res) {
                    dislikeButton()
                },
                error: function (err) {
                    dislikeButton()
                },
            })
        } else {
            $.ajax({
                url: '/user/likeCompany/' + id,
                type: 'DELETE',
                contentType: 'application/json',
                success: function (res) {
                    likeButton()
                },
            })
        }
    })
})
