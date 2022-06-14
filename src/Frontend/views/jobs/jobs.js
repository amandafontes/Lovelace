$(document).ready(() => {
    $.ajax({
        url: '/job',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            let elements = ''
            if (res.length == 0) {
                elements = "<a class='errorMessage'>Você ainda não cadastrou nenhuma vaga. <br> Clique em 'Criar vaga' para disponibilizar uma nova vaga. </a>"
            }
            else {
            for (job of res) {
                elements += `<div class="gridBox">
                                <h4 class="boxTitle">${job.area}</h4>
                                <p class="boxSubTitle">${job.type}</p>
                                <div class="badgeContainer">
                                    <span class="badge badge-blue">${job.workModel}</span>
                                </div>
                                <div class="badgeContainer">`

                for (skill of job.skills) {
                    elements += `<span class="badge badge-yellow">${skill.name}</span>`
                }

                elements += `</div>
                                <div class="iconsContainer">
                                    <a href="/views/candidates/candidates.html?jobId=${job.id}"
                                        ><img src="../../assets/icons/person.svg" class="icon" alt=""
                                    /></a>
                                    <button onClick="deleteJob(${job.id})"><img src="../../assets/icons/trashIcon.png" class="icon" alt=""
                                    /></button>
                                </div>
                            </div>`
            }
        }
            $('.grid').html(elements)
        },
        error: function (err) {
            console.log(err)
        },
    })
})

const deleteJob = (id) => {
    $.ajax({
        url: '/job/' + id,
        type: 'DELETE',
        contentType: 'application/json',
        success: function (res) {
            window.location.reload()
        },
        error: function (err) {
            console.log(err)
        },
    })
}
