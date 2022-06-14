// Função executada quando a página é carregada
$(document).ready(() => {

    $('#cnpj').mask('00.000.000/0000-00', {reverse: true});
    $('#date').mask('00/00/0000');
    $('#phone_with_ddd').mask('(00) 0000-0000');
    $('#phone_with_ddd2').mask('(00) 0000-0000');
    $('#cep').mask('00000-000');
    $('#cellphone').mask('0 0000-0000')

    $('#finalButton').click(() => {
        const form = {}

        $('#companyAccount :input').each(function () {
            var input = $(this)[0] // This is the jquery object of the input, do what you will
            console.log(input)
            form[input.name] = input.value
        })

        $('#companyInfo :input').each(function () {
            var input = $(this)[0] // This is the jquery object of the input, do what you will
            form[input.name] = input.value
        })

        $('#companyAddress :input').each(function () {
            var input = $(this)[0] // This is the jquery object of the input, do what you will
            form[input.name] = input.value
        })

        $('#companyRecruter :input').each(function () {
            var input = $(this)[0] // This is the jquery object of the input, do what you will
            form[input.name] = input.value
        })

        form.companyPhilosophy = $('#companyPhilosophy').val()
        form.companyCulture = $('#companyCulture').val()
        form.badges = $('#badges').val()
        
        $.ajax({
            url: '/company/signUp',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(form),
            success: function (res) {
                window.location.replace('/views/companySignUpCompleted/companySignUpCompleted.html')
            },
            error: function (err) {
                console.log(err)
            },
        })
    })

    // Permitir a busca e a seleção múltipla do select
    $('.skillSelect').select2({
        allowClear: true,
        theme: 'classic',
    })
})

// Variável de controle de estágio do cadastro
let stage = 0

// Url inicial dos icones
const assetsInitialPath = '../../../assets/companyRegistration/'

// Array com container de icones
const iconContainers = [$('.iconImageBox0'), $('.iconImageBox1'), $('.iconImageBox2')]

// Array de objetos com as urls dos diferentes icones e elementos
const icons = [
    {
        yellowIcon: assetsInitialPath + 'infoYellow.png',
        whiteIcon: assetsInitialPath + 'infoWhite.png',
        element: $('.icon0'),
    },
    {
        yellowIcon: assetsInitialPath + 'saveYellow.png',
        whiteIcon: assetsInitialPath + 'saveWhite.png',
        element: $('.icon1'),
    },
    {
        yellowIcon: assetsInitialPath + 'uploadYellow.png',
        whiteIcon: assetsInitialPath + 'uploadWhite.png',
        element: $('.icon2'),
    },
]

// Array com containers
const containers = [$('.stage0'), $('.stage1'), $('.stage2')]

// Setar a opacidade ou o display de cada container
containers[0].css('opacity', 100)
containers[1].css('display', 'none')
containers[2].css('display', 'none')

// Função executada quando o usuário aperta no botão "próximo"
const nextStage = () => {
    // Checar se o estágio é menor que 2
    if (stage < 2) {
        // Função que anima a opacidade do container
        containers[stage].animate(
            {
                opacity: 0,
            },
            400,
            // Função executada quando a animação acaba
            function () {
                // Setar o display do container animado para none
                containers[stage].css('display', 'none')

                // Remover a classe ativo do container do icone
                iconContainers[stage].removeClass('active')

                // Mudar a cor do icone
                icons[stage].element.attr('src', icons[stage].whiteIcon)

                // Passar para o próximo estágio
                stage++

                // Setar o display do próximo container como flex (visível)
                containers[stage].css('display', 'flex')

                // Adicionar a classe ativa ao próximo container de icone
                iconContainers[stage].addClass('active')

                // Mudar a cor do icone
                icons[stage].element.attr('src', icons[stage].yellowIcon)

                // Animar a opacidade do próximo container
                containers[stage].animate(
                    {
                        opacity: 1,
                    },
                    400
                )
            }
        )
    }
}

// Função executada quando o usuário aperta no botão "voltar"
const previousStage = () => {
    // Checar se o estágio é maior que 0

    if (stage > 0) {
        // Função que anima a opacidade do container

        containers[stage].animate(
            {
                opacity: 0,
            },
            400,
            // Função executada quando a animação acaba
            function () {
                // Setar o display do container animado para none
                containers[stage].css('display', 'none')

                // Remover a classe ativo do container do icone
                iconContainers[stage].removeClass('active')

                // Mudar a cor do icone
                icons[stage].element.attr('src', icons[stage].whiteIcon)

                // Passar para o estágio anterior
                stage--

                // Adicionar a classe ativa ao novo container ativo de icone
                iconContainers[stage].addClass('active')

                // Setar o display do novo container ativo como flex (visível)
                containers[stage].css('display', 'flex')

                // Mudar a cor do icone
                icons[stage].element.attr('src', icons[stage].yellowIcon)

                // Animar a opacidade do próximo container
                containers[stage].animate(
                    {
                        opacity: 1,
                    },
                    400
                )
            }
        )
    }
}

// Linkar as funções ao aperto dos botões
$('.nextButton').click(nextStage)
$('.backButton').click(previousStage)
