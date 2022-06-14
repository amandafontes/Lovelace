// Função executada quando a página é carregada
$(document).ready(() => {
    // Permitir a busca e a seleção múltipla do select
    $('.skillSelect').select2({
        allowClear: true,
    })

    $.ajax({
        url: '/skills',
        type: 'GET',
        contentType: 'application/json',
        success: function (res) {
            let hardSkillOptions = ''
            let softSkillOptions = ''
            for (skill of res) {
                if (skill.type == 0) {
                    hardSkillOptions += `<option value="${skill.id}">${skill.name}</option>`
                } else {
                    softSkillOptions += `<option value="${skill.id}">${skill.name}</option>`
                }
            }

            $('#hardSkills').html(hardSkillOptions)
            $('#softSkills').html(softSkillOptions)
        },
        error: function (err) {
            console.log(err)
        },
    })

    $('#createJobButton').click(() => {
        const form = {
            type : $('#jobType').val(),
            workModel: $('#jobModel').val(),
            area: $('#jobArea').val(),
            skills: $('#hardSkills').val().concat( $('#softSkills').val())
        }

        $.ajax({
            url: '/job/create',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(form),
            success: function (res) {
                window.location.replace('/views/jobs/jobs.html')
            },
            error: function (err) {
                console.log(err)
            },
        })
    })
})
