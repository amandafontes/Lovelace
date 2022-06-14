function getAge(dateString) {
    var today = new Date()
    var birthDate = new Date(dateString)
    var age = today.getFullYear() - birthDate.getFullYear()
    var m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
}

$(document).ready(() => {
    var url_string = window.location.href
    var url = new URL(url_string)
    var id = url.searchParams.get('id')
    console.log(id)

    $.ajax({
        url: '/job/getUsers/' + id,
        type: 'GET',
        contentType: 'application/json',
        success: function (user) {
            $('#title').html(user.firstName + ' ' + user.lastName)
            $('#age').html(getAge(user.birthDate) + ' anos')
            $('#location').html(user.address.city + ' / ' + user.address.state)
            $('#history').html(user.aboutYou)

            let hardSkills = ''
            let softSkills = ''

            for (skill of user.skills) {
                if (skill.type == 0) {
                    hardSkills += `<span class="badge badge-yellow">${skill.name}</span>`
                } else {
                    softSkills += `<span class="badge badge-blue">${skill.name}</span>`
                }
            }

            $('#hardSkillsContainer').html(hardSkills)
            $('#softSkillsContainer').html(softSkills)

            $('#email').html(user.email)
            $('#phone').html(user.phone)
        },
        error: function (err) {
            console.log(err)
        },
    })
})
