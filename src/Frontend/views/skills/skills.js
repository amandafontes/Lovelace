$(document).ready(() => {
    const backdrop = $('.backdrop')
    const modal = $('.modal')

    $.ajax({
        url: '/skills',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            let skillElements = '';
            for (skill of res) {
                skillElements +=
                    `<tr class="row">
                    <td>${skill.name}</td>
                    <td>${skill.type == 0 ? "Técnica" : "Interpessoal"}</td>
                    <td><img class="trashIcon" src="../../assets/skills/trashIcon.png" alt="Lixo" onclick="deleteSkill(${skill.id})" /></td>
                </tr>`;
            }
            $('.skillTable').append(skillElements)
        },
        error: function (err) {
            console.log(err)
        },
    })

    const openModal = () => {
        backdrop.css('display', 'block')
        modal.css('display', 'block')
    }

    const closeModal = () => {
        backdrop.css('display', 'none')
        modal.css('display', 'none')
    }

    $('#modalBtn').click(openModal)
    $('.backdrop').click(closeModal)

    $('#createSkill').click(() => {
        const skillName = $('#skillName').val()
        const skillType = $('#skillType').val()
        console.log(skillName, skillType)

        if (skillName && skillType) {
            $.ajax({
                url: '/skill/create',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ name: skillName, type: skillType }),
                success: function (res) {
                    window.location.reload()
                },
                error: function (err) {
                    console.log(err)
                },
            })
        }
    })

    // // $('#deleteSkill').click (() => {
    // //     const skillName = $('#skillName').val()
    // //     const skillType = $('#skillType').val()
    // //     $.ajax({
    // //         url: '/skill/:id',
    // //         type: 'DELETE',
    // //         contentType: 'application/json',
    // //         body: JSON.stringify({ name: skillName, type: skillType }),
    // //         success: function (res) {
    // //             window.location.reload()
    // //         },
    // //         error: function (err) {
    // //             console.log(err)
    // //         },
    // //     })
    // // })
})

function deleteSkill(id) {
    $.ajax({
        url: '/skill/'+id,
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
