$(document).ready(function() {

    $('#close').on('click', function() {
        document.body.style.overflow = '';
        $('.overlay, #thanks').fadeOut('slow');
    });

    function validateForms(form) {
        $(form).validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                email: {
                    required: true,
                    email: true
                },
                subject: {
                    required: true
                },
                text: "required",
                policy: "required"
            },
            messages: {
                name: {
                    required: "Please specify your name",
                    minlength: jQuery.validator.format("At least {0} characters required")
                },
                email: {
                  required: "We need your email address to contact you",
                  email: "Please enter a valid email address"
                },
                subject: {
                    required: "This field is required"
                },
                text: {
                    required: "Please wright your message here"
                },
                policy: {
                    required: "We're unable to store and use your information unless you give us your permission. Please select Yes to allow this"
                }

            }
        });
    };

    validateForms('#contact-form');

    $('#contact-form').submit(function(e) {
        e.preventDefault();

        if (!$(this).valid()) {
            return;
        }

        $.ajax({
            type: "POST",
            url: "mailer/smart.php",
            data: $(this).serialize()
            }).done(function() {
                $(this).find("input").val("");
                $(this).find("textarea").val("");

                $('.overlay, #thanks').fadeIn('slow');
                document.body.style.overflow = 'hidden';


                $("form").trigger("reset");
        });
        return false;
    });



    //  pageup
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('.pageup').fadeIn();
        } else {
            $('.pageup').fadeOut();;
        }
    });

    $(window).scroll(function() {
        if ($(this).scrollTop() > 500) {
            $('.header.header_alt').fadeIn();
        } else {
            $('.header_alt').fadeOut();;
        }
    });

    new WOW().init();

});