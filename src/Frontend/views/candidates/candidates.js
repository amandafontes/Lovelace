$(document).ready(() => {
    // Obter parâmetro id da url
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const jobId = urlParams.get('jobId')

    $.ajax({
        url: `/job/${jobId}/getUsers`,
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            if (res.length > 0 ) {
                let elements = ''
                for (user of res) {
                    elements += ` <div class="gridBox">
                                    <h4 class="boxTitle">${user.firstName} ${user.lastName}</h4>
                                    <p class="boxSubTitle">${user.country}</p>
                                    <div class="badgeContainer">
                                        <span class="badge badge-yellow"> Html </span>
                                        <span class="badge badge-yellow"> Css </span>
                                    </div>
                                    <p class="boxText">
                                        ${user.aboutYou.length > 140 ? user.aboutYou.slice(0, 160) + '...' : user.aboutYou}
                                    </p>
                                    <a class="btn btn-yellow" href="../candidateProfile/candidateProfile.html?id=${
                                        user.id
                                    }">Mais detalhes</a>
                                </div>`
                }
                $('.grid').html(elements)

            } else {
                $('.grid').html('<p class="noCandidate">Nenhuma candidata deu match nessa vaga!</p>')
            }
            
        },
        error: function (err) {
            console.log(err)
        },
    })
})
