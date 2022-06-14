$(document).ready(() => {
    $.ajax({
        url: '/admin/companyApproval',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            if (res.length > 0) {
                let elements = ''
                for (company of res) {
                    elements += `<div class="gridBox">
                                    <h4 class="boxTitle">${company.name}</h4>
                                    <p class="boxSubTitle">${company.address.city} / ${company.address.state}</p>
                                    <p class="boxText">
                                        ${company.marketNiche}
                                    </p>
                                    
                                    <p class="boxText">
                                            ${
                                                company.companyPhilosophy.length > 160
                                                    ? company.companyPhilosophy.slice(0, 160)
                                                    : company.companyPhilosophy
                                            }
                                    </p>
                                    
                                    <a class="btn btn-yellow" href="../viewCompany/viewCompany.html?id=${
                                        company.id
                                    }">Mais detalhes</a>
                                </div>`
                }
                $('.grid').html(elements)
            } else {
                $('.grid').html(`<p class="noDataFound">Nenhuma empresa necessita aprovação!</p>`)
            }
        },
        error: function (err) {
            console.log(err)
        },
    })
})
